import { CheckCircle2, Link2, ShieldCheck, Zap } from "lucide-react";
import { SectionHeading } from "./section-heading";

interface TrustCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function TrustCard({ icon, title, description }: TrustCardProps) {
  return (
    <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-[#1FBF9A]/10 text-[#1FBF9A]">
        {icon}
      </div>
      <h3 className="mb-1.5 text-sm font-semibold text-[hsl(var(--foreground))]">{title}</h3>
      <p className="text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">{description}</p>
    </div>
  );
}

export function TrustSection() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <SectionHeading eyebrow="운영 원칙" title="믿고 쓸 수 있는 도구를 목표로 합니다" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TrustCard
          icon={<Zap className="h-5 w-5" />}
          title="공식 API 우선"
          description="지원되는 채널은 공식 API로만 발행합니다. 비공식 자동화는 사용하지 않습니다."
        />
        <TrustCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          title="게시 전 검수"
          description="글자 수, 이미지 비율 등 채널별 제약을 발행 전에 확인합니다."
        />
        <TrustCard
          icon={<ShieldCheck className="h-5 w-5" />}
          title="토큰 서버 보관"
          description="SNS 토큰은 서버에만 저장됩니다. 클라이언트 번들에 포함되지 않습니다."
        />
        <TrustCard
          icon={<Link2 className="h-5 w-5" />}
          title="플랫폼별 제약 표시"
          description="각 채널의 정책과 제한을 투명하게 안내합니다."
        />
      </div>
    </section>
  );
}
