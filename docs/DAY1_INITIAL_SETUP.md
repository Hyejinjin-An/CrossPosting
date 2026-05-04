# Day 1 Initial Setup

## 프로젝트 정체성

- 제품명: CrossPosting
- 목적: Instagram/KakaoStory 게시물의 사진과 문구를 다른 SNS 채널에 재사용하는 크로스포스팅 워크스페이스
- 핵심 원칙: 플랫폼 약관을 우회하지 않고, 공식 API 가능 범위와 수동 게시 보조 플로우를 명확히 구분한다.
- MVP 채널 판단:
  - Instagram: 공식 API 기반 가져오기/발행 플로우
  - KakaoStory: 수동 게시 보조 플로우

## 기술 기준

- Framework: Next.js App Router
- Runtime baseline: Next.js 16.2.4, React 19.2.4
- Language/UI: TypeScript, Tailwind CSS, shadcn/ui
- Backend 예정: Supabase Auth, Postgres, Storage
- 검증 명령:
  - `npm run lint`
  - `npm run build`

## 브랜치 전략

- `main`: 운영/릴리즈 브랜치
- `dev`: 개발 통합 브랜치
- `feature/issue-번호-설명`: 기능 브랜치
- 기능 PR base는 항상 `dev`
- `dev -> main` PR은 배포 직전에만 생성
- merge 완료 후 feature/review 브랜치는 삭제

## 협업 역할

- Owner: 제품 의사결정, API/계정 설정, 최종 승인
- Codex: PM, 이슈 작성, 코드리뷰, 릴리즈 리스크 점검, 브랜치 정리
- Claude: 구현, 커밋, PR 생성, 리뷰 반영

## GitHub 운영 규칙

- 이슈/PR/리뷰 문서는 한글을 기본으로 작성한다.
- 커밋 메시지는 Conventional Commit 형식을 유지해도 된다.
- PR 본문에는 `Closes #번호`, 변경 내용, 검증 결과, 남은 TODO를 포함한다.
- Claude에게는 매 작업 전 `docs/CLAUDE_HANDOFF.md`와 해당 이슈 본문만 우선 읽도록 지시한다.

## 완료된 주요 작업

### 초기 문서/설계

- README, PRD, Architecture, Database, Risk Register, Roadmap 작성
- 긴 제품 설명을 `docs/PRODUCT_OVERVIEW.md`로 분리
- README는 개요, 실행 방법, 환경 변수, 브랜치 전략, 문서 링크 중심으로 축소

### 브랜드/프로젝트명

- 기존 `SNS Commit`에서 `CrossPosting`으로 제품명 변경
- package name은 `crossposting`
- repo: `Hyejinjin-An/CrossPosting`
- 로컬 정식 폴더: `C:\Users\USER\CrossPosting`

### 초기 앱

- Next.js 프로젝트 생성
- 메인 화면 구현
- 로고 SVG 3종 추가
- dead CTA link 수정
- 기본 다크모드 적용

### Supabase 기반

- `src/lib/supabase/client.ts`: browser client
- `src/lib/supabase/server.ts`: server client
- `src/lib/supabase/admin.ts`: service role 기반 admin helper
- `src/app/auth/callback/route.ts`: `exchangeCodeForSession` 기반 callback 처리
- 주의: `SUPABASE_SERVICE_ROLE_KEY`는 서버 전용이며 client 코드에 노출하지 않는다.

### GitHub/CLI

- GitHub CLI 설치 및 인증 완료
- gh token scopes: `repo`, `workflow`, `read:org`, `gist`
- GitHub App 권한 대신 gh CLI로 이슈/PR/리뷰 운영 가능
- 이슈/PR 템플릿 한글화 완료

### Ignore 규칙

- `.gitignore`에 Claude/Codex/IDE/cache/test output/env/log 관련 로컬 파일 추가

## 완료된 PR/이슈

- PR #1: README 축소 및 문서 분리
- PR #3 / Issue #2: Supabase 클라이언트와 환경 설정 기반 구성
- PR #5 / Issue #4: 다크모드를 기본 테마로 설정

닫힌 이슈:

- #2 Supabase 클라이언트와 환경 설정 기반 구성
- #4 다크모드를 기본 테마로 설정

현재 열린 이슈:

- 없음

## 현재 브랜치 상태 기준

- 최신 작업 브랜치: `dev`
- `dev`는 `origin/dev`와 동기화됨
- 작업 트리 clean 상태를 유지하는 것이 원칙
- merge 완료된 feature/review 브랜치는 정리 완료

## 다음 후보 작업

1. Supabase middleware 추가로 세션 갱신 흐름 완성
2. Supabase 초기 migration 작성: `profiles` 테이블 + RLS
3. 로그인 화면과 실제 Supabase Auth 연결
4. Instagram OAuth 기술 검증
5. KakaoStory 수동 게시 보조 플로우 설계
6. 메인 화면 컴포넌트 리팩터링 PR 검토

## Claude에게 기본 전달문

```text
너는 CrossPosting의 시니어 개발자야.
이번 작업은 GitHub Issue #<번호> 기준으로 진행해줘.

작업 전:
1. git switch dev
2. git pull origin dev
3. git status
4. git switch -c feature/issue-<번호>-<짧은-설명>

원칙:
- main에 직접 커밋하지 말 것.
- PR base는 dev로 설정할 것.
- PR 제목과 본문은 한글로 작성할 것.
- 플랫폼 약관 우회 자동화처럼 보이는 구현/문구는 넣지 말 것.
- 변경 범위는 이슈 수용 기준 안으로 제한할 것.

완료 전:
- npm run lint
- npm run build

완료 후:
- git add .
- git commit -m "<type>: <작업 요약>"
- git push -u origin feature/issue-<번호>-<짧은-설명>
- PR 생성 후 Codex에게 코드리뷰 요청
```
