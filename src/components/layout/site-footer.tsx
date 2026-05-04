import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--muted))]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            © 2026 SNS Commit. 공식 API와 수동 플로우 기반 크로스포스팅 도구입니다.
          </p>
          <nav className="flex gap-4 text-sm text-[hsl(var(--muted-foreground))]">
            <Link href="/privacy" className="hover:text-[hsl(var(--foreground))]">
              개인정보 처리방침
            </Link>
            <Link href="/terms" className="hover:text-[hsl(var(--foreground))]">
              서비스 약관
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
