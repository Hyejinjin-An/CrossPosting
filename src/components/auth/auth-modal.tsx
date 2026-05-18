"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { cn } from "@/lib/utils";
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
} from "@/app/auth/actions";

const ERROR_MESSAGES: Record<string, string> = {
  oauth_failed: "Google 로그인 중 오류가 발생했습니다. 다시 시도해 주세요.",
  invalid_credentials: "이메일 또는 비밀번호가 올바르지 않습니다.",
  already_registered: "이미 가입된 이메일입니다. 로그인을 시도해 주세요.",
  signup_failed: "회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.",
  check_email: "확인 이메일을 보냈습니다. 받은 편지함을 확인해 주세요.",
  default: "오류가 발생했습니다. 다시 시도해 주세요.",
};

const INFO_ERRORS = new Set(["check_email"]);

// ── Zod 스키마 ──────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해 주세요")
    .email("올바른 이메일 형식이 아닙니다"),
  password: z.string().min(1, "비밀번호를 입력해 주세요"),
});

const signupSchema = z.object({
  display_name: z
    .string()
    .min(1, "이름을 입력해 주세요")
    .max(50, "이름은 50자 이하로 입력해 주세요"),
  gender: z
    .string()
    .min(1, "성별을 선택해 주세요")
    .refine(
      (v) => ["male", "female", "other"].includes(v),
      "올바른 성별을 선택해 주세요"
    ),
  phone: z
    .string()
    .min(1, "전화번호를 입력해 주세요")
    .max(11, "전화번호는 11자리까지 입력 가능합니다")
    .regex(/^01[016789]\d{7,8}$/, "올바른 휴대폰 번호를 입력해 주세요 (예: 01012345678)"),
  email: z
    .string()
    .min(1, "이메일을 입력해 주세요")
    .email("올바른 이메일 형식이 아닙니다"),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다"),
});

type LoginData = z.infer<typeof loginSchema>;
type SignupData = z.infer<typeof signupSchema>;

// ── 필드 에러 메시지 ──────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-[11px] text-destructive">{message}</p>;
}

// ── 로그인 폼 ─────────────────────────────────────────────────────────────────

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: LoginData) {
    const fd = new FormData();
    fd.set("email", data.email.trim().toLowerCase());
    fd.set("password", data.password);
    await signInWithEmail(fd);
  }

  return (
    <div className="space-y-4">
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

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="login-email" className="text-xs">이메일</Label>
          <Input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className={cn("h-8 text-sm", errors.email && "border-destructive")}
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="login-password" className="text-xs">비밀번호</Label>
          <Input
            id="login-password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            className={cn("h-8 text-sm", errors.password && "border-destructive")}
            {...register("password")}
          />
          <FieldError message={errors.password?.message} />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "처리 중..." : "로그인"}
        </Button>
      </form>
    </div>
  );
}

// ── 회원가입 폼 ───────────────────────────────────────────────────────────────

function SignupForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { display_name: "", gender: "", phone: "", email: "", password: "" },
  });

  async function onSubmit(data: SignupData) {
    const fd = new FormData();
    fd.set("display_name", data.display_name.trim());
    fd.set("gender", data.gender);
    fd.set("phone", data.phone);
    fd.set("email", data.email.trim().toLowerCase());
    fd.set("password", data.password);
    await signUpWithEmail(fd);
  }

  return (
    <div className="space-y-4">
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

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
        {/* 이름 + 성별 */}
        <div className="flex gap-2">
          <div className="flex-1 space-y-1">
            <Label htmlFor="signup-name" className="text-xs">이름</Label>
            <Input
              id="signup-name"
              type="text"
              placeholder="홍길동"
              autoComplete="name"
              className={cn("h-8 text-sm", errors.display_name && "border-destructive")}
              {...register("display_name")}
            />
            <FieldError message={errors.display_name?.message} />
          </div>

          <div className="w-28 space-y-1">
            <Label htmlFor="signup-gender" className="text-xs">성별</Label>
            <select
              id="signup-gender"
              className={cn(
                "flex h-8 w-full rounded-md border border-input bg-background px-2 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                errors.gender && "border-destructive"
              )}
              {...register("gender")}
            >
              <option value="" disabled>선택</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
              <option value="other">기타</option>
            </select>
            <FieldError message={errors.gender?.message} />
          </div>
        </div>

        {/* 전화번호 — 숫자만, 최대 11자리 */}
        <div className="space-y-1">
          <Label htmlFor="signup-phone" className="text-xs">전화번호</Label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                id="signup-phone"
                type="tel"
                inputMode="numeric"
                placeholder="01012345678"
                autoComplete="tel"
                maxLength={11}
                className={cn("h-8 text-sm", errors.phone && "border-destructive")}
                {...field}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
                  field.onChange(digits);
                }}
              />
            )}
          />
          <FieldError message={errors.phone?.message} />
        </div>

        {/* 이메일 */}
        <div className="space-y-1">
          <Label htmlFor="signup-email" className="text-xs">이메일</Label>
          <Input
            id="signup-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className={cn("h-8 text-sm", errors.email && "border-destructive")}
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>

        {/* 비밀번호 */}
        <div className="space-y-1">
          <Label htmlFor="signup-password" className="text-xs">비밀번호</Label>
          <Input
            id="signup-password"
            type="password"
            placeholder="8자 이상"
            autoComplete="new-password"
            className={cn("h-8 text-sm", errors.password && "border-destructive")}
            {...register("password")}
          />
          <FieldError message={errors.password?.message} />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "처리 중..." : "회원가입"}
        </Button>
      </form>

      <p className="text-center text-[11px] text-muted-foreground">
        가입하면 CrossPosting 서비스 이용약관에 동의하는 것으로 간주됩니다.
      </p>
    </div>
  );
}

// ── 메인 모달 ─────────────────────────────────────────────────────────────────

export function AuthModal() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const modalParam = searchParams.get("modal");
  const errorParam = searchParams.get("error");

  const open = modalParam === "login" || modalParam === "signup";

  const [tab, setTab] = useState<"login" | "signup">(
    modalParam === "signup" ? "signup" : "login"
  );

  function handleOpenChange(next: boolean) {
    if (!next) {
      router.replace("/", { scroll: false });
    }
  }

  const error = errorParam ? (ERROR_MESSAGES[errorParam] ?? ERROR_MESSAGES.default) : null;
  const isInfo = errorParam ? INFO_ERRORS.has(errorParam) : false;

  return (
    <Dialog key={modalParam ?? "closed"} open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center gap-2 pb-0">
          <Image src="/brand/logo.svg" alt="CrossPosting" width={28} height={28} />
          <DialogTitle className="text-base">CrossPosting</DialogTitle>
        </DialogHeader>

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

          <TabsContent value="login" className="pt-2">
            <LoginForm />
          </TabsContent>

          <TabsContent value="signup" className="pt-2">
            <SignupForm />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

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
