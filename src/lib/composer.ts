import { z } from "zod";

/** Instagram 본문 최대 글자 수 */
export const INSTAGRAM_MAX = 2200;

/** Utility Function — 해시태그 문자열 → 배열 파싱 (공백/쉼표 구분, # 자동 제거) */
export function parseHashtags(raw: string): string[] {
  return raw
    .split(/[\s,]+/)
    .map((t) => t.replace(/^#/, "").trim())
    .filter(Boolean);
}

/** Zod schema — 채널별 초안 본문 검증 (채널 파라미터로 글자 수 제한 분기) */
export function makeDraftSchema(channel: string) {
  const max = channel === "instagram" ? INSTAGRAM_MAX : 10000;
  return z.object({
    body: z.string().min(1, "내용을 입력하세요.").max(max, `${max.toLocaleString()}자를 초과했습니다.`),
    hashtagRaw: z.string(),
  });
}
