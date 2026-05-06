-- =============================================================================
-- Fix: RLS FK 소유권 검증 추가
-- Issue #9 — PM 리뷰 P1 대응
-- INSERT/UPDATE policy에 FK 참조 대상 row가 같은 사용자 소유인지 확인
-- =============================================================================

-- ---------------------------------------------------------------------------
-- source_posts: social_account_id 소유권 검증
-- ---------------------------------------------------------------------------
drop policy if exists "source_posts_insert_own" on public.source_posts;
drop policy if exists "source_posts_update_own" on public.source_posts;

create policy "source_posts_insert_own"
  on public.source_posts for insert
  with check (
    auth.uid() = user_id and
    (
      social_account_id is null or
      exists (
        select 1 from public.social_accounts sa
        where sa.id = social_account_id and sa.user_id = auth.uid()
      )
    )
  );

create policy "source_posts_update_own"
  on public.source_posts for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id and
    (
      social_account_id is null or
      exists (
        select 1 from public.social_accounts sa
        where sa.id = social_account_id and sa.user_id = auth.uid()
      )
    )
  );

-- ---------------------------------------------------------------------------
-- media_assets: source_post_id 소유권 검증
-- ---------------------------------------------------------------------------
drop policy if exists "media_assets_insert_own" on public.media_assets;

create policy "media_assets_insert_own"
  on public.media_assets for insert
  with check (
    auth.uid() = user_id and
    (
      source_post_id is null or
      exists (
        select 1 from public.source_posts sp
        where sp.id = source_post_id and sp.user_id = auth.uid()
      )
    )
  );

-- ---------------------------------------------------------------------------
-- post_draft_sets: source_post_id 소유권 검증
-- ---------------------------------------------------------------------------
drop policy if exists "post_draft_sets_insert_own" on public.post_draft_sets;
drop policy if exists "post_draft_sets_update_own" on public.post_draft_sets;

create policy "post_draft_sets_insert_own"
  on public.post_draft_sets for insert
  with check (
    auth.uid() = user_id and
    (
      source_post_id is null or
      exists (
        select 1 from public.source_posts sp
        where sp.id = source_post_id and sp.user_id = auth.uid()
      )
    )
  );

create policy "post_draft_sets_update_own"
  on public.post_draft_sets for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id and
    (
      source_post_id is null or
      exists (
        select 1 from public.source_posts sp
        where sp.id = source_post_id and sp.user_id = auth.uid()
      )
    )
  );

-- ---------------------------------------------------------------------------
-- post_drafts: draft_set_id 소유권 검증
-- ---------------------------------------------------------------------------
drop policy if exists "post_drafts_insert_own" on public.post_drafts;
drop policy if exists "post_drafts_update_own" on public.post_drafts;

create policy "post_drafts_insert_own"
  on public.post_drafts for insert
  with check (
    auth.uid() = user_id and
    exists (
      select 1 from public.post_draft_sets pds
      where pds.id = draft_set_id and pds.user_id = auth.uid()
    )
  );

create policy "post_drafts_update_own"
  on public.post_drafts for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id and
    exists (
      select 1 from public.post_draft_sets pds
      where pds.id = draft_set_id and pds.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- post_draft_media: post_draft_id + media_asset_id 양쪽 소유권 검증
-- ---------------------------------------------------------------------------
drop policy if exists "post_draft_media_insert_own" on public.post_draft_media;
drop policy if exists "post_draft_media_update_own" on public.post_draft_media;

create policy "post_draft_media_insert_own"
  on public.post_draft_media for insert
  with check (
    exists (
      select 1 from public.post_drafts pd
      where pd.id = post_draft_id and pd.user_id = auth.uid()
    ) and
    exists (
      select 1 from public.media_assets ma
      where ma.id = media_asset_id and ma.user_id = auth.uid()
    )
  );

create policy "post_draft_media_update_own"
  on public.post_draft_media for update
  using (
    exists (
      select 1 from public.post_drafts pd
      where pd.id = post_draft_media.post_draft_id and pd.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.post_drafts pd
      where pd.id = post_draft_media.post_draft_id and pd.user_id = auth.uid()
    ) and
    exists (
      select 1 from public.media_assets ma
      where ma.id = post_draft_media.media_asset_id and ma.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- publish_jobs: post_draft_id 소유권 검증
-- ---------------------------------------------------------------------------
drop policy if exists "publish_jobs_insert_own" on public.publish_jobs;
drop policy if exists "publish_jobs_update_own" on public.publish_jobs;

create policy "publish_jobs_insert_own"
  on public.publish_jobs for insert
  with check (
    auth.uid() = user_id and
    exists (
      select 1 from public.post_drafts pd
      where pd.id = post_draft_id and pd.user_id = auth.uid()
    )
  );

create policy "publish_jobs_update_own"
  on public.publish_jobs for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id and
    exists (
      select 1 from public.post_drafts pd
      where pd.id = post_draft_id and pd.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- manual_publish_tasks: post_draft_id 소유권 검증
-- ---------------------------------------------------------------------------
drop policy if exists "manual_publish_tasks_insert_own" on public.manual_publish_tasks;
drop policy if exists "manual_publish_tasks_update_own" on public.manual_publish_tasks;

create policy "manual_publish_tasks_insert_own"
  on public.manual_publish_tasks for insert
  with check (
    auth.uid() = user_id and
    exists (
      select 1 from public.post_drafts pd
      where pd.id = post_draft_id and pd.user_id = auth.uid()
    )
  );

create policy "manual_publish_tasks_update_own"
  on public.manual_publish_tasks for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id and
    exists (
      select 1 from public.post_drafts pd
      where pd.id = post_draft_id and pd.user_id = auth.uid()
    )
  );
