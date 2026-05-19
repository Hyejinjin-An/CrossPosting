/**
 * Supabase SSR Server Client
 *
 * @supabase/ssr의 createServerClient를 Next.js App Router 서버 환경(Server Components,
 * Server Actions, Route Handlers)에서 사용하기 위한 팩토리 함수.
 *
 * 세션은 쿠키로 관리된다. cookies() API가 비동기이므로 async 함수로 선언한다.
 * setAll에서 Server Components는 쿠키를 직접 쓸 수 없으므로 예외를 무시하고,
 * 실제 세션 갱신(쓰기)은 proxy.ts(Middleware)가 담당한다.
 */

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";

/**
 * Next.js 서버 환경용 Supabase 클라이언트를 생성해 반환한다.
 *
 * Server Components, Server Actions, Route Handlers에서 호출한다.
 * 세션 쿠키를 읽고 쓸 수 있으며, RLS 정책은 현재 로그인한 사용자 기준으로 적용된다.
 *
 * @returns 타입이 적용된 SupabaseClient (Database 제네릭 포함)
 *
 * 반환 타입을 SupabaseClient<Database>로 캐스팅한다.
 * @supabase/ssr@0.6.1과 @supabase/supabase-js@2.105.1 사이 제네릭 시그니처 불일치로
 * insert/upsert 호출 시 Insert 타입이 never로 추론되는 문제를 방지한다.
 */
export async function createClient(): Promise<SupabaseClient<Database>> {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        /** 현재 요청의 모든 쿠키를 반환한다. 세션 토큰 읽기에 사용된다. */
        getAll() {
          return cookieStore.getAll();
        },
        /**
         * 세션 갱신 시 Supabase가 새 쿠키를 쓰기 위해 호출한다.
         * Server Components에서는 쿠키 쓰기가 불가능하므로 예외를 무시한다.
         * 실제 세션 쿠키 갱신은 proxy.ts(Middleware)에서 처리된다.
         */
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Components cannot set cookies; middleware handles session refresh.
          }
        },
      },
    },
  ) as unknown as SupabaseClient<Database>;
}
