# Claude Rules

Claude acts as the primary feature implementation agent for this repository.

## Required Reading

Before starting any task, Claude must read:

1. `AGENTS.md`
2. `docs/CLAUDE_RULES.md`
3. `docs/CLAUDE_HANDOFF.md`
4. Any task-relevant product or architecture docs listed in `AGENTS.md`

Do not start coding until these documents have been checked for current workflow and product context.

## Issue-First Development

Before writing code, Claude must make sure there is a relevant GitHub issue.

If no suitable issue exists:

1. Create a GitHub issue first.
2. Include the goal, scope, acceptance criteria, and relevant docs.
3. Use that issue number for the branch and PR.

If a suitable issue already exists:

1. Read the issue before coding.
2. Confirm the implementation scope matches the issue.
3. Do not silently add unrelated work.

## Compound Learnings Before Development

Before planning or coding, Claude must check whether there are relevant prior learnings in `docs/solutions/`.

Use this lightweight process:

1. Search `docs/solutions/` for terms related to the issue, affected files, framework, feature area, and previous review findings.
2. Read any matching solution notes before implementation.
3. Apply the prevention guidance from those notes to the plan and verification checklist.
4. If no matching notes exist, proceed and mention that no relevant Compound learning was found in the handoff.

The goal is to avoid repeating mistakes from previous execution-review cycles.

## Mandatory Code Comments

코드를 작성하거나 수정할 때 주석은 선택이 아니라 필수다.

### 모든 함수·컴포넌트에 JSDoc 주석 작성

```ts
/** Next.js Server Component — 대시보드 홈 (통계 실 DB 조회, 기능 미리보기) */
export default async function DashboardPage() { ... }

/** Next.js Client Component — 대시보드 좌측 사이드바 (usePathname으로 활성 메뉴 표시) */
export function DashboardSidebar({ displayName, email }: DashboardSidebarProps) { ... }

/** Supabase Server Action — 이메일/패스워드로 로그인, 실패 시 error 반환 */
export async function signIn(formData: FormData) { ... }
```

### JSDoc에 반드시 포함할 항목

1. **선언 타입**: `Next.js Server Component`, `Next.js Client Component`, `Next.js Server Action`, `Next.js Route Handler`, `Supabase SSR Client`, `React Hook`, `Utility Function` 등
2. **한 줄 요약**: 이 함수/컴포넌트가 하는 핵심 일
3. **파라미터 설명**: 이름만으로 의미가 불명확한 파라미터
4. **반환값 설명**: 복잡한 반환 구조

### 비자명 로직에 인라인 주석 필수

```ts
// profiles.display_name 우선, 없으면 user_metadata.full_name (Google OAuth), 없으면 이메일 앞부분
const displayName = profile?.display_name ?? user?.user_metadata?.full_name ?? user?.email?.split("@")[0];

// status = 'active' 인 계정만 카운트 (만료/해제 계정 제외)
const { count } = await supabase.from("social_accounts").select("*", { count: "exact", head: true }).eq("status", "active");
```

### 주석 작성 기준

- 함수 이름만 보고 역할을 100% 알 수 있어도 → 선언 타입 맥락 주석은 **필수**
- 비자명 조건, 순서, 외부 제약이 있으면 → 인라인 `//` 주석 **필수**
- 단순 getter/setter여도 → JSDoc 한 줄 + 선언 타입 **필수**

## Branch Workflow

For implementation work:

1. Start from the latest `dev`.
2. Create or switch to a branch named `feature/issue-<number>-<short-description>`.
3. Keep commits scoped to the issue.
4. Do not commit directly to `main`.

## Development Completion

Before saying development is complete, Claude must:

1. Run `npm run lint`.
2. Run `npm run build`.
3. Check any focused manual behavior needed by the issue.
4. Update docs if the implementation changes product behavior, setup, or workflow.
5. Commit the completed changes.
6. Push the branch.
7. Open a GitHub PR against `dev`.
8. Include any relevant `docs/solutions/` learnings consulted in the PR body or handoff.

The PR must include:

- `Closes #<issue-number>`
- Summary of changed files and behavior
- Verification results
- Any manual setup required after merge
- Any known out-of-scope items

## Handoff To Codex

After opening the PR, Claude must share with Codex:

- PR URL and issue number
- What was implemented
- Verification commands and results
- Anything not fully testable locally
- Any required operator setup after merge
- Which `docs/solutions/` learnings were consulted, or that none were relevant

If the PR depends on external configuration, such as Supabase Dashboard OAuth provider setup, state that clearly in the PR body and handoff.
