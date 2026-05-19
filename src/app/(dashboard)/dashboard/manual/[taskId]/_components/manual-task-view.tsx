"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Copy, Download, ExternalLink, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { markBodyCopied, markMediaDownloaded, markOpened, completeTask } from "../actions";

interface MediaItem {
  id: string;
  signedUrl: string;
  mime_type: string | null;
  sort_order: number;
}

interface ManualTaskViewProps {
  taskId: string;
  body: string;
  hashtags: string[];
  media: MediaItem[];
  initialStatus: string;
  initialBodyCopiedAt: string | null;
  initialMediaDownloadedAt: string | null;
  initialOpenedAt: string | null;
  initialCompletedAt: string | null;
  draftSetId: string;
}

/** Next.js Client Component — KakaoStory 수동 게시 보조 (클립보드 복사, 이미지 저장, 체크리스트 완료) */
export function ManualTaskView({
  taskId,
  body,
  hashtags,
  media,
  initialStatus,
  initialBodyCopiedAt,
  initialMediaDownloadedAt,
  initialOpenedAt,
  initialCompletedAt,
  draftSetId,
}: ManualTaskViewProps) {
  const router = useRouter();
  const [status, setStatus]                 = useState(initialStatus);
  const [bodyCopiedAt, setBodyCopiedAt]     = useState(initialBodyCopiedAt);
  const [mediaDownAt, setMediaDownAt]       = useState(initialMediaDownloadedAt);
  const [openedAt, setOpenedAt]             = useState(initialOpenedAt);
  const [completedAt, setCompletedAt]       = useState(initialCompletedAt);
  const [copyError, setCopyError]           = useState<string | null>(null);

  const [isCopying, startCopy]       = useTransition();
  const [, startDown]   = useTransition();
  const [isOpening, startOpen]       = useTransition();
  const [isCompleting, startComplete] = useTransition();

  const isCompleted = status === "completed";
  const fullText = hashtags.length > 0
    ? `${body}\n\n${hashtags.map((t) => `#${t}`).join(" ")}`
    : body;

  // 앞 3단계 완료 수 — 0개면 완료 버튼에 안내 표시
  const checkedCount = [bodyCopiedAt, mediaDownAt, openedAt].filter(Boolean).length;

  async function handleCopy() {
    setCopyError(null);
    // 클립보드 복사 성공 시에만 DB timestamp 기록 — 실패 시 거짓 완료 방지
    let clipboardOk = false;
    try {
      await navigator.clipboard.writeText(fullText);
      clipboardOk = true;
    } catch {
      setCopyError("클립보드 접근이 거부되었습니다. 아래 텍스트를 직접 복사해 주세요.");
    }
    if (clipboardOk) {
      startCopy(async () => {
        if (!bodyCopiedAt) {
          const result = await markBodyCopied(taskId);
          if (result.success) setBodyCopiedAt(new Date().toISOString());
        }
      });
    }
  }

  function handleDownload(url: string, index: number) {
    const a = document.createElement("a");
    a.href = url;
    a.download = `kakaostory-image-${index + 1}.jpg`;
    a.click();

    startDown(async () => {
      if (!mediaDownAt) {
        const result = await markMediaDownloaded(taskId);
        if (result.success) setMediaDownAt(new Date().toISOString());
      }
    });
  }

  function handleOpen() {
    // 카카오스토리 앱 딥링크 (모바일) 또는 웹 페이지
    window.open("https://story.kakao.com", "_blank", "noopener,noreferrer");
    startOpen(async () => {
      if (!openedAt) {
        const result = await markOpened(taskId);
        if (result.success) setOpenedAt(new Date().toISOString());
      }
    });
  }

  function handleComplete() {
    startComplete(async () => {
      const result = await completeTask(taskId);
      if (result.success) {
        setStatus("completed");
        setCompletedAt(new Date().toISOString());
        // 완료 후 Composer 목록으로 이동
        router.push(`/dashboard/composer/${draftSetId}`);
      }
    });
  }

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-green-500/20 bg-green-500/5 py-12 text-center">
        <CheckCircle2 className="mb-3 h-10 w-10 text-green-500" />
        <p className="text-base font-semibold text-foreground">게시 완료!</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {completedAt ? new Date(completedAt).toLocaleString("ko-KR") : ""}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Step 1 — 본문 복사 */}
      <section className="rounded-lg border border-border p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StepBadge done={!!bodyCopiedAt} number={1} />
            <p className="text-sm font-semibold text-foreground">본문 복사</p>
          </div>
          {bodyCopiedAt && <CheckMark />}
        </div>

        {/* 본문 미리보기 */}
        <pre className="mb-3 max-h-48 overflow-y-auto whitespace-pre-wrap rounded-md border border-border bg-muted/40 p-3 text-sm text-foreground">
          {fullText}
        </pre>
        {copyError && (
          <p className="mb-2 flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {copyError}
          </p>
        )}

        <Button size="sm" variant="outline" onClick={handleCopy} disabled={isCopying}>
          {isCopying ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
          {bodyCopiedAt ? "다시 복사" : "본문 복사"}
        </Button>
      </section>

      {/* Step 2 — 이미지 저장 */}
      {media.length > 0 && (
        <section className="rounded-lg border border-border p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StepBadge done={!!mediaDownAt} number={2} />
              <p className="text-sm font-semibold text-foreground">이미지 저장</p>
            </div>
            {mediaDownAt && <CheckMark />}
          </div>

          <div className="mb-3 flex flex-wrap gap-3">
            {media.map((m, i) => (
              <div key={m.id} className="flex flex-col items-center gap-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.signedUrl}
                  alt={`이미지 ${i + 1}`}
                  className="h-24 w-24 rounded-md border border-border object-cover"
                />
                <button
                  onClick={() => handleDownload(m.signedUrl, i)}
                  className="flex items-center gap-1 text-[11px] text-primary hover:underline"
                >
                  <Download className="h-3 w-3" />
                  저장
                </button>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground">이미지를 저장 후 카카오스토리에 첨부하세요.</p>
        </section>
      )}

      {/* Step 3 — 카카오스토리 열기 */}
      <section className="rounded-lg border border-border p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StepBadge done={!!openedAt} number={media.length > 0 ? 3 : 2} />
            <p className="text-sm font-semibold text-foreground">카카오스토리 열기</p>
          </div>
          {openedAt && <CheckMark />}
        </div>
        <Button size="sm" variant="outline" onClick={handleOpen} disabled={isOpening}>
          {isOpening ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <ExternalLink className="mr-1.5 h-3.5 w-3.5" />}
          카카오스토리 열기
        </Button>
        <p className="mt-2 text-[11px] text-muted-foreground">
          카카오스토리 앱 또는 웹에서 직접 붙여넣고 게시하세요.
        </p>
      </section>

      {/* Step 4 — 게시 완료 */}
      <section className="rounded-lg border border-border p-5">
        <p className="mb-3 text-sm font-semibold text-foreground">게시 완료 확인</p>

        {checkedCount === 0 && (
          <p className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            복사·저장·열기를 확인한 후 완료 처리하는 것을 권장합니다.
          </p>
        )}

        <Button onClick={handleComplete} disabled={isCompleting}>
          {isCompleting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle2 className="mr-2 h-4 w-4" />
          )}
          게시 완료
        </Button>
      </section>
    </div>
  );
}

/** 단계 번호 배지 */
function StepBadge({ done, number }: { done: boolean; number: number }) {
  return (
    <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${done ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"}`}>
      {done ? "✓" : number}
    </span>
  );
}

/** 완료 체크 아이콘 */
function CheckMark() {
  return <CheckCircle2 className="h-4 w-4 text-green-500" />;
}
