import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ManualTaskView } from "./_components/manual-task-view";

interface PageProps {
  params: Promise<{ taskId: string }>;
}

/** Next.js Server Component — KakaoStory 수동 게시 보조 페이지 (task + draft + media signed URL 조회) */
export default async function ManualTaskPage({ params }: PageProps) {
  const { taskId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // task 조회 (소유권 확인)
  const { data: task } = await supabase
    .from("manual_publish_tasks")
    .select(`
      id,
      status,
      body_copied_at,
      media_downloaded_at,
      opened_platform_at,
      completed_at,
      post_drafts (
        id,
        body,
        hashtags,
        draft_set_id
      )
    `)
    .eq("id", taskId)
    .eq("user_id", user!.id)
    .single();

  if (!task) notFound();

  const draft = task.post_drafts as {
    id: string;
    body: string | null;
    hashtags: string[];
    draft_set_id: string;
  } | null;

  // 미디어 조회 (post_draft_media → media_assets)
  let mediaWithUrls: { id: string; signedUrl: string; mime_type: string | null; sort_order: number }[] = [];

  if (draft) {
    const { data: draftMedia } = await supabase
      .from("post_draft_media")
      .select("sort_order, media_assets (id, storage_path, mime_type, sort_order)")
      .eq("post_draft_id", draft.id)
      .eq("is_included", true)
      .order("sort_order");

    if (draftMedia && draftMedia.length > 0) {
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
    <div className="mx-auto w-full max-w-lg px-6 py-8">
      <div className="mb-6">
        <Link
          href={`/dashboard/composer/${draft?.draft_set_id ?? ""}`}
          className="mb-4 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Composer로 돌아가기
        </Link>
        <h1 className="text-xl font-bold text-foreground">KakaoStory 수동 게시</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          아래 단계를 순서대로 완료하고 카카오스토리에 직접 게시하세요.
        </p>
      </div>

      <ManualTaskView
        taskId={taskId}
        body={draft?.body ?? ""}
        hashtags={draft?.hashtags ?? []}
        media={mediaWithUrls}
        initialStatus={task.status}
        initialBodyCopiedAt={task.body_copied_at}
        initialMediaDownloadedAt={task.media_downloaded_at}
        initialOpenedAt={task.opened_platform_at}
        initialCompletedAt={task.completed_at}
        draftSetId={draft?.draft_set_id ?? ""}
      />
    </div>
  );
}
