/**
 * SiteHeader — 랜딩 페이지 헤더 (React Client Component)
 *
 * 로그인/시작하기 버튼 클릭 시 router.push()로 URL을 변경하고,
 * AuthModal이 URL 파라미터를 읽어 자동으로 열린다.
 *
 * router.push()를 사용하므로 "use client"가 필요하다.
 * AuthModal은 이 컴포넌트가 아닌 랜딩 페이지(page.tsx)에 마운트된다.
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

/**
 * 랜딩 페이지 상단 헤더 컴포넌트 (React Client Component).
 *
 * 로고(홈 링크)와 로그인/시작하기 버튼을 렌더링한다.
 * 버튼 클릭 시 ?modal= 파라미터를 URL에 추가해 AuthModal을 트리거한다.
 */
export function SiteHeader() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/brand/logo.svg"
            alt="CrossPosting"
            width={32}
            height={32}
            priority
          />
          <span className="text-[15px] font-bold tracking-tight text-[hsl(var(--foreground))]">
            CrossPosting
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          {/* URL 파라미터 변경 → AuthModal이 useSearchParams()로 감지해 자동으로 열린다 */}
          <Button variant="ghost" size="sm" onClick={() => router.push("/?modal=login")}>
            로그인
          </Button>
          <Button size="sm" onClick={() => router.push("/?modal=signup")}>
            시작하기
          </Button>
        </nav>
      </div>
    </header>
  );
}
