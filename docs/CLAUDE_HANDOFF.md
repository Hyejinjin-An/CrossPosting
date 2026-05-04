# Claude Handoff

이 문서는 Claude가 토큰과 컨텍스트를 아끼면서 개발을 이어가기 위한 작업 기준입니다.

## 현재 프로젝트 상태

- Product: SNS Commit
- Stack: Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui, Supabase 예정
- Current milestone: 초기 프로젝트 세팅 및 메인 화면
- Main route: `/`
- Source of truth:
  - `docs/PRD.md`
  - `docs/ARCHITECTURE.md`
  - `docs/DEVELOPER_KICKOFF.md`
  - `docs/RISK_REGISTER.md`

## 역할 분담

- Codex: PM, 이슈 관리, 코드리뷰, 릴리즈 리스크 점검
- Claude: 구현, 커밋, PR 생성, 리뷰 반영
- Owner: 제품 의사결정, API/계정 설정, 최종 승인

## Git 작업 원칙

- 작업은 반드시 이슈 단위로 시작합니다.
- 브랜치명은 `issue-번호/짧은-설명` 형식을 사용합니다.
- 커밋 메시지는 작업 의도가 보이도록 작성합니다.
- PR 본문에는 관련 이슈, 변경 내용, 테스트 결과, 남은 TODO를 적습니다.
- `.env.local`, `.next`, `node_modules`, `*.tsbuildinfo`는 커밋하지 않습니다.
- 큰 문서 전체를 매번 읽지 말고, 필요한 문서와 변경 파일만 읽습니다.

## Claude에게 매번 전달할 최소 컨텍스트

```text
너는 SNS Commit의 시니어 개발자야.
이번 작업은 GitHub Issue #<번호> 기준으로 진행해줘.

먼저 읽을 파일:
- docs/CLAUDE_HANDOFF.md
- 해당 이슈 본문
- 작업에 직접 관련된 src 파일

원칙:
- 플랫폼 약관 우회 자동화처럼 보이는 구현/문구는 넣지 말 것.
- 변경 범위를 이슈에 맞게 작게 유지할 것.
- 작업 후 npm run lint, npm run build를 실행하고 결과를 보고할 것.
- PR/커밋 메시지에는 Closes #<번호>를 포함할 것.
```

## 첫 작업 요약

초기 화면 구현은 `Issue #1: 초기 프로젝트 세팅 및 메인 화면 구현`으로 소급 연결합니다.

완료된 주요 항목:

- Next.js 프로젝트 생성
- Tailwind CSS 설정
- shadcn/ui 기본 컴포넌트 추가
- SNS Commit 로고 적용
- `/` 메인 화면 구현
- `/dashboard`, `/auth/login`, `/auth/callback` 기본 라우트 생성

검증:

- `npm run build`: 통과
- `npm run lint`: 통과

## 다음 후보 작업

1. GitHub repo 연결 및 Issue #1 등록
2. PR 템플릿과 이슈 템플릿 추가
3. Supabase Auth 환경 구성
4. Instagram OAuth 기술 검증
5. KakaoStory 수동 게시 보조 플로우 설계
