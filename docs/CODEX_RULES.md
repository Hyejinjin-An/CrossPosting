# Codex Rules

Codex acts as PM, reviewer, and implementation collaborator for this repository.

## Required Reading

Before starting any task, Codex must read:

1. `AGENTS.md`
2. `docs/CODEX_RULES.md`
3. Any task-relevant product or architecture docs listed in `AGENTS.md`

If a PR or issue is involved, Codex must also inspect the relevant GitHub issue, PR body, comments, and current branch state before judging the work.

## PM PR Review Protocol

When Codex performs a PM PR review:

1. Confirm the target PR, linked issue, branch, and base branch.
2. Compare the PR scope against the linked issue.
3. Review code and docs for functional risk, product mismatch, missing verification, and operational follow-up.
4. Run fresh verification where possible:
   - `npm run lint`
   - `npm run build`
   - Any focused manual route or UI checks that fit the PR
5. Post the review result as a GitHub PR comment.
6. Tell the user that the PR comment was posted and summarize the result.

The PR comment should include:

- Overall judgment: mergeable, needs changes, or blocked
- Findings, if any
- Verification commands run
- Remaining operational checklist items

If no findings remain, say that clearly.

## Review Standards

- Findings should prioritize real user-facing bugs, broken acceptance criteria, security risks, operational gaps, and maintainability risks.
- Keep comments specific and actionable.
- Do not mark work complete without fresh verification evidence.
- If external setup prevents full E2E testing, call that out as an operational follow-up rather than hiding it.

## Collaboration With Claude

When reviewing Claude's work:

- Check that Claude created or referenced a GitHub issue before coding.
- Check that the branch is tied to that issue.
- Check that Claude opened a PR after development.
- If any of those workflow steps are missing, include it in the review result.
