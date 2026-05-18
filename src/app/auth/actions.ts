"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function signInWithGoogle() {
  const supabase = await createClient();
  const headersList = await headers();

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
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error || !data.url) {
    redirect("/?modal=login&error=oauth_failed");
  }

  redirect(data.url);
}

export async function signInWithEmail(formData: FormData) {
  const email = (formData.get("email") as string | null)?.trim().toLowerCase() ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  // 서버 측 기본 검증
  if (!email || !password) {
    redirect("/?modal=login&error=invalid_credentials");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/?modal=login&error=invalid_credentials");
  }

  redirect("/dashboard");
}

const VALID_GENDERS = new Set(["male", "female", "other"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^01[016789]\d{7,8}$/;

export async function signUpWithEmail(formData: FormData) {
  const displayName = (formData.get("display_name") as string | null)?.trim() ?? "";
  const gender = (formData.get("gender") as string | null) ?? "";
  const phone = (formData.get("phone") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim().toLowerCase() ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  // 서버 측 기본 검증 (클라이언트 검증 우회 방어)
  if (!displayName || !gender || !phone || !email || !password) {
    redirect("/?modal=signup&error=signup_failed");
  }
  if (!VALID_GENDERS.has(gender)) {
    redirect("/?modal=signup&error=signup_failed");
  }
  if (!EMAIL_RE.test(email)) {
    redirect("/?modal=signup&error=signup_failed");
  }
  if (!PHONE_RE.test(phone)) {
    redirect("/?modal=signup&error=signup_failed");
  }
  if (password.length < 8) {
    redirect("/?modal=signup&error=signup_failed");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: displayName },
    },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      redirect("/?modal=signup&error=already_registered");
    }
    redirect("/?modal=signup&error=signup_failed");
  }

  // 이메일 확인 활성화 환경에서 중복 이메일 가입 시 Supabase는 에러 없이 HTTP 200을 반환하되
  // identities 배열이 비어있다. 이 경우를 already_registered로 처리한다.
  if (!data.user || data.user.identities?.length === 0) {
    redirect("/?modal=signup&error=already_registered");
  }

  // handle_new_user 트리거가 생성한 profiles 행에 추가 필드를 기록한다.
  // upsert를 사용해 트리거 미실행 등 예외 상황에서도 행이 보장되도록 한다.
  const admin = createAdminClient();
  const { error: profileError } = await admin
    .from("profiles")
    .upsert(
      { id: data.user.id, display_name: displayName, gender, phone },
      { onConflict: "id" }
    );

  if (profileError) {
    console.error("[signUpWithEmail] profile upsert failed:", profileError.message);
  }

  if (data.session) {
    redirect("/dashboard");
  }
  redirect("/?modal=signup&error=check_email");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
