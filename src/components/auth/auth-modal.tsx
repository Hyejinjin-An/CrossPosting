/**
 * AuthModal — 로그인 / 회원가입 모달 (React Client Component)
 *
 * URL 파라미터(?modal=login | ?modal=signup)를 기반으로 모달의 열림 상태를 제어한다.
 * 서버가 아닌 클라이언트에서 URL을 읽고 Dialog 상태를 동기화하므로 "use client"가 필요하다.
 *
 * 모달 트리거 방식:
 * - SiteHeader 버튼: router.push("/?modal=login") 또는 "/?modal=signup"
 * - HeroSection CTA: <Link href="/?modal=signup">
 * - proxy(Middleware): 미인증 /dashboard → /?modal=login 리다이렉트
 * - /auth/login 페이지: /?modal=login 리다이렉트로 단순화됨
 *
 * 에러 표시: ?error= 파라미터로 Server Action 실패 결과를 인라인으로 표시한다.
 */

"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
} from "@/app/auth/actions";

/** Server Action 실패 시 ?error= 파라미터 값에 대응하는 한국어 메시지 */
const ERROR_MESSAGES: Record<string, string> = {
  oauth_failed: "Google 로그인 중 오류가 발생했습니다. 다시 시도해 주세요.",
  invalid_credentials: "이메일 또는 비밀번호가 올바르지 않습니다.",
  already_registered: "이미 가입된 이메일입니다. 로그인을 시도해 주세요.",
  signup_failed: "회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.",
  check_email: "확인 이메일을 보냈습니다. 받은 편지함을 확인해 주세요.",
  default: "오류가 발생했습니다. 다시 시도해 주세요.",
};

/** 에러가 아닌 정보성 메시지 키 목록 (파란색 스타일로 표시) */
const INFO_ERRORS = new Set(["check_email"]);

/**
 * 로그인/회원가입 모달 컴포넌트 (React Client Component).
 *
 * URL의 ?modal 파라미터를 감지해 자동으로 열리고, 닫힐 때 URL에서 파라미터를 제거한다.
 * Tabs 상태(tab)는 로컬 state로 관리되며, modalParam 변경 시 Dialog key로 초기화된다.
 * (useEffect 없이 URL → 상태 동기화를 달성해 cascading render를 방지한다)
 *
 * useSearchParams()를 사용하므로 부모에서 반드시 <Suspense>로 감싸야 한다.
 */
export function AuthModal() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const modalParam = searchParams.get("modal");
  const errorParam = searchParams.get("error");

  // open은 URL에서 직접 파생된다 (state가 아님)
  const open = modalParam === "login" || modalParam === "signup";

  // tab은 로컬 상태. Dialog key={modalParam}으로 modalParam 변경 시 재초기화된다
  const [tab, setTab] = useState<"login" | "signup">(
    modalParam === "signup" ? "signup" : "login"
  );

  /**
   * 모달이 닫힐 때 호출된다 (Dialog의 onOpenChange 콜백).
   * URL에서 ?modal, ?error 파라미터를 제거해 모달이 다시 열리지 않도록 한다.
   */
  function handleOpenChange(next: boolean) {
    if (!next) {
      router.replace("/", { scroll: false });
    }
  }

  const error = errorParam ? (ERROR_MESSAGES[errorParam] ?? ERROR_MESSAGES.default) : null;
  const isInfo = errorParam ? INFO_ERRORS.has(errorParam) : false;

  return (
    // key={modalParam}으로 login↔signup 전환 시 Dialog를 재마운트해 tab 상태를 초기화한다
    <Dialog key={modalParam ?? "closed"} open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="items-center gap-2 pb-0">
          <Image src="/brand/logo.svg" alt="CrossPosting" width={28} height={28} />
          <DialogTitle className="text-base">CrossPosting</DialogTitle>
        </DialogHeader>

        {/* ?error= 파라미터가 있을 때만 에러/안내 메시지를 표시한다 */}
        {error && (
          <div
            className={`rounded-md border px-3 py-2 text-xs ${
              isInfo
                ? "border-blue-300/40 bg-blue-500/10 text-blue-400"
                : "border-destructive/30 bg-destructive/10 text-destructive"
            }`}
          >
            {error}
          </div>
        )}

        <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "signup")}>
          <TabsList className="w-full">
            <TabsTrigger value="login" className="flex-1">로그인</TabsTrigger>
            <TabsTrigger value="signup" className="flex-1">회원가입</TabsTrigger>
          </TabsList>

          {/* 로그인 탭: Google OAuth + 이메일/비밀번호 */}
          <TabsContent value="login" className="space-y-4 pt-2">
            {/* form action에 Server Action을 직접 연결한다 */}
            <form action={signInWithGoogle}>
              <Button type="submit" variant="outline" className="w-full gap-2.5">
                <GoogleIcon />
                Google로 계속하기
              </Button>
            </form>

            <div className="relative flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[11px] text-muted-foreground">또는</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <form action={signInWithEmail} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="login-email" className="text-xs">이메일</Label>
                <Input
                  id="login-email"
                  name="email"   // Server Action에서 formData.get("email")로 읽는다
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="login-password" className="text-xs">비밀번호</Label>
                <Input
                  id="login-password"
                  name="password"  // Server Action에서 formData.get("password")로 읽는다
                  type="password"
                  placeholder="••••••••"
                  required
                  className="h-8 text-sm"
                />
              </div>
              <Button type="submit" className="w-full">로그인</Button>
            </form>
          </TabsContent>

          {/* 회원가입 탭: Google OAuth + 이메일/비밀번호 */}
          <TabsContent value="signup" className="space-y-4 pt-2">
            <form action={signInWithGoogle}>
              <Button type="submit" variant="outline" className="w-full gap-2.5">
                <GoogleIcon />
                Google로 시작하기
              </Button>
            </form>

            <div className="relative flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[11px] text-muted-foreground">또는 이메일로 가입</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <form action={signUpWithEmail} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="signup-email" className="text-xs">이메일</Label>
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="signup-password" className="text-xs">비밀번호</Label>
                <Input
                  id="signup-password"
                  name="password"
                  type="password"
                  placeholder="8자 이상"
                  minLength={8}  // Supabase 기본 minimum_password_length=6보다 높게 설정
                  required
                  className="h-8 text-sm"
                />
              </div>
              <Button type="submit" className="w-full">회원가입</Button>
            </form>

            <p className="text-center text-[11px] text-muted-foreground">
              가입하면 CrossPosting 서비스 이용약관에 동의하는 것으로 간주됩니다.
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Google 브랜드 아이콘 SVG 컴포넌트.
 * 공식 Google 브랜드 가이드라인 색상을 사용한다.
 */
function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}
