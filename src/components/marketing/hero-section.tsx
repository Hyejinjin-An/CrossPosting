import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="mx-auto max-w-5xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
      <div className="max-w-2xl">
        <Badge variant="secondary" className="mb-4 text-xs font-medium">
          크로스포스팅 워크스페이스
        </Badge>
        <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
          CrossPosting으로
          <br />
          다시 쓰는 시간을 줄이세요
        </h1>
        <p className="mb-8 text-base leading-relaxed text-muted-foreground sm:text-lg">
          Instagram 게시물을 가져와 채널별 초안을 만들고, 가능한 곳은 공식 API로 발행하세요.
          제한된 채널은 복사와 다운로드 플로우로 안전하게 마무리합니다.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button size="lg" asChild className="w-full sm:w-auto">
            <Link href="/?modal=signup">
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
  );
}
