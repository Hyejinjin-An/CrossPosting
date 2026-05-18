/**
 * Supabase SSR Browser Client
 *
 * @supabase/ssr의 createBrowserClient를 Next.js Client Components에서
 * 사용하기 위한 팩토리 함수.
 *
 * 브라우저 환경에서 쿠키 기반 세션을 자동으로 관리한다.
 * NEXT_PUBLIC_ 접두사 환경변수만 사용하며, 클라이언트 번들에 포함돼도 안전하다.
 */

import { createBrowserClient } from "@supabase/ssr";
import { type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

/**
 * 브라우저(클라이언트) 환경용 Supabase 클라이언트를 생성해 반환한다.
 *
 * "use client" 선언이 있는 Client Components에서만 호출한다.
 * 세션 쿠키를 브라우저에서 직접 읽고 관리하며, RLS 정책은 현재 로그인한 사용자 기준으로 적용된다.
 *
 * @returns 타입이 적용된 SupabaseClient (Database 제네릭 포함)
 *
 * 반환 타입을 SupabaseClient<Database>로 캐스팅한다.
 * @supabase/ssr@0.6.1과 @supabase/supabase-js@2.105.1 사이 제네릭 시그니처 불일치 방지.
 */
export function createClient(): SupabaseClient<Database> {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  ) as unknown as SupabaseClient<Database>;
}
