import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, ImageIcon, Link2, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
          <div className="max-w-2xl">
            <Badge variant="secondary" className="mb-4 text-xs font-medium">
              크로스포스팅 워크스페이스
            </Badge>
            <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-[hsl(var(--foreground))] sm:text-4xl">
              SNS 게시물,<br />
              다시 쓰는 시간을 줄이세요
            </h1>
            <p className="mb-8 text-base leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-lg">
              Instagram 게시물을 가져와 채널별 초안을 만들고, 가능한 곳은 공식 API로 발행하세요.
              제한된 채널은 복사와 다운로드 플로우로 안전하게 마무리합니다.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link href="/auth/login">
                  첫 게시물 가져오기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                <Link href="#workflow">
                  <BookOpen className="mr-2 h-4 w-4" />
                  제품 설계 보기
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <Separator />

        {/* Product Preview */}
        <section id="workflow" className="mx-auto max-w-5xl scroll-mt-20 px-4 py-14 sm:px-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
            워크플로우 미리보기
          </h2>
          <p className="mb-10 text-xl font-bold text-[hsl(var(--foreground))]">
            원본 하나로 채널별 초안을 만드는 과정
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Step 1: Source */}
            <div className="rounded-lg border border-[hsl(var(--border))] bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[hsl(var(--muted))] text-xs font-bold text-[hsl(var(--muted-foreground))]">
                  1
                </div>
                <span className="text-sm font-semibold text-[hsl(var(--foreground))]">원본 게시물</span>
              </div>
              <div className="mb-3 flex aspect-square w-full items-center justify-center rounded-md bg-[hsl(var(--muted))]">
                <ImageIcon className="h-10 w-10 text-[hsl(var(--muted-foreground))]" strokeWidth={1.5} />
              </div>
              <div className="space-y-1.5">
                <div className="h-2.5 w-full rounded-full bg-[hsl(var(--muted))]" />
                <div className="h-2.5 w-4/5 rounded-full bg-[hsl(var(--muted))]" />
                <div className="h-2.5 w-2/3 rounded-full bg-[hsl(var(--muted))]" />
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="text-xs">#인스타그램</Badge>
                <Badge variant="secondary" className="text-xs">#신상품</Badge>
              </div>
            </div>

            {/* Step 2: Channel drafts */}
            <div className="rounded-lg border border-[hsl(var(--border))] bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[hsl(var(--muted))] text-xs font-bold text-[hsl(var(--muted-foreground))]">
                  2
                </div>
                <span className="text-sm font-semibold text-[hsl(var(--foreground))]">채널별 초안</span>
              </div>
              <div className="space-y-3">
                <div className="rounded-md border border-[hsl(var(--border))] p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[hsl(var(--foreground))]">Instagram</span>
                    <Badge className="bg-[#1FBF9A]/15 text-[#0f8a6e] hover:bg-[#1FBF9A]/20 text-[10px]">
                      API 발행
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 w-full rounded-full bg-[hsl(var(--muted))]" />
                    <div className="h-2 w-5/6 rounded-full bg-[hsl(var(--muted))]" />
                  </div>
                  <div className="mt-2 text-[10px] text-[hsl(var(--muted-foreground))]">
                    글자 수 제한 ✓ &nbsp; 이미지 비율 ✓
                  </div>
                </div>
                <div className="rounded-md border border-[hsl(var(--border))] p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[hsl(var(--foreground))]">KakaoStory</span>
                    <Badge variant="secondary" className="text-[10px]">
                      수동 보조
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 w-full rounded-full bg-[hsl(var(--muted))]" />
                    <div className="h-2 w-3/4 rounded-full bg-[hsl(var(--muted))]" />
                  </div>
                  <div className="mt-2 flex gap-1.5">
                    <span className="rounded bg-[hsl(var(--muted))] px-1.5 py-0.5 text-[10px] text-[hsl(var(--muted-foreground))]">
                      본문 복사
                    </span>
                    <span className="rounded bg-[hsl(var(--muted))] px-1.5 py-0.5 text-[10px] text-[hsl(var(--muted-foreground))]">
                      이미지 저장
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Publish status */}
            <div className="rounded-lg border border-[hsl(var(--border))] bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[hsl(var(--muted))] text-xs font-bold text-[hsl(var(--muted-foreground))]">
                  3
                </div>
                <span className="text-sm font-semibold text-[hsl(var(--foreground))]">발행 상태</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-md bg-[hsl(var(--muted))] px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#1FBF9A]" />
                    <span className="text-xs text-[hsl(var(--foreground))]">Instagram</span>
                  </div>
                  <span className="text-[10px] font-medium text-[#1FBF9A]">발행 완료</span>
                </div>
                <div className="flex items-center justify-between rounded-md bg-[hsl(var(--muted))] px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                    <span className="text-xs text-[hsl(var(--foreground))]">KakaoStory</span>
                  </div>
                  <span className="text-[10px] font-medium text-[hsl(var(--muted-foreground))]">패키지 준비</span>
                </div>
                <div className="mt-2 rounded-md border border-[hsl(var(--border))] p-3 text-[11px] text-[hsl(var(--muted-foreground))]">
                  <span className="font-semibold text-[hsl(var(--foreground))]">게시 이력</span>
                  <br />
                  무엇을 어디에 올렸는지<br />한 화면에서 확인합니다.
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Trust pillars */}
        <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
            운영 원칙
          </h2>
          <p className="mb-10 text-xl font-bold text-[hsl(var(--foreground))]">
            믿고 쓸 수 있는 도구를 목표로 합니다
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <TrustCard
              icon={<Zap className="h-5 w-5" />}
              title="공식 API 우선"
              description="지원되는 채널은 공식 API로만 발행합니다. 비공식 자동화는 사용하지 않습니다."
            />
            <TrustCard
              icon={<CheckCircle2 className="h-5 w-5" />}
              title="게시 전 검수"
              description="글자 수, 이미지 비율 등 채널별 제약을 발행 전에 확인합니다."
            />
            <TrustCard
              icon={<ShieldCheck className="h-5 w-5" />}
              title="토큰 서버 보관"
              description="SNS 토큰은 서버에만 저장됩니다. 클라이언트 번들에 포함되지 않습니다."
            />
            <TrustCard
              icon={<Link2 className="h-5 w-5" />}
              title="플랫폼별 제약 표시"
              description="각 채널의 정책과 제한을 투명하게 안내합니다."
            />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function TrustCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-[hsl(var(--border))] bg-white p-5">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-[#1FBF9A]/10 text-[#1FBF9A]">
        {icon}
      </div>
      <h3 className="mb-1.5 text-sm font-semibold text-[hsl(var(--foreground))]">{title}</h3>
      <p className="text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">{description}</p>
    </div>
  );
}
