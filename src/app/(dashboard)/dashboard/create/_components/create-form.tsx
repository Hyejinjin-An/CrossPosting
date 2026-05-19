"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveDraft } from "../actions";
import { INSTAGRAM_MAX, parseHashtags } from "@/lib/composer";

const schema = z.object({
  body: z
    .string()
    .min(1, "내용을 입력하세요.")
    .max(INSTAGRAM_MAX, `Instagram 제한인 ${INSTAGRAM_MAX.toLocaleString()}자를 초과했습니다.`),
  hashtagRaw: z.string(),
  channels: z.array(z.string()).min(1, "채널을 하나 이상 선택하세요."),
});

type FormValues = z.infer<typeof schema>;

interface ImagePreview {
  file: File;
  url: string;
}

interface CreateFormProps {
  userId: string;
}

/** Next.js Client Component — 게시물 직접 작성 폼 (이미지 업로드 + 채널 선택 + 초안 저장) */
export function CreateForm({ userId }: CreateFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bodyLen, setBodyLen] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { body: "", hashtagRaw: "", channels: [] },
  });

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    // 최대 10장 제한
    const remaining = 10 - images.length;
    const selected = files.slice(0, remaining).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...selected]);
    e.target.value = "";
  }

  function removeImage(index: number) {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  }

  const onSubmit = (values: FormValues) => {
    setSubmitError(null);
    startTransition(async () => {
      const supabase = createClient();

      // 이미지 Supabase Storage에 업로드 (post-media/{userId}/{timestamp}-{filename})
      const storagePaths: { path: string; mimeType: string; sizeBytes: number; sortOrder: number }[] = [];

      for (let i = 0; i < images.length; i++) {
        const file = images[i].file;
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${userId}/${Date.now()}-${i}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("post-media")
          .upload(path, file, { contentType: file.type });

        if (uploadError) {
          setSubmitError(`이미지 업로드 실패: ${uploadError.message}`);
          return;
        }
        storagePaths.push({ path, mimeType: file.type, sizeBytes: file.size, sortOrder: i });
      }

      const result = await saveDraft({
        body: values.body,
        hashtags: parseHashtags(values.hashtagRaw),
        channels: values.channels,
        storagePaths,
      });

      if (!result.success) {
        setSubmitError(result.error);
        return;
      }

      // 저장 완료 후 Composer 편집 페이지로 이동
      router.push(`/dashboard/composer/${result.draftSetId}`);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* 본문 */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="body">본문</Label>
          <span className={`text-[11px] ${bodyLen > INSTAGRAM_MAX ? "text-destructive font-semibold" : "text-muted-foreground"}`}>
            {bodyLen.toLocaleString()} / {INSTAGRAM_MAX.toLocaleString()}
          </span>
        </div>
        <textarea
          id="body"
          {...register("body", { onChange: (e) => setBodyLen(e.target.value.length) })}
          rows={8}
          placeholder="게시물 내용을 입력하세요..."
          className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {errors.body && (
          <p className="text-xs text-destructive">{errors.body.message}</p>
        )}
      </div>

      {/* 해시태그 */}
      <div className="space-y-1.5">
        <Label htmlFor="hashtagRaw">해시태그</Label>
        <Input
          id="hashtagRaw"
          {...register("hashtagRaw")}
          placeholder="#여행 #일상 (공백이나 쉼표로 구분)"
        />
        <p className="text-[11px] text-muted-foreground"># 없이 입력해도 됩니다.</p>
      </div>

      {/* 이미지 업로드 */}
      <div className="space-y-1.5">
        <Label>이미지 <span className="text-muted-foreground font-normal">({images.length}/10)</span></Label>
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, i) => (
            <div key={img.url} className="relative aspect-square overflow-hidden rounded-md border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={`이미지 ${i + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-sm"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {images.length < 10 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex aspect-square items-center justify-center rounded-md border border-dashed border-border bg-muted/30 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              <ImagePlus className="h-5 w-5" />
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageSelect}
        />
      </div>

      {/* 채널 선택 */}
      <div className="space-y-2">
        <Label>발행 채널</Label>
        <div className="flex flex-col gap-2">
          {[
            { value: "instagram",   label: "Instagram",   note: "계정 연결 후 자동 발행" },
            { value: "kakaostory",  label: "KakaoStory",  note: "수동 게시 보조 패키지 생성" },
          ].map(({ value, label, note }) => (
            <label key={value} className="flex items-start gap-3 rounded-md border border-border px-4 py-3 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors has-[:checked]:border-primary/50 has-[:checked]:bg-primary/5">
              <input
                type="checkbox"
                value={value}
                {...register("channels")}
                className="mt-0.5 accent-primary"
              />
              <div>
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-[11px] text-muted-foreground">{note}</p>
              </div>
            </label>
          ))}
        </div>
        {errors.channels && (
          <p className="text-xs text-destructive">{errors.channels.message}</p>
        )}
      </div>

      {/* 에러 */}
      {submitError && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{submitError}</p>
      )}

      {/* 제출 */}
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>
          취소
        </Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />저장 중...</>
          ) : (
            "초안 저장"
          )}
        </Button>
      </div>

    </form>
  );
}
