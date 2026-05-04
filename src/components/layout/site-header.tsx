import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
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
          <Button variant="ghost" size="sm" asChild>
            <Link href="/auth/login">로그인</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/auth/login">대시보드 열기</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
