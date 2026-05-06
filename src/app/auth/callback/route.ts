/**
 * Next.js Route Handler — Supabase OAuth 콜백 처리
 *
 * Google OAuth 플로우에서 인가 코드(code)를 받아 세션으로 교환하는 엔드포인트.
 * Supabase PKCE 플로우의 마지막 단계로, 성공 시 세션 쿠키가 설정된다.
 *
 * 플로우: Google → /auth/callback?code=... → exchangeCodeForSession → /dashboard
 */

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /auth/callback
 *
 * Supabase Auth가 OAuth 완료 후 리다이렉트하는 콜백 핸들러.
 * URL의 code 파라미터를 세션으로 교환하고, next 경로로 리다이렉트한다.
 *
 * @param request - 인가 코드(code)와 리다이렉트 경로(next)를 담은 요청 객체
 * @returns 성공 시 next 경로로, 실패 시 /?modal=login&error=auth_callback_failed로 리다이렉트
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // next 파라미터가 없으면 대시보드로 이동
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    // 인가 코드를 액세스 토큰 + 리프레시 토큰으로 교환하고 쿠키에 저장한다
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // code가 없거나 교환 실패 시 로그인 모달을 에러 상태로 열어준다
  return NextResponse.redirect(
    `${origin}/auth/login?error=auth_callback_failed`,
  );
}
