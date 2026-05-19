"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveProfile } from "../actions";

const PHONE_RE = /^01[016789]\d{7,8}$/;

const schema = z.object({
  display_name: z.string().min(1, "이름을 입력하세요.").max(50, "이름은 50자 이하로 입력하세요."),
  gender: z.enum(["male", "female", "other"], { message: "성별을 선택하세요." }),
  phone: z.string().regex(PHONE_RE, "올바른 휴대폰 번호를 입력하세요. (예: 01012345678)"),
});

type FormValues = z.infer<typeof schema>;

interface Profile {
  display_name: string | null;
  gender: string | null;
  phone: string | null;
}

interface SettingsFormProps {
  profile: Profile;
}

/** Next.js Client Component — 프로필 설정 폼 (이름/성별/전화번호 수정, 저장 피드백) */
export function SettingsForm({ profile }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [saveResult, setSaveResult] = useState<{ success: boolean; error?: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      display_name: profile.display_name ?? "",
      // profiles.gender 값이 enum 범위 밖일 경우 빈 문자열로 fallback
      gender: (["male", "female", "other"].includes(profile.gender ?? "") ? profile.gender : "") as FormValues["gender"],
      phone: profile.phone ?? "",
    },
  });

  const onSubmit = (values: FormValues) => {
    setSaveResult(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("display_name", values.display_name);
      formData.set("gender", values.gender);
      formData.set("phone", values.phone);

      const result = await saveProfile(formData);
      setSaveResult(result);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      {/* 이름 */}
      <div className="space-y-1.5">
        <Label htmlFor="display_name">이름</Label>
        <Input
          id="display_name"
          {...register("display_name")}
          placeholder="홍길동"
          autoComplete="name"
        />
        {errors.display_name && (
          <p className="text-xs text-destructive">{errors.display_name.message}</p>
        )}
      </div>

      {/* 성별 */}
      <div className="space-y-1.5">
        <Label>성별</Label>
        <div className="flex gap-2">
          {[
            { value: "male",   label: "남성" },
            { value: "female", label: "여성" },
            { value: "other",  label: "기타" },
          ].map(({ value, label }) => (
            <label
              key={value}
              className="flex flex-1 cursor-pointer items-center justify-center rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:checked]:text-primary hover:border-primary/40 hover:bg-muted"
            >
              <input
                type="radio"
                value={value}
                {...register("gender")}
                className="sr-only"
              />
              {label}
            </label>
          ))}
        </div>
        {errors.gender && (
          <p className="text-xs text-destructive">{errors.gender.message}</p>
        )}
      </div>

      {/* 전화번호 */}
      <div className="space-y-1.5">
        <Label htmlFor="phone">휴대폰 번호</Label>
        <Input
          id="phone"
          {...register("phone")}
          placeholder="01012345678"
          autoComplete="tel"
          inputMode="numeric"
        />
        {errors.phone && (
          <p className="text-xs text-destructive">{errors.phone.message}</p>
        )}
      </div>

      {/* 저장 피드백 */}
      {saveResult?.success && (
        <div className="flex items-center gap-2 rounded-md bg-green-500/10 px-3 py-2 text-sm text-green-700 dark:text-green-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          프로필이 저장되었습니다.
        </div>
      )}
      {saveResult?.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {saveResult.error}
        </p>
      )}

      {/* 제출 */}
      <Button type="submit" disabled={isPending || !isDirty} className="w-full sm:w-auto">
        {isPending ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" />저장 중...</>
        ) : (
          "저장"
        )}
      </Button>
    </form>
  );
}
