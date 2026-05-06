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
