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
5. After the Superpowers verification/review step is complete, run the Compound Engineering knowledge capture step:
   - Use `ce-compound` for the completed review/implementation cycle.
   - Capture mistakes, false starts, review findings, fixes, verification gaps, and operational lessons while context is fresh.
   - Store durable learnings under `docs/solutions/` according to the Compound workflow.
   - If the issue was routine and produced no reusable lesson, record that no compound-worthy learning was found in the user summary.
6. Post the review result as a GitHub PR comment.
7. Tell the user that the PR comment was posted, summarize the result, and mention whether a Compound note was created or skipped.

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
- Check whether Claude consulted relevant `docs/solutions/` learnings before or during implementation.
- If any of those workflow steps are missing, include it in the review result.

## Compound Engineering

Compound Engineering is installed for Codex as `compound-engineering`.

- Use `ce-compound` at the end of meaningful review or implementation cycles.
- Prefer documenting patterns that could prevent repeat mistakes: scope drift, missing setup notes, weak verification, review-loop failures, or misunderstood architecture.
- Keep generated learning documents practical and searchable for future Claude and Codex sessions.
- Future agents should be able to read `docs/solutions/` before similar work and avoid repeating the same mistakes.
