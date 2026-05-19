"use server";

import { createClient } from "@/lib/supabase/server";

const VALID_GENDERS = new Set(["male", "female", "other"]);
const PHONE_RE = /^01[016789]\d{7,8}$/;

export interface SaveProfileResult {
  success: boolean;
  error?: string;
}

/** Supabase Server Action — 프로필 수정 (display_name/gender/phone upsert) */
export async function saveProfile(formData: FormData): Promise<SaveProfileResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  const displayName = (formData.get("display_name") as string | null)?.trim() ?? "";
  const gender = (formData.get("gender") as string | null) ?? "";
  const phone = (formData.get("phone") as string | null)?.trim() ?? "";

  // 서버 측 입력 검증 (클라이언트 검증 우회 방어)
  if (!displayName) {
    return { success: false, error: "이름을 입력하세요." };
  }
  if (!VALID_GENDERS.has(gender)) {
    return { success: false, error: "성별을 선택하세요." };
  }
  if (!PHONE_RE.test(phone)) {
    return { success: false, error: "올바른 휴대폰 번호를 입력하세요. (예: 01012345678)" };
  }

  // handle_new_user 트리거 미실행 등 예외 상황 방어를 위해 upsert 사용
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert(
      { id: user.id, display_name: displayName, gender, phone },
      { onConflict: "id" }
    );

  if (profileError) {
    console.error("[saveProfile] upsert failed:", profileError.message);
    return { success: false, error: "저장에 실패했습니다. 다시 시도해 주세요." };
  }

  return { success: true };
}
