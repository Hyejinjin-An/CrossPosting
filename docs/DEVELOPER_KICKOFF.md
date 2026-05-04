# Developer Kickoff

이 문서는 시니어 개발자에게 전달할 초기 환경 설정 및 첫 메인 화면 구현 지시서입니다.

## 1. 프로젝트 생성

현재 폴더가 비어 있는 상태에서 아래 명령으로 Next.js 프로젝트를 생성합니다.

```bash
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
```

선택지가 나오면 다음 기준으로 선택합니다.

- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- `src/` directory: Yes
- App Router: Yes
- Turbopack: 팀 선호에 따르되 초기에는 Yes 가능
- import alias: `@/*`

## 2. 기본 의존성 설치

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install zod react-hook-form @hookform/resolvers
npm install @tanstack/react-query
npm install lucide-react clsx tailwind-merge class-variance-authority
npm install -D prettier prettier-plugin-tailwindcss
```

## 3. shadcn/ui 초기화

```bash
npx shadcn@latest init
```

권장 선택:

- Style: New York
- Base color: Zinc
- CSS variables: Yes
- Components path: `@/components`
- Utils path: `@/lib/utils`

초기 컴포넌트:

```bash
npx shadcn@latest add button card badge tabs dialog dropdown-menu input textarea form toast separator avatar table skeleton
```

## 4. Supabase 초기화

Supabase CLI를 사용할 경우:

```bash
npm install -D supabase
npx supabase init
```

환경 변수는 `.env.example`을 복사해 `.env.local`에 채웁니다.

```bash
cp .env.example .env.local
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

## 5. 권장 초기 디렉터리

```text
src/
  app/
    (marketing)/
      page.tsx
    (dashboard)/
      dashboard/
        page.tsx
    auth/
      callback/
        route.ts
  components/
    brand/
    composer/
    dashboard/
    layout/
    publish/
    social-account/
    ui/
  hooks/
  lib/
    instagram/
    publishing/
    supabase/
    validation/
  server/
    actions/
    jobs/
  types/
public/
  brand/
```

## 6. 첫 메인 화면 요구사항

첫 화면은 마케팅 랜딩이 아니라 실제 앱 진입 화면처럼 만들어야 합니다. 사용자가 접속하자마자 이 서비스가 "SNS 게시물 재사용 워크스페이스"라는 것을 이해하고 다음 행동을 할 수 있어야 합니다.

### 화면 구조

- 상단 내비게이션
  - 좌측: CrossPosting 로고
  - 우측: 로그인, 대시보드 이동 버튼
- Hero 영역
  - H1: `SNS 게시물, 다시 쓰는 시간을 줄이세요`
  - Subcopy: `Instagram 게시물을 가져와 채널별 초안을 만들고, 가능한 곳은 공식 API로 발행하세요. 제한된 채널은 복사와 다운로드 플로우로 안전하게 마무리합니다.`
  - Primary CTA: `첫 게시물 가져오기`
  - Secondary CTA: `제품 설계 보기`
- Product Preview 영역
  - 좌측: 원본 게시물 카드
  - 중앙: 채널별 변환 상태
  - 우측: Instagram 자동 발행, KakaoStory 수동 보조 미리보기
- Trust/Policy 영역
  - `공식 API 우선`
  - `게시 전 검수`
  - `토큰 서버 보관`
  - `플랫폼별 제약 표시`

### 디자인 방향

- SaaS 운영 도구처럼 조용하고 신뢰감 있게 구성합니다.
- 과한 그라데이션이나 장식형 카드 남발은 피합니다.
- 카드 radius는 8px 이하로 유지합니다.
- 색상은 흰색/차콜/민트/코랄 포인트를 사용합니다.
- CTA에는 lucide 아이콘을 함께 사용합니다.
- 모바일에서는 Hero CTA와 Product Preview가 자연스럽게 세로 스택됩니다.

## 7. 첫 PR 범위

첫 PR은 아래까지만 포함합니다.

- Next.js 프로젝트 생성
- Tailwind, shadcn/ui 초기 설정
- 로고 SVG 적용
- 메인 페이지 구현
- 기본 레이아웃, 메타데이터 설정
- README의 로컬 실행 명령과 실제 package scripts 일치

## 8. 완료 기준

- `npm run dev`로 로컬 앱 실행 가능
- `/`에서 메인 화면 확인 가능
- Lighthouse 기준 접근성 90점 이상 목표
- 모바일 390px 폭에서 텍스트 겹침 없음
- 로고가 header와 favicon 후보 자산으로 사용 가능

## 9. Claude에게 줄 작업 명령 예시

```text
너는 CrossPosting 프로젝트의 시니어 개발자야. docs/PRD.md, docs/ARCHITECTURE.md, docs/DEVELOPER_KICKOFF.md를 기준으로 Next.js + TypeScript + Tailwind + shadcn/ui 초기 환경을 세팅하고 첫 메인 화면을 구현해줘.

중요 제약:
- 플랫폼 약관 우회 자동화처럼 보이는 표현은 UI에 넣지 말 것.
- 첫 화면은 랜딩 광고가 아니라 실제 SaaS 앱 진입 화면처럼 만들 것.
- public/brand/logo.svg를 header 로고로 사용.
- 모바일에서 텍스트/카드/버튼 겹침이 없도록 확인.
- 작업 후 실행한 명령, 변경 파일, 남은 TODO를 보고해줘.
```
