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

## Shared Workflow Rules

- Do not commit directly to `main`.
- Start feature work from the latest `dev`.
- Keep changes scoped to the GitHub issue.
- Link PRs to their issue with `Closes #<issue-number>`.
- Check relevant `docs/solutions/` learnings before repeating similar implementation or review work.
- Do not implement platform-policy workarounds or automation that bypasses official platform terms.
- Treat KakaoStory as manual posting assistance only unless official API support is explicitly confirmed.
- Use official APIs for Instagram automation.
