# Database

## 설계 원칙

- 모든 사용자 소유 데이터는 `user_id`를 갖습니다.
- 모든 테이블은 RLS를 활성화합니다.
- 외부 플랫폼 ID는 unique 제약으로 중복 import를 방지합니다.
- 발행 작업은 source, draft, job을 분리해 추적성을 확보합니다.

## 테이블 초안

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table social_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  provider text not null check (provider in ('instagram', 'kakaostory')),
  provider_account_id text not null,
  display_name text,
  account_type text,
  access_token_encrypted text,
  refresh_token_encrypted text,
  token_expires_at timestamptz,
  scopes text[] not null default '{}',
  status text not null default 'active' check (status in ('active', 'expired', 'revoked', 'error')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_account_id)
);

create table source_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  social_account_id uuid not null references social_accounts(id) on delete cascade,
  provider text not null,
  provider_post_id text not null,
  caption text,
  permalink text,
  posted_at timestamptz,
  raw_metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  unique (provider, provider_post_id)
);

create table media_assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  source_post_id uuid references source_posts(id) on delete cascade,
  storage_path text not null,
  original_url text,
  mime_type text,
  width int,
  height int,
  size_bytes int,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table post_drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  source_post_id uuid references source_posts(id) on delete set null,
  target_provider text not null check (target_provider in ('instagram', 'kakaostory')),
  title text,
  body text,
  hashtags text[] not null default '{}',
  media_asset_ids uuid[] not null default '{}',
  validation_errors jsonb not null default '[]',
  status text not null default 'draft' check (status in ('draft', 'ready', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table publish_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  post_draft_id uuid not null references post_drafts(id) on delete cascade,
  target_provider text not null,
  status text not null default 'queued' check (status in ('queued', 'publishing', 'published', 'failed', 'cancelled')),
  idempotency_key text not null,
  scheduled_at timestamptz,
  published_at timestamptz,
  external_post_id text,
  attempt_count int not null default 0,
  last_error_code text,
  last_error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (idempotency_key)
);

create table publish_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  publish_job_id uuid not null references publish_jobs(id) on delete cascade,
  level text not null check (level in ('info', 'warning', 'error')),
  code text,
  message text not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);
```

## RLS 정책 예시

```sql
alter table profiles enable row level security;
alter table social_accounts enable row level security;
alter table source_posts enable row level security;
alter table media_assets enable row level security;
alter table post_drafts enable row level security;
alter table publish_jobs enable row level security;
alter table publish_logs enable row level security;

create policy "Users can read own profile"
on profiles for select
using (auth.uid() = id);

create policy "Users can manage own social accounts"
on social_accounts for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

실제 마이그레이션에서는 각 테이블별 select, insert, update, delete 정책을 분리하고 service role 전용 작업을 별도 함수로 제한하는 것을 권장합니다.
