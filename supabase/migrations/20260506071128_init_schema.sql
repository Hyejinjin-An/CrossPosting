-- =============================================================================
-- CrossPosting MVP — Initial Schema
-- Issue #9: DB 마이그레이션 및 RLS
-- Source of truth: docs/DB_DESIGN.md
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. profiles
-- ---------------------------------------------------------------------------
create table public.profiles (
  id                 uuid        primary key references auth.users(id) on delete cascade,
  display_name       text,
  avatar_url         text,
  onboarding_status  text        not null default 'pending',
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  constraint profiles_onboarding_status_check
    check (onboarding_status in ('pending', 'completed'))
);

-- Auto-create profile on new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name'
    ),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- updated_at trigger helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- RLS
alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- 2. social_accounts
-- ---------------------------------------------------------------------------
create table public.social_accounts (
  id                        uuid        primary key default gen_random_uuid(),
  user_id                   uuid        not null references public.profiles(id) on delete cascade,
  provider                  text        not null,
  provider_account_id       text        not null,
  display_name              text,
  account_type              text,
  access_token_encrypted    text,
  refresh_token_encrypted   text,
  token_expires_at          timestamptz,
  scopes                    text[]      not null default '{}',
  status                    text        not null,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now(),
  constraint social_accounts_provider_check
    check (provider in ('instagram')),
  constraint social_accounts_status_check
    check (status in ('active', 'expired', 'revoked', 'error')),
  constraint social_accounts_unique_account
    unique (user_id, provider, provider_account_id)
);

create trigger social_accounts_set_updated_at
  before update on public.social_accounts
  for each row execute procedure public.set_updated_at();

create index social_accounts_user_provider_idx
  on public.social_accounts (user_id, provider);

alter table public.social_accounts enable row level security;

create policy "social_accounts_select_own"
  on public.social_accounts for select
  using (auth.uid() = user_id);

create policy "social_accounts_insert_own"
  on public.social_accounts for insert
  with check (auth.uid() = user_id);

create policy "social_accounts_update_own"
  on public.social_accounts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "social_accounts_delete_own"
  on public.social_accounts for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 3. source_posts
-- ---------------------------------------------------------------------------
create table public.source_posts (
  id                uuid        primary key default gen_random_uuid(),
  user_id           uuid        not null references public.profiles(id) on delete cascade,
  social_account_id uuid        references public.social_accounts(id) on delete set null,
  source_type       text        not null,
  provider          text,
  provider_post_id  text,
  caption           text,
  permalink         text,
  posted_at         timestamptz,
  raw_metadata      jsonb       not null default '{}',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint source_posts_source_type_check
    check (source_type in ('api_import', 'manual_input'))
);

-- Partial unique index: duplicate-import prevention (only when provider_post_id is set)
create unique index source_posts_unique_provider_post
  on public.source_posts (user_id, provider, provider_post_id)
  where provider_post_id is not null;

create trigger source_posts_set_updated_at
  before update on public.source_posts
  for each row execute procedure public.set_updated_at();

create index source_posts_user_posted_at_idx
  on public.source_posts (user_id, posted_at desc);

alter table public.source_posts enable row level security;

create policy "source_posts_select_own"
  on public.source_posts for select
  using (auth.uid() = user_id);

create policy "source_posts_insert_own"
  on public.source_posts for insert
  with check (auth.uid() = user_id);

create policy "source_posts_update_own"
  on public.source_posts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "source_posts_delete_own"
  on public.source_posts for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 4. media_assets
-- ---------------------------------------------------------------------------
create table public.media_assets (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        not null references public.profiles(id) on delete cascade,
  source_post_id  uuid        references public.source_posts(id) on delete cascade,
  storage_path    text        not null,
  original_url    text,
  mime_type       text,
  width           integer,
  height          integer,
  size_bytes      integer,
  checksum        text,
  sort_order      integer     not null default 0,
  created_at      timestamptz not null default now()
);

-- Partial unique index: sort_order uniqueness within a source_post
create unique index media_assets_unique_sort_order
  on public.media_assets (source_post_id, sort_order)
  where source_post_id is not null;

create index media_assets_source_post_sort_idx
  on public.media_assets (source_post_id, sort_order);

alter table public.media_assets enable row level security;

create policy "media_assets_select_own"
  on public.media_assets for select
  using (auth.uid() = user_id);

create policy "media_assets_insert_own"
  on public.media_assets for insert
  with check (auth.uid() = user_id);

create policy "media_assets_delete_own"
  on public.media_assets for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 5. post_draft_sets
-- ---------------------------------------------------------------------------
create table public.post_draft_sets (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        not null references public.profiles(id) on delete cascade,
  source_post_id  uuid        references public.source_posts(id) on delete set null,
  title           text,
  status          text        not null default 'drafting',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint post_draft_sets_status_check
    check (status in ('drafting', 'ready', 'publishing', 'completed', 'archived'))
);

create trigger post_draft_sets_set_updated_at
  before update on public.post_draft_sets
  for each row execute procedure public.set_updated_at();

create index post_draft_sets_user_created_idx
  on public.post_draft_sets (user_id, created_at desc);

alter table public.post_draft_sets enable row level security;

create policy "post_draft_sets_select_own"
  on public.post_draft_sets for select
  using (auth.uid() = user_id);

create policy "post_draft_sets_insert_own"
  on public.post_draft_sets for insert
  with check (auth.uid() = user_id);

create policy "post_draft_sets_update_own"
  on public.post_draft_sets for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "post_draft_sets_delete_own"
  on public.post_draft_sets for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 6. post_drafts
-- ---------------------------------------------------------------------------
create table public.post_drafts (
  id                uuid        primary key default gen_random_uuid(),
  user_id           uuid        not null references public.profiles(id) on delete cascade,
  draft_set_id      uuid        not null references public.post_draft_sets(id) on delete cascade,
  target_channel    text        not null,
  body              text,
  hashtags          text[]      not null default '{}',
  link_url          text,
  validation_errors jsonb       not null default '[]',
  status            text        not null default 'draft',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint post_drafts_target_channel_check
    check (target_channel in ('instagram', 'line_band', 'kakaostory')),
  constraint post_drafts_status_check
    check (status in ('draft', 'ready', 'queued', 'published', 'manual_done', 'archived')),
  constraint post_drafts_unique_channel_per_set
    unique (draft_set_id, target_channel)
);

create trigger post_drafts_set_updated_at
  before update on public.post_drafts
  for each row execute procedure public.set_updated_at();

create index post_drafts_draft_set_channel_idx
  on public.post_drafts (draft_set_id, target_channel);

alter table public.post_drafts enable row level security;

create policy "post_drafts_select_own"
  on public.post_drafts for select
  using (auth.uid() = user_id);

create policy "post_drafts_insert_own"
  on public.post_drafts for insert
  with check (auth.uid() = user_id);

create policy "post_drafts_update_own"
  on public.post_drafts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "post_drafts_delete_own"
  on public.post_drafts for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 7. post_draft_media
-- ---------------------------------------------------------------------------
create table public.post_draft_media (
  id              uuid        primary key default gen_random_uuid(),
  post_draft_id   uuid        not null references public.post_drafts(id) on delete cascade,
  media_asset_id  uuid        not null references public.media_assets(id) on delete cascade,
  sort_order      integer     not null,
  is_included     boolean     not null default true,
  created_at      timestamptz not null default now(),
  constraint post_draft_media_unique_asset
    unique (post_draft_id, media_asset_id),
  constraint post_draft_media_unique_sort_order
    unique (post_draft_id, sort_order)
);

alter table public.post_draft_media enable row level security;

-- Ownership derives through post_drafts (no user_id column)
create policy "post_draft_media_select_own"
  on public.post_draft_media for select
  using (
    exists (
      select 1 from public.post_drafts
      where post_drafts.id = post_draft_media.post_draft_id
        and post_drafts.user_id = auth.uid()
    )
  );

create policy "post_draft_media_insert_own"
  on public.post_draft_media for insert
  with check (
    exists (
      select 1 from public.post_drafts
      where post_drafts.id = post_draft_media.post_draft_id
        and post_drafts.user_id = auth.uid()
    )
  );

create policy "post_draft_media_update_own"
  on public.post_draft_media for update
  using (
    exists (
      select 1 from public.post_drafts
      where post_drafts.id = post_draft_media.post_draft_id
        and post_drafts.user_id = auth.uid()
    )
  );

create policy "post_draft_media_delete_own"
  on public.post_draft_media for delete
  using (
    exists (
      select 1 from public.post_drafts
      where post_drafts.id = post_draft_media.post_draft_id
        and post_drafts.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- 8. publish_jobs  (Instagram API only — no manual channels)
-- ---------------------------------------------------------------------------
create table public.publish_jobs (
  id                 uuid        primary key default gen_random_uuid(),
  user_id            uuid        not null references public.profiles(id) on delete cascade,
  post_draft_id      uuid        not null references public.post_drafts(id) on delete cascade,
  target_channel     text        not null,
  status             text        not null default 'queued',
  idempotency_key    text        not null,
  scheduled_at       timestamptz,
  published_at       timestamptz,
  external_post_id   text,
  attempt_count      integer     not null default 0,
  last_error_code    text,
  last_error_message text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  constraint publish_jobs_target_channel_check
    check (target_channel = 'instagram'),
  constraint publish_jobs_status_check
    check (status in ('queued', 'publishing', 'published', 'failed', 'cancelled')),
  constraint publish_jobs_idempotency_key_unique
    unique (idempotency_key)
);

create trigger publish_jobs_set_updated_at
  before update on public.publish_jobs
  for each row execute procedure public.set_updated_at();

create index publish_jobs_user_status_created_idx
  on public.publish_jobs (user_id, status, created_at desc);

alter table public.publish_jobs enable row level security;

create policy "publish_jobs_select_own"
  on public.publish_jobs for select
  using (auth.uid() = user_id);

create policy "publish_jobs_insert_own"
  on public.publish_jobs for insert
  with check (auth.uid() = user_id);

create policy "publish_jobs_update_own"
  on public.publish_jobs for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "publish_jobs_delete_own"
  on public.publish_jobs for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 9. manual_publish_tasks  (LINE Band / KakaoStory — 수동 게시 보조만)
-- ---------------------------------------------------------------------------
create table public.manual_publish_tasks (
  id                  uuid        primary key default gen_random_uuid(),
  user_id             uuid        not null references public.profiles(id) on delete cascade,
  post_draft_id       uuid        not null references public.post_drafts(id) on delete cascade,
  target_channel      text        not null,
  status              text        not null default 'todo',
  body_copied_at      timestamptz,
  media_downloaded_at timestamptz,
  opened_platform_at  timestamptz,
  completed_at        timestamptz,
  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  constraint manual_publish_tasks_target_channel_check
    check (target_channel in ('line_band', 'kakaostory')),
  constraint manual_publish_tasks_status_check
    check (status in ('todo', 'in_progress', 'completed', 'skipped')),
  constraint manual_publish_tasks_unique_channel
    unique (post_draft_id, target_channel)
);

create trigger manual_publish_tasks_set_updated_at
  before update on public.manual_publish_tasks
  for each row execute procedure public.set_updated_at();

create index manual_publish_tasks_user_status_created_idx
  on public.manual_publish_tasks (user_id, status, created_at desc);

alter table public.manual_publish_tasks enable row level security;

create policy "manual_publish_tasks_select_own"
  on public.manual_publish_tasks for select
  using (auth.uid() = user_id);

create policy "manual_publish_tasks_insert_own"
  on public.manual_publish_tasks for insert
  with check (auth.uid() = user_id);

create policy "manual_publish_tasks_update_own"
  on public.manual_publish_tasks for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "manual_publish_tasks_delete_own"
  on public.manual_publish_tasks for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 10. publish_logs
-- ---------------------------------------------------------------------------
create table public.publish_logs (
  id                     uuid        primary key default gen_random_uuid(),
  user_id                uuid        not null references public.profiles(id) on delete cascade,
  publish_job_id         uuid        references public.publish_jobs(id) on delete cascade,
  manual_publish_task_id uuid        references public.manual_publish_tasks(id) on delete cascade,
  level                  text        not null,
  code                   text,
  message                text        not null,
  metadata               jsonb       not null default '{}',
  created_at             timestamptz not null default now(),
  constraint publish_logs_level_check
    check (level in ('info', 'warning', 'error')),
  constraint publish_logs_one_source_check
    check (
      (publish_job_id is not null and manual_publish_task_id is null) or
      (publish_job_id is null     and manual_publish_task_id is not null)
    )
);

create index publish_logs_user_created_idx
  on public.publish_logs (user_id, created_at desc);

alter table public.publish_logs enable row level security;

-- Client can read own logs; INSERT is server-only via service role
create policy "publish_logs_select_own"
  on public.publish_logs for select
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 11. Storage: post-media private bucket + policies
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('post-media', 'post-media', false);

-- Upload to own folder (upsert needs INSERT + SELECT + UPDATE)
create policy "post_media_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'post-media' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "post_media_select_own"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'post-media' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "post_media_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'post-media' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "post_media_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'post-media' and
    (storage.foldername(name))[1] = auth.uid()::text
  );
