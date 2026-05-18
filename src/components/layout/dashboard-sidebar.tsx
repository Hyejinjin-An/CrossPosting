"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PenLine,
  BarChart2,
  Settings,
  Link2,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/auth/actions";

const NAV_ITEMS = [
  { href: "/dashboard",          label: "홈",         icon: LayoutDashboard, available: true },
  { href: "/dashboard/accounts", label: "계정 연결",   icon: Link2,           available: false },
  { href: "/dashboard/create",   label: "게시물 작성", icon: PenLine,         available: true  },
  { href: "/dashboard/publish",  label: "발행 현황",   icon: BarChart2,       available: false },
  { href: "/dashboard/settings", label: "설정",        icon: Settings,        available: false },
];

interface DashboardSidebarProps {
  /** profiles.display_name 또는 user_metadata.full_name */
  displayName: string;
  email: string;
}

/** Next.js Client Component — 대시보드 좌측 사이드바 (usePathname으로 활성 메뉴 표시) */
export function DashboardSidebar({ displayName, email }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-border bg-background">
      {/* 로고 */}
      <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/brand/logo.svg" alt="CrossPosting" width={24} height={24} />
          <span className="text-sm font-bold tracking-tight text-foreground">
            CrossPosting
          </span>
        </Link>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon, available }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                {available ? (
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </Link>
                ) : (
                  <span className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground/40 cursor-not-allowed select-none">
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 하단: 사용자 정보 + 테마 토글 + 로그아웃 */}
      <div className="border-t border-border p-3 space-y-2">
        <div className="px-1">
          <p className="truncate text-xs font-medium text-foreground">{displayName}</p>
          <p className="truncate text-[11px] text-muted-foreground">{email}</p>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <form action={signOut} className="flex-1">
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" />
              로그아웃
            </Button>
          </form>
        </div>
      </div>
    </aside>
  );
}
