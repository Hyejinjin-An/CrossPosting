/**
 * Next.js Server Actions — 인증 관련 서버 액션 모음
 *
 * "use server" 선언으로 Client Component의 form action 또는 직접 호출이 가능하다.
 * 모든 함수는 서버에서 실행되므로 Supabase 서버 클라이언트를 사용하고,
 * 처리 결과는 redirect()로 응답한다(반환값 없음).
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

/**
 * Google OAuth 로그인을 시작한다 (Next.js Server Action).
 *
 * Supabase signInWithOAuth를 호출해 Google 인가 URL을 받아 리다이렉트한다.
 * OAuth 완료 후 Google은 /auth/callback으로 코드를 전달한다.
 *
 * access_type=offline + prompt=consent: 리프레시 토큰 발급을 강제해
 * 장기 세션을 지원한다.
 *
 * origin은 headers()에서 추출하며, origin 헤더가 없는 환경(일부 프록시)에서는
 * host 헤더로 직접 구성한다.
 */
export async function signInWithGoogle() {
  const supabase = await createClient();
  const headersList = await headers();

  // origin 헤더가 null인 환경을 대비해 host 헤더로 폴백
  const origin =
    headersList.get("origin") ??
    (() => {
      const host = headersList.get("host") ?? "localhost:3000";
      const protocol = host.startsWith("localhost") ? "http" : "https";
      return `${protocol}://${host}`;
    })();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        access_type: "offline",  // 리프레시 토큰 요청
        prompt: "consent",        // 매번 동의 화면 표시 (계정 선택 포함)
      },
    },
  });

  if (error || !data.url) {
    redirect("/?modal=login&error=oauth_failed");
  }

  // Google 인가 페이지로 리다이렉트
  redirect(data.url);
}

/**
 * 이메일/비밀번호로 로그인한다 (Next.js Server Action).
 *
 * Supabase signInWithPassword를 호출한다.
 * form의 name="email" / name="password" 필드에서 값을 읽는다.
 *
 * @param formData - 로그인 폼 데이터 (email, password 필드 포함)
 */
export async function signInWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // 자격증명 오류를 사용자에게 노출 (구체적인 이유는 숨겨 열거 공격 방지)
    redirect(`/?modal=login&error=invalid_credentials`);
  }

  redirect("/dashboard");
}

/**
 * 이메일/비밀번호로 회원가입한다 (Next.js Server Action).
 *
 * Supabase signUp을 호출한다. Supabase 설정의 enable_confirmations에 따라
 * 즉시 로그인되거나 이메일 확인이 필요할 수 있다.
 *
 * on_auth_user_created 트리거가 자동으로 profiles 테이블에 row를 생성한다.
 *
 * @param formData - 회원가입 폼 데이터 (email, password 필드 포함)
 */
export async function signUpWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    if (error.message.includes("already registered")) {
      redirect("/?modal=signup&error=already_registered");
    }
    redirect("/?modal=signup&error=signup_failed");
  }

  // enable_confirmations=false(기본)면 즉시 세션이 생성되어 /dashboard로 이동한다.
  // enable_confirmations=true면 세션 없이 이 redirect가 실행되므로 check_email 메시지를 표시한다.
  redirect("/?modal=signup&error=check_email");
}

/**
 * 현재 사용자를 로그아웃하고 랜딩 페이지로 이동한다 (Next.js Server Action).
 *
 * Supabase signOut으로 서버 측 세션과 쿠키를 모두 제거한다.
 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
