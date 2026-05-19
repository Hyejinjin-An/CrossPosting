import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DraftEditor } from "./_components/draft-editor";

interface PageProps {
  params: Promise<{ draftSetId: string }>;
}

/** Next.js Server Component — 초안 상세 편집 (draft set + drafts + media signed URL 조회) */
export default async function ComposerDetailPage({ params }: PageProps) {
  const { draftSetId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // draft set 조회 (소유권 확인)
  const { data: draftSet } = await supabase
    .from("post_draft_sets")
    .select("id, title, status, source_post_id")
    .eq("id", draftSetId)
    .eq("user_id", user!.id)
    .single();

  if (!draftSet) notFound();

  // 채널별 초안 조회
  const { data: drafts } = await supabase
    .from("post_drafts")
    .select("id, target_channel, body, hashtags, status")
    .eq("draft_set_id", draftSetId)
    .order("target_channel");

  // 미디어 조회 (post_draft_media → media_assets)
  const draftIds = (drafts ?? []).map((d) => d.id);
  let mediaWithUrls: { id: string; signedUrl: string; mime_type: string | null; sort_order: number }[] = [];

  if (draftIds.length > 0) {
    const { data: draftMedia } = await supabase
      .from("post_draft_media")
      .select("sort_order, media_assets (id, storage_path, mime_type, sort_order)")
      .eq("post_draft_id", draftIds[0]) // 모든 채널 draft는 같은 미디어 공유
      .eq("is_included", true)
      .order("sort_order");

    if (draftMedia && draftMedia.length > 0) {
      // Storage private bucket — 1시간 signed URL 일괄 생성
      const paths = draftMedia
        .map((dm) => (dm.media_assets as { storage_path: string } | null)?.storage_path)
        .filter((p): p is string => Boolean(p));

      if (paths.length > 0) {
        const { data: signedUrls } = await supabase.storage
          .from("post-media")
          .createSignedUrls(paths, 3600);

        mediaWithUrls = draftMedia
          .map((dm, i) => {
            const asset = dm.media_assets as { id: string; mime_type: string | null; sort_order: number } | null;
            return {
              id: asset?.id ?? String(i),
              signedUrl: signedUrls?.[i]?.signedUrl ?? "",
              mime_type: asset?.mime_type ?? null,
              sort_order: dm.sort_order,
            };
          })
          .filter((m) => m.signedUrl);
      }
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-8">
      {/* 상단 네비게이션 */}
      <div className="mb-6">
        <Link
          href="/dashboard/composer"
          className="mb-4 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          초안 목록으로
        </Link>
        <h1 className="text-xl font-bold text-foreground">
          {draftSet.title ?? "(제목 없음)"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {draftSet.source_post_id ? "Instagram 원본 기반 초안" : "직접 작성 초안"}
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <DraftEditor
          draftSetId={draftSetId}
          drafts={drafts ?? []}
          media={mediaWithUrls}
        />
      </div>
    </div>
  );
}
