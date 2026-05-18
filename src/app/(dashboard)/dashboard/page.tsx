import Link from "next/link";
import Image from "next/image";
import { BarChart2, ImageIcon, Link2, Send, Users, FileText, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signOut } from "@/app/auth/actions";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // user_metadata.full_name: 이메일 가입 시 signUp options.data.full_name, Google OAuth 시 자동 포함
  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email?.split("@")[0] ??
    "사용자";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/brand/logo.svg" alt="CrossPosting" width={28} height={28} />
            <span className="text-[15px] font-bold tracking-tight text-foreground">
              CrossPosting
            </span>
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <form action={signOut}>
              <Button type="submit" variant="ghost" size="sm">로그아웃</Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">

        {/* 환영 배너 */}
        <div className="mb-8 rounded-xl border border-primary/25 bg-primary/5 px-6 py-5">
          <p className="mb-1 text-xs font-medium text-primary">CrossPosting</p>
          <h1 className="text-xl font-bold text-foreground">
            안녕하세요, {displayName}님!
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            소셜 계정 연결부터 게시물 발행까지 한 곳에서 관리해 보세요.
            MVP 기능을 순차적으로 구현 중입니다.
          </p>
        </div>

        {/* 통계 카드 */}
        <div className="mb-8 grid grid-cols-3 gap-3">
          {[
            { label: "연결된 계정", value: "0", icon: Users },
            { label: "저장된 초안", value: "0", icon: FileText },
            { label: "발행 완료", value: "0", icon: Zap },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icon className="h-3.5 w-3.5" />
                {label}
              </div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
            </div>
          ))}
        </div>

        {/* 기능 카드 */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">기능 미리보기</h2>
          <Badge variant="secondary" className="text-xs">MVP 구현 예정</Badge>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            {
              icon: Link2,
              title: "소셜 계정 연결",
              desc: "Instagram 계정을 OAuth로 연결하고 토큰 상태를 관리합니다.",
            },
            {
              icon: ImageIcon,
              title: "게시물 가져오기",
              desc: "연결된 계정의 최근 게시물을 최대 20개 불러옵니다.",
            },
            {
              icon: Send,
              title: "초안 생성 및 편집",
              desc: "원본 기반 채널별 초안을 만들고 본문·해시태그를 수정합니다.",
            },
            {
              icon: BarChart2,
              title: "발행 상태 추적",
              desc: "Instagram 발행 작업과 KakaoStory 수동 게시 패키지 상태를 확인합니다.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <Card
              key={title}
              className="group cursor-default transition-all duration-200 hover:border-primary/50 hover:shadow-sm hover:shadow-primary/10"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted transition-colors duration-200 group-hover:bg-primary/15">
                      <Icon className="h-4 w-4 text-muted-foreground transition-colors duration-200 group-hover:text-primary" />
                    </div>
                    <CardTitle className="text-sm">{title}</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-[10px] transition-colors duration-200 group-hover:border-primary/40 group-hover:text-primary">
                    미구현
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 다음 구현 순서 */}
        <div className="mt-8 rounded-lg border border-border bg-muted/30 p-5">
          <p className="mb-3 text-sm font-semibold text-foreground">다음 구현 순서</p>
          <ol className="space-y-2">
            {[
              { done: true,  text: "Supabase Auth — Google OAuth 로그인 구현" },
              { done: false, text: "DB 마이그레이션 및 RLS — profiles, social_accounts, source_posts 등" },
              { done: false, text: "Instagram OAuth — 계정 연결 및 장기 토큰 저장" },
              { done: false, text: "Source Import — 최근 게시물 조회 및 저장" },
              { done: false, text: "Composer — 초안 생성 및 채널별 제한 검사" },
              { done: false, text: "KakaoStory 수동 보조 — 본문 복사, 이미지 저장, 체크리스트" },
              { done: false, text: "Publish Jobs — Instagram 발행 요청 및 상태 추적" },
            ].map(({ done, text }, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs">
                <span
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    done
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-muted-foreground"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span className={done ? "text-foreground line-through decoration-muted-foreground/50" : "text-muted-foreground"}>
                  {text}
                </span>
              </li>
            ))}
          </ol>
        </div>

      </main>
    </div>
  );
}
