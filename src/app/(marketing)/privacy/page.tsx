import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata = {
  title: "개인정보 처리방침 — CrossPosting",
  description: "CrossPosting 서비스의 개인정보 수집·이용·보관·파기 방침을 안내합니다.",
};

/** Next.js Server Component — 개인정보 처리방침 정적 페이지 */
export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
            개인정보 처리방침
          </h1>
          <p className="mb-10 text-sm text-muted-foreground">
            최종 수정일: 2026년 5월 26일
          </p>

          <Section title="1. 수집하는 개인정보 항목">
            <p>CrossPosting(이하 &quot;서비스&quot;)은 다음 항목을 수집합니다.</p>
            <ul>
              <li>
                <strong>회원가입·로그인:</strong> 이메일 주소, 이름(선택), 성별(선택),
                전화번호(선택)
              </li>
              <li>
                <strong>소셜 계정 연결:</strong> Instagram 계정 ID, 사용자 이름,
                액세스 토큰(서버 암호화 저장)
              </li>
              <li>
                <strong>게시물 데이터:</strong> Instagram에서 가져오거나 직접 작성한
                텍스트·이미지
              </li>
              <li>
                <strong>자동 수집:</strong> 서비스 이용 로그, 접속 IP, 브라우저 정보
                (보안·오류 대응 목적)
              </li>
            </ul>
          </Section>

          <Section title="2. 개인정보 수집·이용 목적">
            <ul>
              <li>회원 식별 및 서비스 제공</li>
              <li>소셜 미디어 게시물 가져오기·발행 기능 제공</li>
              <li>서비스 품질 개선 및 오류 분석</li>
              <li>법령 준수 및 분쟁 해결</li>
            </ul>
          </Section>

          <Section title="3. 개인정보 보유·이용 기간">
            <p>
              회원 탈퇴 시 또는 수집·이용 목적 달성 시 즉시 파기합니다. 단, 관계
              법령에 따라 보존해야 하는 경우 해당 기간 동안 보관합니다.
            </p>
            <ul>
              <li>
                전자상거래 등에서의 소비자 보호에 관한 법률: 계약·청약 철회 기록
                5년, 대금결제 기록 5년
              </li>
              <li>통신비밀보호법: 서비스 이용 로그 3개월</li>
            </ul>
          </Section>

          <Section title="4. 제3자 제공">
            <p>
              서비스는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 다만,
              서비스 운영을 위해 아래 제3자에게 개인정보를 처리 위탁합니다.
            </p>
            <table>
              <thead>
                <tr>
                  <th>수탁 업체</th>
                  <th>위탁 업무</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Supabase, Inc.</td>
                  <td>데이터베이스 및 인증 서비스</td>
                </tr>
                <tr>
                  <td>Vercel, Inc.</td>
                  <td>서버 인프라 및 배포</td>
                </tr>
                <tr>
                  <td>Meta Platforms, Inc.</td>
                  <td>Instagram Graph API 연동 (사용자 동의 하에)</td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Section title="5. 개인정보의 파기">
            <p>
              보유 기간이 만료되거나 목적 달성 시 다음과 같이 파기합니다.
            </p>
            <ul>
              <li>전자 파일: 복구 불가능한 방법으로 영구 삭제</li>
              <li>
                회원 탈퇴 요청 시 계정 정보, 연결된 소셜 계정 토큰, 업로드 미디어를
                모두 삭제합니다.
              </li>
            </ul>
          </Section>

          <Section title="6. 이용자의 권리">
            <p>이용자는 언제든지 다음 권리를 행사할 수 있습니다.</p>
            <ul>
              <li>개인정보 열람·정정·삭제 요청</li>
              <li>개인정보 처리 정지 요청</li>
              <li>동의 철회 (서비스 탈퇴를 통해 처리)</li>
            </ul>
            <p>
              권리 행사는 서비스 내 설정 페이지 또는 아래 이메일로 요청하시기
              바랍니다.
            </p>
          </Section>

          <Section title="7. 개인정보 보호책임자">
            <p>
              서비스는 개인정보 처리에 관한 업무를 총괄하고, 이용자의 개인정보 관련
              불만 처리 및 피해 구제를 위해 아래와 같이 개인정보 보호책임자를
              지정합니다.
            </p>
            <ul>
              <li>
                <strong>책임자:</strong> CrossPosting 운영팀
              </li>
              <li>
                <strong>이메일:</strong> ahnae0630@gmail.com
              </li>
            </ul>
          </Section>

          <Section title="8. 쿠키 및 자동 수집">
            <p>
              서비스는 세션 유지 및 보안을 위해 쿠키를 사용합니다. 브라우저 설정에서
              쿠키를 거부할 경우 로그인 등 일부 기능이 제한될 수 있습니다.
            </p>
          </Section>

          <Section title="9. 방침 변경">
            <p>
              이 방침은 법령 또는 서비스 정책 변경에 따라 개정될 수 있습니다. 변경
              시 서비스 내 공지 또는 이메일을 통해 사전 안내합니다.
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

/** React Server Component — 개인정보처리방침 섹션 래퍼 (제목 + 본문 슬롯) */
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
      <div className="space-y-2 text-sm leading-relaxed text-muted-foreground [&_ul]:ml-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_td]:text-xs [&_th]:border [&_th]:border-border [&_th]:bg-muted [&_th]:px-3 [&_th]:py-2 [&_th]:text-xs [&_th]:font-medium">
        {children}
      </div>
    </section>
  );
}
