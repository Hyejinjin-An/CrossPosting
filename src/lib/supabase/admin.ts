/**
 * Supabase Admin Client (Service Role)
 *
 * service_role 키를 사용해 RLS를 우회하는 관리자용 클라이언트.
 * publish_logs INSERT, 사용자 관리 등 서버 전용 특권 작업에만 사용한다.
 *
 * SUPABASE_SERVICE_ROLE_KEY는 NEXT_PUBLIC_ 접두사가 없으므로 클라이언트 번들에 포함되지 않는다.
 * 이 파일은 반드시 서버 전용 경로(Server Actions, Route Handlers)에서만 import해야 한다.
 */

// SERVER-ONLY: never import from client components or pages.
// SUPABASE_SERVICE_ROLE_KEY has no NEXT_PUBLIC_ prefix — Next.js excludes it from client bundles.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

/**
 * RLS를 우회하는 Supabase 관리자 클라이언트를 생성해 반환한다.
 *
 * service_role 키를 사용하므로 모든 테이블에 무제한 접근이 가능하다.
 * 세션·토큰 자동 갱신을 비활성화해 서버 환경에 최적화한다.
 *
 * @returns RLS 우회 SupabaseClient (Database 제네릭 포함)
 */
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        // 서버 환경에서는 토큰 자동 갱신과 세션 영속화가 불필요하다
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
