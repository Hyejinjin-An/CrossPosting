# Claude Handoff

이 문서는 Claude가 토큰과 컨텍스트를 아끼면서 개발을 이어가기 위한 작업 기준입니다.

## 현재 프로젝트 상태

- Product: CrossPosting
- Stack: Next.js 16.2.4 (Turbopack), React 19, TypeScript, Tailwind CSS v4, Supabase, radix-ui
- Current milestone: **법적 요건 페이지 완료 — Instagram OAuth Owner 준비 단계**
- PR #18 (`feature/ui-theme-signup-fields`) ✅ dev merge 완료
- PR #21 (`feature/issue-21-dashboard-layout`) OPEN → dev에 merge 필요

## 구현 현황

| 영역 | 상태 | 비고 |
|---|---|---|
| 랜딩 페이지 (`/`) | ✅ 완료 | Hero, Workflow, Trust 섹션 |
| Auth 콜백 (`/auth/callback`) | ✅ 완료 | exchangeCodeForSession 처리 |
| 세션 보호 프록시 (`src/proxy.ts`) | ✅ 완료 | `/dashboard` 보호, 세션 갱신 |
| Google OAuth 로그인 | ✅ 완료 | Supabase Dashboard Google Provider 활성화 필요 |
| 이메일 회원가입/로그인 | ✅ 완료 | react-hook-form + zod, 서버 방어 코드 포함 |
| 이름/성별/전화번호 수집 | ✅ 완료 | 가입 시 profiles 테이블 upsert |
| DB 스키마 / RLS (Issue #9) | ✅ 완료 | profiles, social_accounts, source_posts, post_drafts, publish_jobs 등 |
| 대시보드 UI | ✅ 완료 | 환영 배너, 통계 카드, hover 효과, placeholder |
| 주황 테마 + 다크모드 토글 | ✅ 완료 | Tailwind v4 @theme inline, next-themes |
| 개인정보처리방침 (`/privacy`) | ✅ 완료 | Issue #27 — 정적 Server Component |
| 서비스 이용약관 (`/terms`) | ✅ 완료 | Issue #27 — 정적 Server Component |
| 대시보드 사이드바 법적 링크 | ✅ 완료 | Issue #27 — 사이드바 하단 링크 추가 |
| Instagram OAuth (Issue #11) | ❌ 미구현 | Meta Developer 앱 설정 Owner 선행 필요. /privacy·/terms URL 제공 가능 상태 |
| Source Import (Issue #12) | ❌ 미구현 | #11 완료 후 |
| Composer (Issue #13) | ❌ 미구현 | #12 완료 후 |
| KakaoStory 수동 보조 (Issue #14) | ❌ 미구현 | #13 완료 후 |
| Publish Jobs — Instagram 자동 발행 (Issue #15) | ❌ 미구현 | #13 완료 후 |
| 직접 작성 → 동시 발행 (Issue #19) | ❌ 미구현 | #14, #15 완료 후 |
| KakaoStory → Instagram 크로스포스팅 (Issue #20) | ❌ 미구현 | #15 완료 후, Kakao 앱 설정 Owner 선행 필요 |

## 이슈 의존성 체인

```
[완료] Auth (이메일+Google) + DB 스키마
         │
         ▼
Issue #11 — Instagram OAuth (계정 연결, 장기 토큰)
         │
         ▼
Issue #12 — Source Import (Instagram 게시물 가져오기)
         │
         ▼
Issue #13 — Composer (채널별 초안 생성/편집)
         │
    ┌────┼────────┐
    ▼    ▼        ▼
   #14  #15      #20
KakaoStory  Publish Jobs  Kakao 계정 연결
수동 보조   자동 발행      KakaoStory→Instagram
                │
                ▼
               #19
         직접 작성 → 동시 발행
```

## 다음 구현 순서 (Issue별 상세)

### Issue #11 — Instagram OAuth

**Owner 선행 작업 필요:**
- Meta Developer Console에서 앱 생성
- `instagram_basic`, `instagram_content_publish` 권한 추가
- App ID / Secret 발급 → `.env.local`에 추가:
  ```
  INSTAGRAM_APP_ID=...
  INSTAGRAM_APP_SECRET=...
  ```
- Redirect URI 등록: `http://localhost:3000/api/auth/instagram/callback`

**구현 내용:**
1. `/api/auth/instagram` — OAuth 시작 엔드포인트
2. `/api/auth/instagram/callback` — 단기 토큰 → 장기 토큰 교환 → `social_accounts` 저장
3. 대시보드 연결 상태 표시 + 연결 해제 버튼

**브랜치**: `feature/issue-11-instagram-oauth`

---

### Issue #12 — Source Import

**구현 내용:**
1. Instagram Graph API `/me/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp`
2. `source_posts`에 upsert (instagram_post_id 기준 중복 방지)
3. `media_assets`에 미디어 URL 저장
4. 대시보드 게시물 목록 (썸네일+캡션)
5. 토큰 만료 감지 → 재연결 안내

**브랜치**: `feature/issue-12-source-import`

---

### Issue #13 — Composer

**구현 내용:**
1. 원본 게시물 목록 → 선택
2. 채널 선택 (Instagram / KakaoStory / 동시)
3. `post_draft_sets` → 채널별 `post_drafts` 생성
4. 본문/해시태그 분리 편집기
5. Instagram 2,200자 초과 시 경고
6. KakaoStory 초안에 "본문 복사" 버튼

**브랜치**: `feature/issue-13-composer`

---

### Issue #14 — KakaoStory 수동 보조

**구현 내용:**
1. `/dashboard/manual/:taskId` 페이지
2. 본문 복사 버튼 (Clipboard API)
3. 이미지 저장 링크
4. 체크리스트 완료 시 `manual_publish_tasks` 상태 업데이트

**브랜치**: `feature/issue-14-kakaostory-manual`

---

### Issue #15 — Publish Jobs (Instagram 자동 발행)

**구현 내용:**
1. "발행" 버튼 → `publish_jobs` row 생성 (상태: `queued`)
2. Instagram Graph API 발행 요청
3. 상태 머신: `queued → publishing → published / failed`
4. 실패 시 `publish_logs` 기록
5. 대시보드 발행 현황 표시

**브랜치**: `feature/issue-15-publish-jobs`

---

### Issue #19 — 직접 작성 → Instagram + KakaoStory 동시 발행 (신규)

**구현 내용:**
1. `/dashboard/create` 작성 폼 (텍스트 + 이미지 업로드)
2. 이미지 → Supabase Storage → `media_assets` 저장
3. `post_draft_sets` / `post_drafts` 생성 (Composer와 동일 모델)
4. 채널 선택 → Instagram `publish_jobs` + KakaoStory `manual_publish_tasks` 동시 생성

**브랜치**: `feature/issue-19-create-post`

---

### Issue #20 — Kakao 계정 연결 및 KakaoStory → Instagram 크로스포스팅 (신규)

> **⚠️ 구현 불가 확정 (2026-06-11)**: KakaoStory 공식 API가 2023-11-15에 종료되어
> `story_read_timeline` 권한과 `/v1/api/story/mystories` 호출이 모두 불가능하다.
> 아래 계획은 폐기 대상이며 이슈 재정의가 필요하다 (SERVICE_CHECKLIST §8 참조).

**Owner 선행 작업 필요:**
- Kakao Developers에서 앱 등록
- `story_read_timeline` 권한 신청 (비즈니스 앱 심사 필요)
- `.env.local`에 추가:
  ```
  KAKAO_APP_KEY=...
  KAKAO_APP_SECRET=...
  ```
- Redirect URI 등록: `http://localhost:3000/api/auth/kakao/callback`

**구현 내용:**
1. `/api/auth/kakao` + `/api/auth/kakao/callback` — Kakao OAuth
2. `social_accounts`에 kakao 플랫폼 토큰 저장
3. Kakao API `/v1/api/story/mystories`로 게시물 가져오기 → `source_posts`
4. Composer에서 KakaoStory 원본 선택 가능하도록 확장
5. Instagram 발행은 기존 Publish Jobs (#15) 재사용

**브랜치**: `feature/issue-20-kakao-crosspost`

---

## 개발 하네스 스킬 (2026-06-11 도입)

`.claude/skills/crossposting-dev/SKILL.md` — 모든 `src/` 구현·리뷰 작업에 적용되는 품질 하네스.

- 우선순위 프레임워크: 보안 → 콘텐츠 충실도 → 서버 부하 → 클라이언트 부하 → UX/UI 일관성(다크/라이트) → 자동화 친화성
- 플랫폼 제약 정본: `.claude/skills/crossposting-dev/references/platform-constraints.md` (출처 URL·확인일 포함)
- 조사로 확정된 사실 (2026-06-11):
  - **KakaoStory 공식 API 2023-11-15 종료** → 자동 발행 영구 불가, 수동 보조가 최종 정책 (SERVICE_CHECKLIST §8-1 "신규 심사 가능 여부"는 사실상 "불가" 확정)
  - **Instagram API 발행 quota는 계정당 24h 100건** (과거 자료의 25건은 구버전), 캐러셀 최대 10장 → 20장 게시물은 2개 분할 + 사용자 선택 UI 필요
  - **Naver Band 공식 Open API 존재** (글쓰기 지원) — 사진 첨부 범위·quota는 구현 착수 전 확인 필요

## 주요 해결된 이슈 & 참고 사항

**Supabase 이메일 차단**: 로컬파트에 "test" 포함 이메일 차단됨 (`email_address_invalid`). 개발 시 "Enable email confirmations" 비활성화 권장. → `docs/solutions/supabase-email-signup-blocked.md`

**이메일 Rate Limit**: Supabase 무료 플랜 시간당 2건 제한. "Enable email confirmations" 끄면 해결. → 같은 문서

**profiles 동기화**: DB 쓰기 에러는 반드시 `const { error } = await ...`로 체크. `update` 대신 `upsert(onConflict: 'id')` 사용. 중복 이메일 감지 시 `identities?.length === 0` 체크 필요. → `docs/solutions/supabase-signup-profile-sync.md`

**Tailwind v4 주의**: `@theme inline` 블록 없으면 `bg-primary` 등 유틸리티 클래스 미적용. `globals.css`에 필수.

**배포 전 체크리스트**: `docs/DEPLOY_CHECKLIST.md` 반드시 확인.

## 역할 분담

- Codex: PM, 이슈 관리, 코드리뷰, 릴리즈 리스크 점검
- Claude: 구현, 커밋, PR 생성, 리뷰 반영
- Owner: 제품 의사결정, API/계정 설정(Instagram/Kakao 앱), 최종 승인

## Git 작업 원칙

- `main`: 운영/릴리즈 브랜치
- `dev`: 통합 개발 브랜치 (PR base)
- 기능 브랜치: `feature/issue-<번호>-<짧은-설명>` (항상 최신 dev에서 생성)
- PR base는 `dev`, 제목/본문은 한글, `Closes #<번호>` 포함
- 작업 후 `npm run lint`, `npm run build` 필수
- `.env.local`, `.next`, `node_modules` 커밋 금지
- 작업 전 `docs/solutions/` 관련 학습 확인

## 다음 세션 시작 방법

```
너는 CrossPosting의 시니어 개발자야.
이번 작업은 GitHub Issue #<번호> 기준으로 진행해줘.

먼저 읽을 파일:
- docs/CLAUDE_HANDOFF.md
- docs/solutions/ (관련 항목)
- 해당 이슈 본문 (gh issue view <번호>)
- 작업에 직접 관련된 src 파일

원칙:
- 플랫폼 약관 우회 자동화처럼 보이는 구현/문구 금지
- KakaoStory는 "수동 게시 보조"로만 표현
- Instagram 자동 발행은 공식 Graph API 범위로만 구현
- main에 직접 커밋 금지
- PR #18 merge 먼저 확인 후 최신 dev에서 브랜치 생성
```
