import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, BarChart2, ImageIcon, Link2, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signOut } from "@/app/auth/actions";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function DashboardPage() {
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

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="-ml-2">
            <Link href="/">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              홈
            </Link>
          </Button>
          <Badge variant="secondary" className="text-xs">MVP 구현 예정</Badge>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-foreground">대시보드</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          MVP 기능 구현 후 소셜 계정, 게시물, 초안, 발행 현황을 이 화면에서 관리합니다.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
                    <Link2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-sm">소셜 계정 연결</CardTitle>
                </div>
                <Badge variant="outline" className="text-[10px]">미구현</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Instagram 계정을 OAuth로 연결하고 토큰 상태를 관리합니다.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-sm">게시물 가져오기</CardTitle>
                </div>
                <Badge variant="outline" className="text-[10px]">미구현</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                연결된 계정의 최근 게시물을 최대 20개 불러옵니다.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
                    <Send className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-sm">초안 생성 및 편집</CardTitle>
                </div>
                <Badge variant="outline" className="text-[10px]">미구현</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                원본 기반 채널별 초안을 만들고 본문·해시태그를 수정합니다.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
                    <BarChart2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-sm">발행 상태 추적</CardTitle>
                </div>
                <Badge variant="outline" className="text-[10px]">미구현</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Instagram 발행 작업과 KakaoStory 수동 게시 패키지 상태를 확인합니다.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 rounded-lg border border-border bg-muted/30 p-5">
          <p className="mb-3 text-sm font-medium text-foreground">다음 구현 순서</p>
          <ol className="space-y-1.5 text-xs text-muted-foreground">
            <li>1. ✅ Supabase Auth — Google OAuth 로그인 구현 완료</li>
            <li>2. DB 마이그레이션 및 RLS — profiles, social_accounts, source_posts 등</li>
            <li>3. Instagram OAuth — 계정 연결 및 장기 토큰 저장</li>
            <li>4. Source Import — 최근 게시물 조회 및 저장</li>
            <li>5. Composer — 초안 생성 및 채널별 제한 검사</li>
            <li>6. KakaoStory 수동 보조 — 본문 복사, 이미지 저장, 체크리스트</li>
            <li>7. Publish Jobs — Instagram 발행 요청 및 상태 추적</li>
          </ol>
        </div>
      </main>
    </div>
  );
}
