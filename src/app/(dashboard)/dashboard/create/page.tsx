import { createClient } from "@/lib/supabase/server";
import { CreateForm } from "./_components/create-form";

/** Next.js Server Component — 게시물 직접 작성 페이지 */
export default async function CreatePostPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">게시물 작성</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          직접 작성한 게시물을 채널별 초안으로 저장합니다.
        </p>
      </div>
      <CreateForm userId={user!.id} />
    </div>
  );
}
