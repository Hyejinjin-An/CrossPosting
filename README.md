# CrossPosting

Instagram과 KakaoStory에 작성한 게시물의 사진, 문구, 해시태그, 링크를 다른 SNS 채널에 재사용할 수 있도록 돕는 크로스포스팅 워크스페이스입니다.

> 핵심 원칙: 플랫폼 약관을 우회하지 않는다. 공식 API로 가능한 자동 발행은 자동화하고, 공식 API가 불명확하거나 제한적인 채널은 사용자가 검수한 뒤 수동 게시할 수 있는 보조 플로우로 제공한다.

## Overview

CrossPosting은 하나의 원본 게시물을 기반으로 채널별 게시 초안을 만들고, 가능한 채널에는 공식 API로 발행하며, 제한된 채널에는 복사/다운로드/체크리스트 기반의 수동 게시 경험을 제공합니다.

현재 MVP 방향은 다음과 같습니다.

- Instagram: 공식 API 기반 가져오기 및 발행 플로우
- KakaoStory: 수동 게시 보조 플로우
- Supabase: Auth, Postgres, Storage 기반 사용자 데이터 관리
- Next.js: App Router 기반 웹 애플리케이션

상세 제품 배경과 MVP 범위는 [Product Overview](docs/PRODUCT_OVERVIEW.md)를 참고하세요.

## 구현 현황

| 영역 | 상태 |
|---|---|
| 랜딩 페이지 (`/`) | 완료 |
| Auth 콜백 (`/auth/callback`) | 완료 |
| 로그인 페이지 (`/auth/login`) | Google OAuth 구현 완료 |
| 세션 보호 프록시 (`src/proxy.ts`) | 완료 |
| 대시보드 (`/dashboard`) | Placeholder (로그아웃 버튼 포함) |
| Supabase Auth — Google OAuth | 완료 (Supabase Dashboard에서 Google Provider 활성화 필요) |
| Supabase Auth — 이메일 로그인 | 미구현 (Issue #7 범위 밖) |
| DB 마이그레이션 / RLS | 미구현 |
| Instagram OAuth | 미구현 |
| Source Import | 미구현 |
| Composer | 미구현 |
| KakaoStory 수동 보조 | 미구현 |
| Publish Jobs / 상태 추적 | 미구현 |

다음 구현 순서와 세부 가이드는 [Claude Handoff](docs/CLAUDE_HANDOFF.md)를 참고하세요.

## Tech Stack

- Next.js App Router
- React, TypeScript
- Tailwind CSS, shadcn/ui
- Supabase Auth, Postgres, Storage
- Zod, React Hook Form, TanStack Query
- Vitest, React Testing Library, Playwright 예정

## Getting Started

```bash
npm install
npm run dev
```

개발 서버 실행 후 브라우저에서 `http://localhost:3000`을 엽니다.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run format
npm run types   # Supabase 스키마 → TypeScript 타입 재생성
```

## Environment

`.env.example`을 복사해 `.env.local`을 만들고 필요한 값을 채웁니다.

```bash
cp .env.example .env.local
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

필요한 환경 변수:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
INSTAGRAM_APP_ID=
INSTAGRAM_APP_SECRET=
INSTAGRAM_REDIRECT_URI=
SENTRY_DSN=
```

## Branch Workflow

- `main`: 운영/릴리즈 브랜치
- `dev`: 개발 통합 브랜치
- `feature/issue-번호-설명`: 기능 브랜치

기능 개발은 최신 `dev`에서 브랜치를 만들고, PR의 base branch는 `dev`로 설정합니다. 릴리즈 시점에만 `dev`에서 `main`으로 PR을 올립니다.

## Documentation

- [Product Overview](docs/PRODUCT_OVERVIEW.md)
- [Product Requirements](docs/PRD.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Database](docs/DATABASE.md)
- [Risk Register](docs/RISK_REGISTER.md)
- [Roadmap](docs/ROADMAP.md)
- [Developer Kickoff](docs/DEVELOPER_KICKOFF.md)
- [Claude Handoff](docs/CLAUDE_HANDOFF.md)
- [Day 1 Initial Setup](docs/DAY1_INITIAL_SETUP.md)
