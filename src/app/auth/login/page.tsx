import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signInWithGoogle } from "@/app/auth/actions";

const ERROR_MESSAGES: Record<string, string> = {
  oauth_failed: "Google 로그인 중 오류가 발생했습니다. 다시 시도해 주세요.",
  auth_callback_failed: "인증 처리 중 오류가 발생했습니다. 다시 시도해 주세요.",
  default: "오류가 발생했습니다. 다시 시도해 주세요.",
};

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[hsl(var(--background))] px-4">
      <Link href="/" className="flex items-center gap-2.5">
        <Image src="/brand/logo.svg" alt="CrossPosting" width={28} height={28} />
        <span className="text-[15px] font-bold tracking-tight text-[hsl(var(--foreground))]">
          CrossPosting
        </span>
      </Link>

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>로그인</CardTitle>
          <CardDescription>
            Google 계정으로 시작하세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {ERROR_MESSAGES[error] ?? ERROR_MESSAGES.default}
            </div>
          )}

          <form action={signInWithGoogle}>
            <Button type="submit" variant="outline" className="w-full gap-2.5">
              <GoogleIcon />
              Google로 계속하기
            </Button>
          </form>

          <p className="text-center text-xs text-[hsl(var(--muted-foreground))]">
            계속하면 CrossPosting의{" "}
            <Link href="#" className="underline underline-offset-2 hover:text-foreground">
              서비스 이용약관
            </Link>
            에 동의하는 것으로 간주됩니다.
          </p>
        </CardContent>
      </Card>

      <Button variant="ghost" size="sm" asChild>
        <Link href="/">
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          홈으로 돌아가기
        </Link>
      </Button>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
