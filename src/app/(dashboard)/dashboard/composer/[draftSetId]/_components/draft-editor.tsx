"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { INSTAGRAM_MAX, parseHashtags } from "@/lib/composer";
import { updateDraft, markDraftReady, startManualPublish } from "../actions";

const CHANNEL_LABEL: Record<string, string> = {
  instagram:  "Instagram",
  kakaostory: "KakaoStory",
  line_band:  "LINE Band",
};

interface Draft {
  id: string;
  target_channel: string;
  body: string | null;
  hashtags: string[];
  status: string;
}

interface MediaItem {
  id: string;
  signedUrl: string;
  mime_type: string | null;
  sort_order: number;
}

interface DraftEditorProps {
  draftSetId: string;
  drafts: Draft[];
  media: MediaItem[];
}

/** Next.js Client Component — 채널별 초안 편집기 (탭, 본문/해시태그 저장, 준비 완료/수동 게시 시작) */
export function DraftEditor({ drafts, media }: DraftEditorProps) {
  const router = useRouter();
  const defaultTab = drafts[0]?.target_channel ?? "instagram";

  return (
    <div className="space-y-6">
      {/* 미디어 미리보기 */}
      {media.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">첨부 이미지 ({media.length})</p>
          <div className="flex flex-wrap gap-2">
            {media.map((m) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={m.id}
                src={m.signedUrl}
                alt={`이미지 ${m.sort_order + 1}`}
                className="h-20 w-20 rounded-md border border-border object-cover"
              />
            ))}
          </div>
        </div>
      )}

      {/* 채널별 초안 탭 */}
      <Tabs defaultValue={defaultTab}>
        <TabsList>
          {drafts.map((d) => (
            <TabsTrigger key={d.id} value={d.target_channel}>
              {CHANNEL_LABEL[d.target_channel] ?? d.target_channel}
            </TabsTrigger>
          ))}
        </TabsList>

        {drafts.map((d) => (
          <TabsContent key={d.id} value={d.target_channel} className="mt-4">
            <DraftTabForm draft={d} router={router} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

interface DraftTabFormProps {
  draft: Draft;
  router: ReturnType<typeof useRouter>;
}

/** Next.js Client Component — 채널 탭 내 폼 (본문, 해시태그, 저장/준비완료/수동게시시작 버튼) */
function DraftTabForm({ draft, router }: DraftTabFormProps) {
  const [body, setBody] = useState(draft.body ?? "");
  const [hashtagRaw, setHashtagRaw] = useState(draft.hashtags.map((t) => `#${t}`).join(" "));
  const [draftStatus, setDraftStatus] = useState(draft.status);

  const [isSaving, startSave] = useTransition();
  const [isReadying, startReady] = useTransition();
  const [isStarting, startManual] = useTransition();
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const bodyLen = body.length;
  const isInstagram = draft.target_channel === "instagram";
  const isKakao = draft.target_channel === "kakaostory";
  const isReady = draftStatus === "ready";

  function handleSave() {
    setSaveMsg(null);
    startSave(async () => {
      const result = await updateDraft(draft.id, body, parseHashtags(hashtagRaw));
      setSaveMsg(result.success ? { ok: true, text: "저장되었습니다." } : { ok: false, text: result.error ?? "저장 실패" });
    });
  }

  function handleMarkReady() {
    setSaveMsg(null);
    startReady(async () => {
      const result = await markDraftReady(draft.id);
      if (result.success) {
        setDraftStatus("ready");
        setSaveMsg({ ok: true, text: "준비 완료로 변경되었습니다." });
      } else {
        setSaveMsg({ ok: false, text: result.error ?? "상태 변경 실패" });
      }
    });
  }

  function handleStartManual() {
    setSaveMsg(null);
    startManual(async () => {
      const result = await startManualPublish(draft.id);
      if (result.success && result.taskId) {
        router.push(`/dashboard/manual/${result.taskId}`);
      } else {
        setSaveMsg({ ok: false, text: result.error ?? "수동 게시 시작 실패" });
      }
    });
  }

  const isPending = isSaving || isReadying || isStarting;

  return (
    <div className="space-y-4">
      {/* 본문 */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor={`body-${draft.id}`}>본문</Label>
          {isInstagram && (
            <span className={`text-[11px] ${bodyLen > INSTAGRAM_MAX ? "font-semibold text-destructive" : "text-muted-foreground"}`}>
              {bodyLen.toLocaleString()} / {INSTAGRAM_MAX.toLocaleString()}
            </span>
          )}
        </div>
        <textarea
          id={`body-${draft.id}`}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={10}
          className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {isInstagram && bodyLen > INSTAGRAM_MAX && (
          <p className="text-xs text-destructive">Instagram 최대 글자 수({INSTAGRAM_MAX.toLocaleString()}자)를 초과했습니다.</p>
        )}
      </div>

      {/* 해시태그 */}
      <div className="space-y-1.5">
        <Label htmlFor={`hashtag-${draft.id}`}>해시태그</Label>
        <Input
          id={`hashtag-${draft.id}`}
          value={hashtagRaw}
          onChange={(e) => setHashtagRaw(e.target.value)}
          placeholder="#여행 #일상 (공백이나 쉼표로 구분)"
        />
      </div>

      {/* 피드백 */}
      {saveMsg && (
        <div className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${saveMsg.ok ? "bg-green-500/10 text-green-700 dark:text-green-400" : "bg-destructive/10 text-destructive"}`}>
          {saveMsg.ok && <CheckCircle2 className="h-4 w-4 shrink-0" />}
          {saveMsg.text}
        </div>
      )}

      {/* 버튼 영역 */}
      <div className="flex flex-wrap gap-2 pt-1">
        {/* 저장 */}
        <Button variant="outline" size="sm" onClick={handleSave} disabled={isPending}>
          {isSaving ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : null}
          저장
        </Button>

        {/* Instagram 전용: 준비 완료 */}
        {isInstagram && (
          <Button
            size="sm"
            onClick={handleMarkReady}
            disabled={isPending || isReady || bodyLen > INSTAGRAM_MAX}
            variant={isReady ? "secondary" : "default"}
          >
            {isReadying ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : null}
            {isReady ? "준비 완료됨" : "준비 완료"}
          </Button>
        )}

        {/* KakaoStory 전용: 수동 게시 시작 */}
        {isKakao && (
          <Button size="sm" onClick={handleStartManual} disabled={isPending}>
            {isStarting ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
            )}
            수동 게시 시작
          </Button>
        )}
      </div>

      {/* Instagram 준비 완료 안내 */}
      {isInstagram && isReady && (
        <p className="text-[11px] text-muted-foreground">
          Instagram 발행 기능은 준비 중입니다. 준비 완료 상태로 표시됩니다.
        </p>
      )}
    </div>
  );
}
