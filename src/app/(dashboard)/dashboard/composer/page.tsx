import Link from "next/link";
import { PenLine } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { DraftSetList } from "./_components/draft-set-list";

/** Next.js Server Component — 초안 관리 목록 (post_draft_sets 전체 조회) */
export default async function ComposerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: draftSets } = await supabase
    .from("post_draft_sets")
    .select(`
      id,
      title,
      status,
      created_at,
      post_drafts (
        id,
        target_channel,
        status
      )
    `)
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">초안 관리</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            저장된 초안을 편집하고 발행을 준비합니다.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/create">
            <PenLine className="mr-1.5 h-3.5 w-3.5" />
            새 게시물
          </Link>
        </Button>
      </div>

      <DraftSetList draftSets={draftSets ?? []} />
    </div>
  );
}
