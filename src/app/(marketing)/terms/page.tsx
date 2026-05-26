import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata = {
  title: "서비스 이용약관 — CrossPosting",
  description: "CrossPosting 서비스 이용약관을 안내합니다.",
};

/** Next.js Server Component — 서비스 이용약관 정적 페이지 */
export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
            서비스 이용약관
          </h1>
          <p className="mb-10 text-sm text-muted-foreground">
            최종 수정일: 2026년 5월 26일
          </p>

          <Section title="제1조 (목적)">
            <p>
              이 약관은 CrossPosting(이하 &quot;서비스&quot;)이 제공하는 소셜 미디어
              크로스포스팅 서비스의 이용 조건 및 절차, 이용자와 서비스 간의 권리·의무
              및 책임 사항을 규정함을 목적으로 합니다.
            </p>
          </Section>

          <Section title="제2조 (서비스 설명)">
            <p>
              CrossPosting은 이용자가 Instagram 등 소셜 미디어 계정을 연결하여 게시물을
              가져오고, 채널별 초안을 작성하며, 공식 API를 통해 발행하거나 수동 게시
              플로우를 보조하는 워크플로우 도구입니다.
            </p>
            <ul>
              <li>소셜 계정 연결 및 게시물 가져오기</li>
              <li>채널별 초안 작성 및 편집</li>
              <li>Instagram 공식 Graph API를 통한 자동 발행</li>
              <li>KakaoStory 수동 게시 보조 (복사 + 체크리스트)</li>
            </ul>
          </Section>

          <Section title="제3조 (이용자의 의무)">
            <p>이용자는 다음 행위를 하여서는 안 됩니다.</p>
            <ul>
              <li>타인의 계정을 도용하거나 허위 정보를 등록하는 행위</li>
              <li>
                각 소셜 미디어 플랫폼(Meta, Kakao 등)의 이용약관 및 정책을 위반하는
                콘텐츠를 게시하는 행위
              </li>
              <li>서비스의 정상 운영을 방해하는 행위 (DoS, 크롤링 등)</li>
              <li>
                공식 API 범위 외의 자동화 또는 플랫폼 약관 우회를 시도하는 행위
              </li>
              <li>
                제3자의 저작권, 상표권, 개인정보 등 지식재산권을 침해하는 콘텐츠
                업로드
              </li>
              <li>음란물, 혐오 표현, 불법 콘텐츠를 포함하는 게시물 작성</li>
            </ul>
          </Section>

          <Section title="제4조 (서비스의 제공 및 변경)">
            <p>
              서비스는 연중무휴·24시간 제공을 원칙으로 하되, 시스템 점검·장애·천재지변
              등 불가피한 사유로 일시 중단될 수 있습니다. 서비스 내용·기능은 사전 공지
              없이 변경될 수 있으며, 중단 시에는 서비스 내 공지합니다.
            </p>
          </Section>

          <Section title="제5조 (콘텐츠의 소유권)">
            <p>
              이용자가 서비스에 업로드한 게시물·이미지 등 콘텐츠의 저작권은 이용자에게
              있습니다. 서비스는 서비스 운영에 필요한 범위 내에서만 해당 콘텐츠를
              저장·처리합니다.
            </p>
          </Section>

          <Section title="제6조 (면책 조항)">
            <ul>
              <li>
                서비스는 이용자가 게시한 콘텐츠로 인한 법적 분쟁에 대해 책임을 지지
                않습니다.
              </li>
              <li>
                소셜 미디어 플랫폼의 API 정책 변경·서비스 중단으로 인한 기능 제한에
                대해 책임을 지지 않습니다.
              </li>
              <li>
                이용자의 소셜 계정 해킹·무단 접근으로 인한 피해에 대해 책임을 지지
                않습니다.
              </li>
              <li>
                천재지변, 인터넷 장애 등 불가항력적 사유로 인한 서비스 중단에 대해
                책임을 지지 않습니다.
              </li>
            </ul>
          </Section>

          <Section title="제7조 (계정 해지 및 이용 제한)">
            <p>
              이용자는 언제든지 서비스 내 설정 페이지에서 회원 탈퇴를 요청할 수
              있습니다. 탈퇴 시 모든 계정 정보 및 연결된 소셜 계정 토큰, 업로드된
              미디어가 삭제됩니다.
            </p>
            <p>
              제3조를 위반한 이용자에 대해서는 사전 통보 없이 이용을 제한하거나 계정을
              삭제할 수 있습니다.
            </p>
          </Section>

          <Section title="제8조 (분쟁 해결 및 관할)">
            <p>
              서비스 이용과 관련한 분쟁은 서비스 운영팀과의 협의를 통해 해결을
              시도합니다. 협의가 이루어지지 않는 경우 대한민국 법률을 준거법으로 하며,
              서울중앙지방법원을 관할 법원으로 합니다.
            </p>
          </Section>

          <Section title="제9조 (약관 변경)">
            <p>
              서비스는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 서비스 내
              공지 또는 이메일을 통해 시행일 7일 전에 안내합니다. 이용자가 변경에
              동의하지 않을 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.
            </p>
          </Section>

          <div className="mt-12 border-t border-border pt-6">
            <Link href="/" className="text-sm text-primary hover:underline">
              ← 홈으로 돌아가기
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

/** React Server Component — 이용약관 섹션 래퍼 (제목 + 본문 슬롯) */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-semibold text-foreground">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-muted-foreground [&_ul]:ml-4 [&_ul]:list-disc [&_ul]:space-y-1">
        {children}
      </div>
    </section>
  );
}
