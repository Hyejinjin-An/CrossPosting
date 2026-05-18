# AGENTS.md

This repository is CrossPosting, a Next.js App Router application for turning one source post into channel-specific social publishing drafts and workflows.

## Mandatory Startup Reading

Before doing any work in this repository, every agent must read the rule document for its role:

- Codex must read `docs/CODEX_RULES.md`.
- Claude must read `docs/CLAUDE_RULES.md`.

If the task involves both roles, read both files. These role rules are part of the repo workflow and should be treated as project instructions.

## Core Project Context

- Product: CrossPosting
- Stack: Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui, Supabase
- Base branch for feature work: `dev`
- Feature branch naming: `feature/issue-<number>-<short-description>`
- Main product docs:
  - `docs/PRODUCT_OVERVIEW.md`
  - `docs/PRD.md`
  - `docs/ARCHITECTURE.md`
  - `docs/DATABASE.md`
  - `docs/ROADMAP.md`
  - `docs/RISK_REGISTER.md`
  - `docs/CLAUDE_HANDOFF.md`
- Durable learning docs:
  - `docs/solutions/` stores Compound Engineering notes from completed execution-review cycles.

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run format
npm run types
```

There are no automated tests in this project yet. For now, at minimum run `npm run lint` and `npm run build` before marking implementation work complete.

## Environment

Copy `.env.example` to `.env.local` and fill in the required values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `INSTAGRAM_APP_ID`
- `INSTAGRAM_APP_SECRET`
- `INSTAGRAM_REDIRECT_URI`
- `SENTRY_DSN`

Supabase Dashboard provider setup, OAuth app secrets, and production credentials are operator-managed and should not be committed.

## Mandatory Code Comments (모든 에이전트 필수)

코드를 작성하거나 수정할 때 주석은 **선택이 아니라 필수**다. 구현 완료 전 반드시 확인한다.

### 모든 함수·컴포넌트에 JSDoc 주석 작성

```ts
/** Next.js Server Component — 대시보드 홈 (통계 실 DB 조회, 기능 미리보기) */
export default async function DashboardPage() { ... }

/** Next.js Client Component — 사이드바 (usePathname으로 활성 메뉴 표시) */
export function DashboardSidebar({ displayName }: Props) { ... }

/** Supabase Server Action — 이메일/패스워드 로그인, 실패 시 error 반환 */
export async function signIn(formData: FormData) { ... }
```

### JSDoc에 반드시 포함할 항목

1. **선언 타입**: `Next.js Server Component`, `Client Component`, `Server Action`, `Route Handler`, `React Hook`, `Utility` 등
2. **한 줄 요약**: 이 함수/컴포넌트가 하는 핵심 일
3. **파라미터**: 이름만으로 의미가 불명확한 경우
4. **반환값**: 복잡한 구조일 경우

### 비자명 로직에 인라인 주석 필수

```ts
// profiles.display_name 우선, 없으면 Google OAuth user_metadata, 없으면 이메일 앞부분
const displayName = profile?.display_name ?? user?.user_metadata?.full_name ?? user?.email?.split("@")[0];
```

단순 getter여도 선언 타입 맥락 JSDoc은 **항상** 작성한다.

## Shared Workflow Rules

- Do not commit directly to `main`.
- Start feature work from the latest `dev`.
- Keep changes scoped to the GitHub issue.
- Link PRs to their issue with `Closes #<issue-number>`.
- Check relevant `docs/solutions/` learnings before repeating similar implementation or review work.
- Do not implement platform-policy workarounds or automation that bypasses official platform terms.
- Treat KakaoStory as manual posting assistance only unless official API support is explicitly confirmed.
- Use official APIs for Instagram automation.
