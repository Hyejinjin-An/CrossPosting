"use server";

import { createClient } from "@/lib/supabase/server";

export interface ActionResult {
  success: boolean;
  error?: string;
}

/** Supabase Server Action — 본문 복사 시각 기록 */
export async function markBodyCopied(taskId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "로그인이 필요합니다." };

  const { error } = await supabase
    .from("manual_publish_tasks")
    .update({ body_copied_at: new Date().toISOString(), status: "in_progress" })
    .eq("id", taskId)
    .eq("user_id", user.id);

  if (error) {
    console.error("[markBodyCopied] failed:", error.message);
    return { success: false, error: "기록 실패" };
  }
  return { success: true };
}

/** Supabase Server Action — 이미지 다운로드 시각 기록 */
export async function markMediaDownloaded(taskId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "로그인이 필요합니다." };

  const { error } = await supabase
    .from("manual_publish_tasks")
    .update({ media_downloaded_at: new Date().toISOString(), status: "in_progress" })
    .eq("id", taskId)
    .eq("user_id", user.id);

  if (error) {
    console.error("[markMediaDownloaded] failed:", error.message);
    return { success: false, error: "기록 실패" };
  }
  return { success: true };
}

/** Supabase Server Action — 카카오스토리 앱 열기 시각 기록 */
export async function markOpened(taskId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "로그인이 필요합니다." };

  const { error } = await supabase
    .from("manual_publish_tasks")
    .update({ opened_platform_at: new Date().toISOString(), status: "in_progress" })
    .eq("id", taskId)
    .eq("user_id", user.id);

  if (error) {
    console.error("[markOpened] failed:", error.message);
    return { success: false, error: "기록 실패" };
  }
  return { success: true };
}

/** Supabase Server Action — 게시 완료 처리 (status = completed, completed_at = now) */
export async function completeTask(taskId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "로그인이 필요합니다." };

  const { error } = await supabase
    .from("manual_publish_tasks")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", taskId)
    .eq("user_id", user.id);

  if (error) {
    console.error("[completeTask] failed:", error.message);
    return { success: false, error: "완료 처리 실패" };
  }
  return { success: true };
}
