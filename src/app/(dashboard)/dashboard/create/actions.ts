"use server";

import { createClient } from "@/lib/supabase/server";

type MediaInput = {
  path: string;
  mimeType: string;
  sizeBytes: number;
  sortOrder: number;
};

type SaveDraftInput = {
  body: string;
  /** "#" 제거된 해시태그 배열 */
  hashtags: string[];
  /** "instagram" | "kakaostory" */
  channels: string[];
  storagePaths: MediaInput[];
  /** 생략 시 body 앞 40자를 자동 제목으로 사용 */
  title?: string;
};

export type SaveDraftResult =
  | { success: true; draftSetId: string }
  | { success: false; error: string };

/** Next.js Server Action — post_draft_sets + post_drafts + media_assets 생성 */
export async function saveDraft(input: SaveDraftInput): Promise<SaveDraftResult> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  const title = input.title?.trim() || input.body.slice(0, 40).trim() || null;

  // 1. post_draft_sets 생성 (source_post_id: null = 직접 작성)
  const { data: draftSet, error: draftSetError } = await supabase
    .from("post_draft_sets")
    .insert({ user_id: user.id, status: "draft", title })
    .select("id")
    .single();

  if (draftSetError || !draftSet) {
    console.error("[saveDraft] post_draft_sets insert failed:", draftSetError?.message);
    return { success: false, error: "초안 저장에 실패했습니다." };
  }

  // 2. media_assets 저장 (이미지가 있을 때만)
  if (input.storagePaths.length > 0) {
    const mediaRows = input.storagePaths.map((f) => ({
      user_id: user.id,
      storage_path: f.path,
      mime_type: f.mimeType,
      size_bytes: f.sizeBytes,
      sort_order: f.sortOrder,
    }));

    const { error: mediaError } = await supabase.from("media_assets").insert(mediaRows);
    if (mediaError) {
      // 미디어 저장 실패는 경고만 — 초안 자체는 저장 성공으로 처리
      console.error("[saveDraft] media_assets insert failed:", mediaError.message);
    }
  }

  // 3. 선택 채널별 post_drafts 생성
  const drafts = input.channels.map((channel) => ({
    draft_set_id: draftSet.id,
    user_id: user.id,
    target_channel: channel,
    body: input.body,
    hashtags: input.hashtags,
    status: "draft",
  }));

  if (drafts.length > 0) {
    const { error: draftsError } = await supabase.from("post_drafts").insert(drafts);
    if (draftsError) {
      console.error("[saveDraft] post_drafts insert failed:", draftsError.message);
      return { success: false, error: "초안 저장에 실패했습니다." };
    }
  }

  return { success: true, draftSetId: draftSet.id };
}
