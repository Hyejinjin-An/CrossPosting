import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "./_components/settings-form";

/** Next.js Server Component — 프로필 설정 페이지 (현재 profiles 데이터 조회 후 폼 초기값 전달) */
export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // profiles 테이블에서 현재 저장된 값을 읽어 폼 기본값으로 사용
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, gender, phone")
    .eq("id", user!.id)
    .single();

  return (
    <div className="mx-auto w-full max-w-lg px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">프로필 설정</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          이름, 성별, 휴대폰 번호를 수정합니다.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        {/* 이메일은 변경 불가 — Auth 계정 식별자 */}
        <div className="mb-5 space-y-1.5">
          <p className="text-sm font-medium text-foreground">이메일</p>
          <p className="rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
            {user?.email}
          </p>
          <p className="text-[11px] text-muted-foreground">이메일은 변경할 수 없습니다.</p>
        </div>

        <div className="mb-5 border-t border-border" />

        <SettingsForm
          profile={{
            display_name: profile?.display_name ?? null,
            gender: profile?.gender ?? null,
            phone: profile?.phone ?? null,
          }}
        />
      </div>
    </div>
  );
}
