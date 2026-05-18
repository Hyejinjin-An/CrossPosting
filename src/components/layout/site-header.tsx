"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/brand/logo.svg"
            alt="CrossPosting"
            width={32}
            height={32}
            priority
          />
          <span className="text-[15px] font-bold tracking-tight text-foreground">
            CrossPosting
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <ThemeToggle />
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
