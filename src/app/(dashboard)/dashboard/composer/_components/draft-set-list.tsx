"use client";

import Link from "next/link";
import { FileEdit, ChevronRight } from "lucide-react";

const CHANNEL_LABEL: Record<string, string> = {
  instagram:  "Instagram",
  kakaostory: "KakaoStory",
  line_band:  "LINE Band",
};

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  drafting:   { label: "작성 중",   className: "bg-muted text-muted-foreground" },
  ready:      { label: "준비 완료", className: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  publishing: { label: "발행 중",   className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  completed:  { label: "완료",      className: "bg-green-500/10 text-green-600 dark:text-green-400" },
  archived:   { label: "보관됨",    className: "bg-muted text-muted-foreground/60" },
};

interface DraftInfo {
  id: string;
  target_channel: string;
  status: string;
}

interface DraftSetItem {
  id: string;
  title: string | null;
  status: string;
  created_at: string;
  post_drafts: DraftInfo[];
}

interface DraftSetListProps {
  draftSets: DraftSetItem[];
}

/** Next.js Client Component — 초안 묶음 목록 카드 */
export function DraftSetList({ draftSets }: DraftSetListProps) {
  if (draftSets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
        <FileEdit className="mb-3 h-8 w-8 text-muted-foreground/40" />
        <p className="text-sm font-medium text-foreground">저장된 초안이 없습니다.</p>
        <p className="mt-1 text-xs text-muted-foreground">게시물 작성 후 Composer에서 편집하세요.</p>
        <Link
          href="/dashboard/create"
          className="mt-4 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
        >
          게시물 작성하기
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {draftSets.map((ds) => {
        const statusInfo = STATUS_LABEL[ds.status] ?? STATUS_LABEL.drafting;
        const channels = ds.post_drafts.map((d) => d.target_channel);
        const date = new Date(ds.created_at).toLocaleDateString("ko-KR", {
          month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
        });

        return (
          <li key={ds.id}>
            <Link
              href={`/dashboard/composer/${ds.id}`}
              className="group flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-3.5 transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {ds.title ?? "(제목 없음)"}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground">{date}</span>
                  {channels.map((ch) => (
                    <span
                      key={ch}
                      className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                    >
                      {CHANNEL_LABEL[ch] ?? ch}
                    </span>
                  ))}
                </div>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${statusInfo.className}`}>
                {statusInfo.label}
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
