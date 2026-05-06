/**
 * Next.js Proxy (Middleware)
 *
 * Next.js 16의 Middleware 대체 파일. 함수명은 반드시 `proxy`여야 한다.
 * 모든 요청이 이 함수를 거치며, 두 가지 역할을 담당한다:
 *
 * 1. 세션 갱신: Supabase 세션 쿠키가 만료 직전이면 자동으로 갱신한다.
 *    (createServerClient의 setAll 콜백이 응답 쿠키에 새 토큰을 설정한다)
 *
 * 2. 라우트 보호: /dashboard에 미인증 접근 시 /?modal=login으로 리다이렉트한다.
 *
 * 성능: Supabase 클라이언트는 보호 라우트에서만 생성해 불필요한 인스턴스화를 방지한다.
 */

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

/**
 * 모든 요청에 대한 세션 갱신 및 라우트 보호를 처리한다 (Next.js Proxy/Middleware).
 *
 * @param request - 현재 수신된 Next.js 요청 객체
 * @returns 세션 쿠키가 갱신된 응답, 또는 인증 필요 시 리다이렉트 응답
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const { pathname } = request.nextUrl;
  const isProtectedRoute = pathname.startsWith("/dashboard");

  // 보호 라우트가 아니면 Supabase 클라이언트를 생성하지 않고 바로 반환
  if (!isProtectedRoute) {
    return response;
  }

  // Middleware에서는 cookies()가 아닌 request.cookies로 직접 접근해야 한다
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        /** 요청 쿠키에서 현재 세션 토큰을 읽는다 */
        getAll() {
          return request.cookies.getAll();
        },
        /**
         * 갱신된 세션 토큰을 요청과 응답 쿠키 양쪽에 설정한다.
         * 요청 쿠키 업데이트: 이후 서버 코드가 새 토큰을 볼 수 있도록 한다.
         * 응답 쿠키 업데이트: 브라우저에 새 토큰을 전달한다.
         */
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // getUser()는 서버에서 JWT를 검증하므로 getSession()보다 안전하다
  // (getSession은 클라이언트 쿠키를 신뢰하는 반면 getUser는 Supabase 서버에 확인한다)
  const { data: { user } } = await supabase.auth.getUser();

  if (isProtectedRoute && !user) {
    // 미인증 접근 시 로그인 모달이 열린 랜딩 페이지로 리다이렉트
    return NextResponse.redirect(new URL("/?modal=login", request.url));
  }

  return response;
}

/**
 * Proxy가 실행될 경로 패턴.
 * 정적 파일, 이미지, 폰트, 브랜드 에셋은 제외해 불필요한 실행을 방지한다.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|brand|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
