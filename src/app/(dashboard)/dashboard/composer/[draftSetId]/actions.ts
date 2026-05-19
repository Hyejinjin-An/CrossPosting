"use server";

import { createClient } from "@/lib/supabase/server";

export interface ActionResult {
  success: boolean;
  error?: string;
}

export interface StartManualResult {
  success: boolean;
  taskId?: string;
  error?: string;
}

/** Supabase Server Action — 초안 본문·해시태그 수정 */
export async function updateDraft(
  draftId: string,
  body: string,
  hashtags: string[]
): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "로그인이 필요합니다." };

  const { error } = await supabase
    .from("post_drafts")
    .update({ body, hashtags })
    .eq("id", draftId)
    .eq("user_id", user.id);

  if (error) {
    console.error("[updateDraft] failed:", error.message);
    return { success: false, error: "저장에 실패했습니다." };
  }
  return { success: true };
}

/** Supabase Server Action — Instagram 초안을 '준비 완료' 상태로 전환 */
export async function markDraftReady(draftId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "로그인이 필요합니다." };

  const { error } = await supabase
    .from("post_drafts")
    .update({ status: "ready" })
    .eq("id", draftId)
    .eq("user_id", user.id)
    .eq("target_channel", "instagram");

  if (error) {
    console.error("[markDraftReady] failed:", error.message);
    return { success: false, error: "상태 변경에 실패했습니다." };
  }
  return { success: true };
}

/** Supabase Server Action — KakaoStory 수동 게시 시작: manual_publish_tasks 생성 후 taskId 반환 */
export async function startManualPublish(draftId: string): Promise<StartManualResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "로그인이 필요합니다." };

  // 소유권 + 비즈니스 규칙 검증: 해당 draft가 소유자의 kakaostory 채널인지 확인
  // RLS는 user_id 소유권만 보장하고 target_channel 타입은 검증하지 않으므로 서버에서 직접 체크
  const { data: draft } = await supabase
    .from("post_drafts")
    .select("id, target_channel")
    .eq("id", draftId)
    .eq("user_id", user.id)
    .single();

  if (!draft) {
    return { success: false, error: "초안을 찾을 수 없습니다." };
  }
  if (draft.target_channel !== "kakaostory") {
    return { success: false, error: "KakaoStory 초안만 수동 게시를 시작할 수 있습니다." };
  }

  // 이미 생성된 task가 있으면 재사용 (중복 방지 — unique(post_draft_id, target_channel))
  const { data: existing } = await supabase
    .from("manual_publish_tasks")
    .select("id")
    .eq("post_draft_id", draftId)
    .eq("target_channel", "kakaostory")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    return { success: true, taskId: existing.id };
  }

  const { data: task, error } = await supabase
    .from("manual_publish_tasks")
    .insert({
      user_id: user.id,
      post_draft_id: draftId,
      target_channel: "kakaostory",
      status: "todo",
    })
    .select("id")
    .single();

  if (error || !task) {
    console.error("[startManualPublish] failed:", error?.message);
    return { success: false, error: "수동 게시 시작에 실패했습니다." };
  }
  return { success: true, taskId: task.id };
}
