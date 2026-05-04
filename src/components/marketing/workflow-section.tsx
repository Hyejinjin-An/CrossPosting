import { CheckCircle2, ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "./section-heading";

interface WorkflowStepCardProps {
  step: number;
  title: string;
  children: React.ReactNode;
}

function WorkflowStepCard({ step, title, children }: WorkflowStepCardProps) {
  return (
    <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[hsl(var(--muted))] text-xs font-bold text-[hsl(var(--muted-foreground))]">
          {step}
        </div>
        <span className="text-sm font-semibold text-[hsl(var(--foreground))]">{title}</span>
      </div>
      {children}
    </div>
  );
}

function SourcePostCard() {
  return (
    <WorkflowStepCard step={1} title="원본 게시물">
      <div className="mb-3 flex aspect-square w-full items-center justify-center rounded-md bg-[hsl(var(--muted))]">
        <ImageIcon className="h-10 w-10 text-[hsl(var(--muted-foreground))]" strokeWidth={1.5} />
      </div>
      <div className="space-y-1.5">
        <div className="h-2.5 w-full rounded-full bg-[hsl(var(--muted))]" />
        <div className="h-2.5 w-4/5 rounded-full bg-[hsl(var(--muted))]" />
        <div className="h-2.5 w-2/3 rounded-full bg-[hsl(var(--muted))]" />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge variant="secondary" className="text-xs">
          #인스타그램
        </Badge>
        <Badge variant="secondary" className="text-xs">
          #신상품
        </Badge>
      </div>
    </WorkflowStepCard>
  );
}

function ChannelDraftsCard() {
  return (
    <WorkflowStepCard step={2} title="채널별 초안">
      <div className="space-y-3">
        <div className="rounded-md border border-[hsl(var(--border))] p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-[hsl(var(--foreground))]">Instagram</span>
            <Badge className="bg-[#1FBF9A]/15 text-[#0f8a6e] hover:bg-[#1FBF9A]/20 text-[10px]">
              API 발행
            </Badge>
          </div>
          <div className="space-y-1">
            <div className="h-2 w-full rounded-full bg-[hsl(var(--muted))]" />
            <div className="h-2 w-5/6 rounded-full bg-[hsl(var(--muted))]" />
          </div>
          <div className="mt-2 text-[10px] text-[hsl(var(--muted-foreground))]">
            글자 수 제한 ✓ &nbsp; 이미지 비율 ✓
          </div>
        </div>
        <div className="rounded-md border border-[hsl(var(--border))] p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-[hsl(var(--foreground))]">KakaoStory</span>
            <Badge variant="secondary" className="text-[10px]">
              수동 보조
            </Badge>
          </div>
          <div className="space-y-1">
            <div className="h-2 w-full rounded-full bg-[hsl(var(--muted))]" />
            <div className="h-2 w-3/4 rounded-full bg-[hsl(var(--muted))]" />
          </div>
          <div className="mt-2 flex gap-1.5">
            <span className="rounded bg-[hsl(var(--muted))] px-1.5 py-0.5 text-[10px] text-[hsl(var(--muted-foreground))]">
              본문 복사
            </span>
            <span className="rounded bg-[hsl(var(--muted))] px-1.5 py-0.5 text-[10px] text-[hsl(var(--muted-foreground))]">
              이미지 저장
            </span>
          </div>
        </div>
      </div>
    </WorkflowStepCard>
  );
}

function PublishStatusCard() {
  return (
    <WorkflowStepCard step={3} title="발행 상태">
      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-md bg-[hsl(var(--muted))] px-3 py-2.5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#1FBF9A]" />
            <span className="text-xs text-[hsl(var(--foreground))]">Instagram</span>
          </div>
          <span className="text-[10px] font-medium text-[#1FBF9A]">발행 완료</span>
        </div>
        <div className="flex items-center justify-between rounded-md bg-[hsl(var(--muted))] px-3 py-2.5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            <span className="text-xs text-[hsl(var(--foreground))]">KakaoStory</span>
          </div>
          <span className="text-[10px] font-medium text-[hsl(var(--muted-foreground))]">패키지 준비</span>
        </div>
        <div className="mt-2 rounded-md border border-[hsl(var(--border))] p-3 text-[11px] text-[hsl(var(--muted-foreground))]">
          <span className="font-semibold text-[hsl(var(--foreground))]">게시 이력</span>
          <br />
          무엇을 어디에 올렸는지
          <br />
          한 화면에서 확인합니다.
        </div>
      </div>
    </WorkflowStepCard>
  );
}

export function WorkflowSection() {
  return (
    <section id="workflow" className="mx-auto max-w-5xl scroll-mt-20 px-4 py-14 sm:px-6">
      <SectionHeading eyebrow="워크플로우 미리보기" title="원본 하나로 채널별 초안을 만드는 과정" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SourcePostCard />
        <ChannelDraftsCard />
        <PublishStatusCard />
      </div>
    </section>
  );
}
