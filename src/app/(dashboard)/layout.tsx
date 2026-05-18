import { createClient } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

/** Next.js Server Component — 대시보드 공통 레이아웃 (사이드바 + 메인 영역) */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // profiles.display_name 우선, 없으면 user_metadata.full_name (Google OAuth), 없으면 이메일 앞부분
  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email?.split("@")[0] ??
    "사용자";

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar displayName={displayName} email={user?.email ?? ""} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
