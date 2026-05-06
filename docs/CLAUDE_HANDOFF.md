# Claude Handoff

이 문서는 Claude가 토큰과 컨텍스트를 아끼면서 개발을 이어가기 위한 작업 기준입니다.

## 현재 프로젝트 상태

- Product: CrossPosting
- Stack: Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui, Supabase 예정
- Current milestone: **초기 세팅 및 랜딩 화면 완료 — MVP 기능 미구현**
- Source of truth:
  - `docs/PRD.md`
  - `docs/ARCHITECTURE.md`
  - `docs/DEVELOPER_KICKOFF.md`
  - `docs/RISK_REGISTER.md`
  - `docs/DAY1_INITIAL_SETUP.md`

## 구현 현황 vs. MVP 요구사항

| 영역 | 현재 상태 | MVP 요구사항 |
|---|---|---|
| 랜딩 페이지 (`/`) | 완료 — Hero, Workflow, Trust 섹션 | 완료 |
| Auth 콜백 (`/auth/callback`) | 완료 — `exchangeCodeForSession` 처리 | 완료 |
| 세션 보호 프록시 (`src/proxy.ts`) | 완료 — `/dashboard` 보호, 세션 갱신 | 완료 |
| 로그인 페이지 (`/auth/login`) | **완료** — Google OAuth 버튼 구현 | Supabase Dashboard Google Provider 활성화 필요 |
| 대시보드 (`/dashboard`) | Placeholder (로그아웃 버튼 포함) | 소셜 계정·게시물·초안·발행 현황 UI 필요 |
| Supabase Auth — Google OAuth | **완료** (Issue #7) | Supabase Dashboard Google Provider 활성화 필요 |
| Supabase Auth — 이메일 로그인 | 미구현 (Issue #7 범위 밖) | 향후 별도 이슈로 구현 |
| DB 마이그레이션 / RLS | 미구현 | profiles, social_accounts, source_posts, post_drafts, publish_jobs, publish_logs |
| Instagram OAuth | 미구현 | 계정 연결, 장기 토큰 저장, 권한·만료 상태 관리 |
| Source Import | 미구현 | 최근 게시물 최대 20개 조회·저장, 중복 방지 |
| Composer | 미구현 | 초안 생성, 채널 선택, 본문·해시태그 편집, 제한 검사 |
| KakaoStory 수동 보조 | 미구현 | 본문 복사, 이미지 저장, 수동 게시 체크리스트 |
| Publish Jobs | 미구현 | Instagram 발행 요청, 상태 머신, 재시도, 실패 로그 |

## 다음 구현 순서

아래 순서는 PRD의 MVP 수용 기준을 충족하기 위한 최소 경로입니다.

### 1단계 — Supabase Auth ✅ 부분 완료 (Issue #7)

완료:
- `src/lib/supabase/` 클라이언트/서버 클라이언트 (SSR 지원)
- `src/proxy.ts` — 세션 갱신, `/dashboard` 보호
- `/auth/login` Google OAuth 버튼
- `/auth/callback` 코드 교환 → 세션 저장
- `/dashboard` 헤더 로그아웃 버튼 (`signOut` 서버 액션)

미완료 (다음 이슈에서 처리):
- `.env.local` `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 설정 (운영자 직접 입력)
- Supabase Dashboard Google Provider 활성화 (운영자 직접 설정)
- 이메일 로그인 폼 (React Hook Form + Zod) — Issue #7 범위 밖
- `auth.users` 가입 시 `profiles` 자동 생성 트리거 — 2단계 마이그레이션과 함께 처리

### 2단계 — DB 마이그레이션 및 RLS

- `supabase/migrations/` 경로에 마이그레이션 파일 작성
- `docs/DATABASE.md`의 테이블 스키마 적용
- 각 테이블 RLS 활성화 및 정책 작성
- Supabase CLI로 로컬·원격 동기화

### 3단계 — Instagram OAuth

- Meta Developer 앱 등록 및 `INSTAGRAM_APP_ID`, `INSTAGRAM_APP_SECRET` 설정
- `/api/auth/instagram` OAuth 시작 라우트
- `/api/auth/instagram/callback` 코드 교환 → 장기 토큰 저장
- `social_accounts` 테이블에 연결 상태 저장

### 4단계 — Source Import

- Instagram Graph API `/me/media` 호출
- 이미지·캡션·permalink·timestamp 저장 → `source_posts`, `media_assets`
- 중복 import 방지 (`provider_post_id` unique 제약 활용)
- 대시보드 게시물 목록 UI

### 5단계 — Composer

- 원본 게시물 선택 → 채널 선택 → 초안 생성 (`post_drafts`)
- 본문, 해시태그 분리 편집 (React Hook Form + Zod)
- 채널별 제한 검사 (글자 수, 이미지 비율 등)
- KakaoStory 초안: 본문 복사 버튼, 이미지 저장 링크

### 6단계 — KakaoStory 수동 보조

- 수동 게시 패키지 화면 (체크리스트 방식)
- 본문 클립보드 복사
- 이미지 묶음 다운로드 또는 개별 저장 링크
- 게시 완료 확인 체크리스트

### 7단계 — Publish Jobs

- Instagram 발행 요청 → `publish_jobs` 저장 → 워커 실행
- 상태 머신: draft → queued → publishing → published/failed
- 실패 로그 (`publish_logs`) 및 재시도 UI
- 대시보드 발행 현황 패널

## 역할 분담

- Codex: PM, 이슈 관리, 코드리뷰, 릴리즈 리스크 점검
- Claude: 구현, 커밋, PR 생성, 리뷰 반영
- Owner: 제품 의사결정, API/계정 설정, 최종 승인

## Git 작업 원칙

- `main`은 운영/릴리즈 브랜치로 취급합니다.
- `dev`는 통합 개발 브랜치로 취급합니다.
- 기능 작업은 반드시 GitHub Issue 단위로 시작합니다.
- 기능 브랜치는 항상 최신 `dev`에서 만듭니다.
- 브랜치명은 `feature/issue-번호-짧은-설명` 형식을 사용합니다.
- 커밋 메시지는 작업 의도가 보이도록 작성합니다.
- 기능 PR의 base branch는 `dev`입니다.
- PR 제목과 본문은 한글을 기본으로 작성합니다. 커밋 메시지는 Conventional Commit 형식을 유지해도 됩니다.
- PR 본문에는 관련 이슈, 변경 내용, 테스트 결과, 남은 TODO를 한글로 적습니다.
- PR이 승인되고 merge된 뒤에는 원격/로컬 기능 브랜치를 정리합니다.
- `.env.local`, `.next`, `node_modules`, `*.tsbuildinfo`는 커밋하지 않습니다.
- 큰 문서 전체를 매번 읽지 말고, 필요한 문서와 변경 파일만 읽습니다.

## Claude에게 매번 전달할 최소 컨텍스트

```text
너는 CrossPosting의 시니어 개발자야.
이번 작업은 GitHub Issue #<번호> 기준으로 진행해줘.

먼저 읽을 파일:
- docs/CLAUDE_HANDOFF.md
- 해당 이슈 본문
- 작업에 직접 관련된 src 파일

원칙:
- 플랫폼 약관 우회 자동화처럼 보이는 구현/문구는 넣지 말 것.
- KakaoStory는 "수동 게시 보조"로만 표현할 것.
- Instagram 자동 발행은 공식 Graph API 범위로만 구현할 것.
- main에 직접 커밋하지 말 것.
- 최신 dev에서 feature/issue-<번호>-<설명> 브랜치를 만들 것.
- 변경 범위를 이슈에 맞게 작게 유지할 것.
- 작업 후 npm run lint, npm run build를 실행하고 결과를 보고할 것.
- PR은 dev를 base branch로 만들고, 제목/본문은 한글로 작성할 것.
- PR 본문에 Closes #<번호>를 포함할 것.
```

## 완료된 작업 이력

### 초기 세팅 및 랜딩 화면 (Issue #1 소급 연결)

완료 항목:
- Next.js 프로젝트 생성
- Tailwind CSS 설정
- shadcn/ui 기본 컴포넌트 추가
- CrossPosting 로고 적용
- `/` 랜딩 화면 구현 (Hero, Workflow, Trust 섹션)
- `/dashboard`, `/auth/login`, `/auth/callback` 기본 라우트 생성

### placeholder 정비 및 구현 현황 문서화

완료 항목:
- `/auth/login` — 기능 예고 카드로 개선 (로그인 후 이용 가능 기능 안내)
- `/dashboard` — 기능 예고 카드로 개선 (계획된 4개 섹션 + 다음 구현 순서 표시)
- `docs/CLAUDE_HANDOFF.md` — 구현 현황 vs. MVP 요구사항 갭 분석 및 7단계 구현 순서 추가
- `README.md` — 구현 현황 섹션 추가
