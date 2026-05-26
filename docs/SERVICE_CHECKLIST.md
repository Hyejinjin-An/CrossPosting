# CrossPosting 서비스 완성 체크리스트

> **Claude 작업 규칙**
> 1. 작업 시작 전 이 파일을 읽는다
> 2. 완료된 항목은 `[ ]` → `[x]` 로 변경한다
> 3. 작업 종료 시 [일일 달성 로그](#-일일-달성-로그) 테이블에 날짜·완료 수·달성률을 기록한다
> 4. 재발 방지 규칙을 위반한 구현이 발견되면 즉시 수정한다

---

## 달성률 계산

```
완료 항목([x]) ÷ 전체 항목 수 × 100 = 달성률
```

전체 항목 수는 파일 내 `- [ ]` 와 `- [x]` 를 모두 합산한다.

---

## 📅 일일 달성 로그

| 날짜 | 완료 | 전체 | 달성률 | 주요 작업 |
|---|:---:|:---:|:---:|---|
| 2026-05-22 | 54 | 210 | 26% | 초기 현황 기록 |
| 2026-05-26 | 57 | 210 | 27% | Issue #27 — /privacy·/terms 정적 페이지 + 사이드바 링크 |

---

## 🚨 재발 방지 규칙 — 작업 전 반드시 확인

> 과거에 실수하거나 반복적으로 잘못 구현된 패턴. 위반 시 즉시 롤백한다.

| # | 규칙 | 이유 | 위반 시 증상 |
|---|---|---|---|
| **R-01** | Python 절대 사용 금지. JSON/텍스트 파싱은 PowerShell·Node·Grep으로만 | 환경 불일치 | 스크립트 실행 오류 |
| **R-02** | 모든 함수·컴포넌트에 JSDoc 주석 필수 (선언 타입 + 한 줄 요약) | 코드 가독성·리뷰 기준 | 리뷰 반려, 일관성 붕괴 |
| **R-03** | Server Action에서 **RLS 소유권 + 비즈니스 규칙 둘 다** 서버에서 검증. 클라이언트 disabled 버튼은 대체 불가 | 클라이언트 우회 방지 | 권한 없는 데이터 조작 |
| **R-04** | DB write 후 `const { error } = await ...` 로 에러 반드시 체크. 무시 금지 | 실패 묵인 방지 | 데이터 불일치, 무결성 파괴 |
| **R-05** | `profiles` 업데이트는 `upsert({ onConflict: 'id' })` 사용. `update` 사용 금지 | Auth 트리거 실패 방어 | gender·phone null 유지 |
| **R-06** | 회원가입 후 `data.user.identities?.length === 0` 으로 중복 이메일 감지 | Supabase 특이 동작 | 중복 계정 생성, 무응답 실패 |
| **R-07** | "test" 포함 이메일은 Supabase 서비스 레벨에서 차단됨 (`email_address_invalid`) | 서비스 정책 | 가입 불가·원인 불명 |
| **R-08** | 코드 작성 전: ① 이슈 확인 → ② 브랜치 생성 (`feature/issue-<N>-<설명>`) → ③ 로컬 환경 확인 순서 필수 | 작업 격리 | 브랜치 혼재, 충돌 |
| **R-09** | 작업 종료 후 `docs/CLAUDE_HANDOFF.md` 업데이트 필수 | 세션 간 컨텍스트 유지 | 다음 세션에서 컨텍스트 손실 |
| **R-10** | Tailwind v4는 `globals.css`에 `@theme inline` 블록 필수 | v4 특이 사항 | `bg-primary` 등 커스텀 클래스 미적용 |
| **R-11** | Storage 이미지 접근은 반드시 Signed URL 사용. 공개 URL 사용 금지 | 타 유저 미디어 노출 | 개인 미디어 유출 |
| **R-12** | `SUPABASE_SERVICE_ROLE_KEY`는 서버 환경 변수에만. 클라이언트 번들에 절대 포함 금지 | 보안 치명적 | 전체 DB 접근 권한 탈취 가능 |
| **R-13** | SNS 토큰(`access_token`)은 API 로그·클라이언트 응답에 절대 노출 금지 | 토큰 탈취 방지 | 계정 도용 |
| **R-14** | Instagram API 호출 전 토큰 만료 여부(`expires_at`) 먼저 확인. 만료 시 재연결 안내 | UX + 오류 방지 | 500 에러 노출 |
| **R-15** | 작업 전 `docs/solutions/` 관련 항목 검색 후 읽기. 같은 문제 반복 조사 금지 | Compound Engineering | 해결된 문제 재발 |

---

## 1. 인프라 & 배포

### 1-1. 기반 설정
- [x] Git 레포지터리 초기화 (main / dev 브랜치 구조)
- [x] Supabase 프로젝트 생성 및 연결
- [x] 로컬 `.env.local` 환경 변수 설정
- [ ] Vercel 프로젝트 생성 및 GitHub 레포 연결
- [ ] Vercel 환경 변수 등록 (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)
- [ ] 커스텀 도메인 구매 및 Vercel DNS 연결
- [ ] HTTPS 자동 적용 확인 (Vercel 기본 제공)
- [ ] `main` 브랜치 보호 규칙 — PR 없이 직접 push 금지

### 1-2. CI/CD
- [ ] PR 생성 시 `npm run lint` + `npm run build` 자동 실행 (Vercel CI 또는 GitHub Actions)
- [ ] 빌드 실패 시 merge 차단 설정
- [ ] Preview 배포 자동 생성 확인 (PR → preview URL)

---

## 2. 인증 & 세션

- [x] 이메일 회원가입 — Zod 검증 + 서버 방어 코드
- [x] 이메일 로그인
- [x] Google OAuth 로그인
- [x] OAuth 콜백 라우트 (`/auth/callback`)
- [x] 세션 미들웨어 (`src/proxy.ts`) — `/dashboard` 자동 보호
- [x] `exchangeCodeForSession` PKCE 처리
- [ ] **프로덕션 배포 전**: Supabase Dashboard → Authentication → Email → `Confirm email` 활성화
- [ ] **프로덕션 배포 전**: Resend(또는 SendGrid) SMTP 연결 — 무료 플랜 시간당 2건 제한 해제
- [ ] Google OAuth Redirect URI 프로덕션 도메인으로 교체 (Google Cloud Console)
- [ ] 비밀번호 재설정 이메일 플로우 구현 (`/auth/reset-password`)
- [ ] 회원 탈퇴 기능 — 계정 삭제 + 관련 데이터(Storage 포함) 삭제

---

## 3. 데이터베이스 & 스키마

### 3-1. 테이블 & RLS (전체 완료)
- [x] `profiles` + RLS (display_name, gender, phone)
- [x] `social_accounts` + RLS (provider, access_token, expires_at)
- [x] `source_posts` + RLS (원본 게시물)
- [x] `media_assets` + RLS (Storage 경로, MIME, 체크섬)
- [x] `post_draft_sets` + RLS (채널 그룹)
- [x] `post_drafts` + RLS (채널별 초안)
- [x] `post_draft_media` + RLS (초안-미디어 연결)
- [x] `publish_jobs` + RLS (Instagram 자동 발행 큐)
- [x] `manual_publish_tasks` + RLS (KakaoStory 수동 게시)
- [x] `publish_logs` + RLS (발행 실패 이력)

### 3-2. Storage
- [x] `post-media` 버킷 — private 설정
- [x] 사용자 폴더별 접근 제어 RLS 정책

### 3-3. 타입 & 마이그레이션 관리
- [x] Supabase TypeScript 타입 생성 (`src/types/database.types.ts`)
- [ ] 스키마 변경 시마다 `npm run types` 실행하여 타입 재생성
- [ ] 마이그레이션 파일 타임스탬프 순서 보장 확인
- [ ] 프로덕션 배포 후 DB 백업 주기 확인 (Supabase 무료: 7일 / Pro: 30일)

---

## 4. 보안 방어체계

### 4-1. 데이터 접근 제어
- [x] 모든 테이블 RLS 활성화
- [x] 모든 Server Action 쿼리에 `user_id` 소유권 필터
- [x] FK 참조 INSERT/UPDATE 소유권 검증 (마이그레이션 2에서 강화)
- [x] `SUPABASE_SERVICE_ROLE_KEY` 서버 전용 격리
- [x] Storage 파일 접근 — Signed URL 사용 (1시간 유효)
- [ ] Supabase anon 키로 다른 유저 데이터 직접 쿼리 시 차단되는지 실제 검증

### 4-2. 입력 검증
- [x] Zod 스키마 — 폼 클라이언트 검증
- [x] Server Action — 서버 측 재검증
- [x] Server Action — 비즈니스 규칙 검증 (채널 타입, 상태 등)
- [ ] 파일 업로드 MIME 타입 서버 측 검증 (`image/*` 외 거부)
- [ ] 파일 업로드 최대 크기 서버 측 검증 (현재 클라이언트만 제한)
- [ ] 이미지 다운로드 URL 검증 — SSRF 방지 (허용 도메인 화이트리스트)

### 4-3. SNS 토큰 보안
- [ ] `social_accounts.access_token` 저장 시 암호화 검토 (AES-256 또는 Supabase Vault)
- [ ] Instagram Long-lived Token 만료 D-7 전 자동 갱신 로직
- [ ] 토큰 갱신 실패 시 사용자 알림 + 재연결 유도 UI
- [ ] API 응답 로그에 토큰·개인정보 포함 금지

### 4-4. 인프라 보안
- [ ] `.env.local` `.gitignore` 포함 확인 — 커밋 절대 금지
- [ ] Vercel 환경 변수 Production / Preview / Development 범위 분리
- [ ] Instagram API 호출 Rate Limit 클라이언트 측 사전 체크 (일 200회)
- [ ] 발행 요청 서버 측 Rate Limit (동일 유저 단기 과도 요청 차단)

---

## 5. 핵심 기능 — 완료

### 5-1. 마케팅 & 랜딩
- [x] 랜딩 페이지 (`/`) — Hero, Workflow, Trust 섹션
- [x] 주황 브랜드 테마 + 다크/라이트 모드 토글
- [x] 반응형 레이아웃 (모바일 대응)

### 5-2. 대시보드 기반 UI
- [x] 대시보드 홈 (`/dashboard`) — 통계 카드 실 DB 조회 (연결 계정·초안·발행 수)
- [x] 사이드바 네비게이션
- [x] 사이드바 로그아웃 버튼

### 5-3. 프로필 설정
- [x] 프로필 설정 페이지 (`/dashboard/settings`)
- [x] display_name, gender, phone 수정
- [x] `upsert` 패턴 적용 (profiles 동기화 안전)

### 5-4. 게시물 직접 작성
- [x] 작성 폼 (`/dashboard/create`) — 텍스트 + 이미지 업로드
- [x] 이미지 → Supabase Storage 저장 (`{userId}/{timestamp}-{order}`)
- [x] `media_assets` 메타데이터 추적
- [x] `source_posts` + `post_draft_sets` + `post_drafts` 동시 생성

### 5-5. Composer — 초안 관리
- [x] 초안 목록 (`/dashboard/composer`) — 썸네일·채널 표시
- [x] 채널별 초안 편집 (`/dashboard/composer/[draftSetId]`)
- [x] Instagram 2,200자 제한 실시간 검증
- [x] 해시태그 분리 파싱
- [x] 초안 저장 Server Action

### 5-6. KakaoStory 수동 게시 보조
- [x] 수동 게시 시작 — `startManualPublish` Server Action
- [x] 채널 타입 서버 검증 (kakaostory만 허용)
- [x] 수동 게시 보조 페이지 (`/dashboard/manual/[taskId]`)
- [x] 본문 클립보드 복사 (Clipboard API)
- [x] 이미지 다운로드 링크
- [x] 단계별 체크리스트 상태 추적

---

## 6. 핵심 기능 — 미구현

### 6-1. 소셜 계정 관리 페이지
- [ ] 연결된 계정 목록 (`/dashboard/accounts`)
- [ ] Instagram 계정 연결 버튼 (Issue #11 완료 후)
- [ ] 계정 연결 해제 버튼
- [ ] 토큰 만료 상태 표시 + 재연결 유도 배너

### 6-2. 발행 이력
- [ ] 발행 이력 목록 페이지 (`/dashboard/history`)
- [ ] 발행 상태별 필터 (published / failed / cancelled)
- [ ] 실패 사유 상세 조회 (`publish_logs` 연계)
- [ ] 실패 발행 재시도 UI

### 6-3. 온보딩
- [ ] 첫 로그인 시 온보딩 플로우 — 소셜 계정 연결 유도
- [ ] `profiles.onboarding_status` 필드 활용
- [ ] 온보딩 완료 후 대시보드 리다이렉트

### 6-4. 알림
- [ ] 발행 성공/실패 이메일 알림 (Resend 연계)
- [ ] 토큰 만료 D-7 경고 이메일

### 6-5. 로드맵 Later 기능
- [ ] Instagram 예약 발행 (발행 시간 설정)
- [ ] 게시물 템플릿 저장·재사용
- [ ] AI 캡션 리라이트 (Claude API 연동)
- [ ] 팀 계정 + 승인 플로우
- [ ] 성과 분석 (조회수, 도달율)
- [ ] 추가 채널 연동 (LINE Band, 네이버 블로그 등)

---

## 7. Instagram Graph API 연동

> **전제**: Owner의 Meta Developer App 생성 + 앱 심사 완료 선행 필요

### 7-1. Owner 준비 항목 (코드 작성 전 완료 필요)
- [ ] Meta Business Suite 계정 생성/확인 (business.facebook.com)
- [ ] Instagram Professional 계정 (비즈니스 or 크리에이터) 확인
- [ ] Instagram ↔ Facebook 페이지 연결 확인
- [ ] Meta Developer App 생성 (developers.facebook.com, 유형: Business)
- [ ] Instagram Graph API 제품 추가
- [ ] OAuth Redirect URI 등록: `https://{배포 도메인}/api/auth/instagram/callback`
- [ ] 앱 권한 신청: `instagram_basic`, `instagram_content_publish`, `pages_read_engagement`
- [ ] 앱 심사(App Review) 제출 — 개인정보처리방침 URL 필수
- [ ] 테스터 계정 등록 (심사 전 개발·테스트용)
- [ ] `INSTAGRAM_APP_ID` / `INSTAGRAM_APP_SECRET` 발급 → Claude에게 전달

### 7-2. Issue #11 — Instagram OAuth (계정 연결)
- [ ] OAuth 인증 URL 생성 Route Handler (`/api/auth/instagram`)
- [ ] 콜백 처리 (`/api/auth/instagram/callback`)
- [ ] Short-lived Token → Long-lived Token 교환 (60일 유효)
- [ ] `social_accounts` 테이블에 토큰·만료일 저장
- [ ] 계정 정보 조회 (username, profile_picture_url) 및 UI 표시
- [ ] 연결 완료 후 계정 관리 페이지 리다이렉트

### 7-3. Issue #12 — Source Post Import
- [ ] Instagram Graph API `/me/media` 호출 (caption, media_type, media_url, timestamp)
- [ ] 페이지네이션 처리 (`after` cursor)
- [ ] 미디어 URL → Supabase Storage 다운로드 저장
- [ ] `source_posts` + `media_assets` 저장
- [ ] `instagram_media_id` unique 체크 — 중복 import 방지
- [ ] 이미 import된 게시물 표시 + 건너뛰기 처리
- [ ] Import 진행률 UI 피드백

### 7-4. Issue #15 — Publish Jobs (Instagram 자동 발행)
- [ ] `publish_jobs` 상태 머신: `queued → publishing → published / failed`
- [ ] 이미지 컨테이너 생성 (`POST /me/media`)
- [ ] 컨테이너 발행 (`POST /me/media_publish`)
- [ ] 발행 상태 polling 또는 Webhook 처리
- [ ] 실패 시 `publish_logs` 저장 — 에러 코드 분류 (`TOKEN_EXPIRED`, `RATE_LIMITED`, `MEDIA_INVALID` 등)
- [ ] 발행 성공 시 `post_drafts.status` 업데이트
- [ ] 실패 발행 재시도 UI (지수 백오프 포함)
- [ ] 발행 취소 기능

### 7-5. 토큰 관리 (장기 운영)
- [ ] Long-lived Token 만료 D-7 전 자동 갱신 (`GET /oauth/access_token?grant_type=ig_refresh_token`)
- [ ] 갱신 실패 시 사용자에게 알림 + 재연결 유도
- [ ] `social_accounts.expires_at` 기반 만료 모니터링 Cron (Vercel Cron 또는 Supabase pg_cron)

---

## 8. KakaoStory 연동

> KakaoStory API 신규 심사 가능 여부를 먼저 확인할 것 (2023년 이후 변경됨)

### 8-1. Owner 준비 항목 (Issue #20, 선택)
- [ ] KakaoStory API 신규 앱 심사 가능 여부 공식 확인
- [ ] Kakao Developers 앱 생성 (developers.kakao.com)
- [ ] 비즈 앱 전환 신청 (사업자 정보 필요)
- [ ] `story.post.write` 권한 심사 제출 — 개인정보처리방침 URL 필수
- [ ] Redirect URI 등록: `https://{배포 도메인}/api/auth/kakao/callback`
- [ ] `KAKAO_REST_API_KEY` / `KAKAO_CLIENT_SECRET` 발급 → Claude에게 전달

### 8-2. Issue #20 — Kakao OAuth + KakaoStory 자동 발행 구현
- [ ] Kakao OAuth 인증 URL 생성 (`/api/auth/kakao`)
- [ ] 콜백 처리 + `social_accounts` 토큰 저장
- [ ] KakaoStory 게시물 작성 API 호출 (`/v1/api/story/post/photo`)
- [ ] 수동 보조 → 자동 발행으로 분기 처리

---

## 9. 외부 서비스 연동

### 9-1. Resend — 이메일 발송
- [ ] Resend 계정 생성 (resend.com)
- [ ] 도메인 DNS 인증 (SPF, DKIM 설정)
- [ ] API 키 발급
- [ ] Supabase → Project Settings → Auth → SMTP Settings 입력
- [ ] 이메일 확인 템플릿 커스터마이징 (서비스 브랜딩)
- [ ] 비밀번호 재설정 템플릿 커스터마이징
- [ ] 실제 테스트: 회원가입 → 이메일 수신 → 인증 링크 클릭 확인

### 9-2. Sentry — 에러 모니터링
- [ ] Sentry 프로젝트 생성 (sentry.io)
- [ ] `@sentry/nextjs` 패키지 설치
- [ ] `SENTRY_DSN` 환경 변수 Vercel에 등록
- [ ] `sentry.client.config.ts` / `sentry.server.config.ts` 초기화
- [ ] 에러 발생 시 Slack 또는 이메일 알림 설정
- [ ] Source Map 업로드 설정 (난독화된 스택 트레이스 복원)

### 9-3. Vercel — 배포
- [ ] Vercel 계정 생성
- [ ] GitHub 레포 연결
- [ ] Production 브랜치 `main` 설정
- [ ] Preview 브랜치 `dev` 설정
- [ ] 환경 변수 전체 등록 (Production / Preview 분리)
- [ ] 커스텀 도메인 연결 + HTTPS 확인

---

## 10. 성능 & 최적화

- [ ] 이미지 렌더링 — `next/image` 컴포넌트 사용 확인 (자동 WebP 변환·최적화)
- [ ] Storage Signed URL 캐시 전략 검토 (현재 1시간 — 빈번한 재생성 방지)
- [ ] 대시보드 통계 쿼리 N+1 문제 없는지 확인 (단일 쿼리로 집계)
- [ ] Composer 초안 목록 — 게시물 많아질 경우 페이지네이션 또는 무한스크롤
- [ ] Instagram import 대량 미디어 처리 — 진행률 UI + 청크 처리
- [ ] 초기 페이지 로드 — Skeleton UI로 CLS(Cumulative Layout Shift) 최소화

---

## 11. 모니터링 & 운영

- [ ] Sentry — 에러 알림 설정 (Critical 에러 즉시 알림)
- [ ] Supabase Dashboard — DB 용량 정기 모니터링 (무료: 500MB)
- [ ] Supabase Dashboard — Auth 로그 이상 접근 모니터링
- [ ] Instagram API 호출 quota 모니터링 (일 200회 제한)
- [ ] Vercel Analytics 활성화 (트래픽, Core Web Vitals)
- [ ] Uptime 모니터링 설정 (UptimeRobot 무료 또는 Better Uptime)
- [ ] 발행 성공률 운영 대시보드 — `publish_jobs` 집계 쿼리

---

## 12. 법적 요건 & 컴플라이언스

> Instagram / Kakao 앱 심사 시 URL 필수 제출 항목

- [x] 개인정보 처리방침 페이지 (`/privacy`) 작성
  - 수집 항목: 이메일, 이름, SNS 게시물, 이미지
  - 보유 기간 명시
  - 제3자 제공 여부 (Meta, Kakao)
  - 파기 절차
- [x] 서비스 이용약관 페이지 (`/terms`) 작성
  - 서비스 설명
  - 이용 조건 및 금지 행위
  - 면책 조항
- [x] 사이트 푸터에 개인정보처리방침 / 이용약관 링크 추가
- [ ] Meta 플랫폼 정책 준수 확인 (공식 API 외 자동화 금지 명시)
- [ ] Kakao 이용약관 준수 확인

---

## 13. 테스트

### 13-1. 인증 흐름
- [ ] 이메일 회원가입 → 이메일 확인 → 로그인 E2E
- [ ] Google 로그인 E2E
- [ ] 비밀번호 재설정 E2E
- [ ] 세션 만료 후 자동 로그아웃 및 리다이렉트 확인
- [ ] 비인증 사용자의 `/dashboard` 접근 → `/` 리다이렉트 확인

### 13-2. 핵심 기능
- [ ] 게시물 직접 작성 (이미지 포함) → `source_posts` + `post_drafts` 생성 확인
- [ ] Composer 초안 편집 → 저장 → DB 반영 확인
- [ ] KakaoStory 수동 게시 시작 → `manual_publish_tasks` 생성 → 체크리스트 완료 확인
- [ ] Instagram OAuth 연결 흐름 (Issue #11 완료 후)
- [ ] Instagram Source Import — 중복 방지 포함 (Issue #12 완료 후)
- [ ] Instagram 자동 발행 → 성공/실패 상태 전환 (Issue #15 완료 후)

### 13-3. 보안 검증
- [ ] 다른 유저의 초안 ID로 Server Action 호출 시 에러 반환 확인
- [ ] anon 키로 다른 유저 데이터 직접 Supabase 쿼리 시 빈 배열 반환 확인
- [ ] 비이미지 파일(PDF, exe 등) 업로드 시 서버에서 거부 확인
- [ ] XSS — 스크립트 포함 게시물 텍스트 저장·조회 시 이스케이프 확인
- [ ] SSRF — 외부 이미지 URL 다운로드 시 내부 IP 차단 확인

---

## 14. 배포 최종 확인 (Launch Checklist)

> 프로덕션 배포 전 이 섹션 전체를 위에서 아래로 순서대로 완료

- [ ] `npm run lint` — 오류 없음
- [ ] `npm run build` — 오류 없음
- [ ] Supabase `Confirm email` 활성화 확인
- [ ] Resend SMTP 연결 + 이메일 수신 테스트 완료
- [ ] Vercel 환경 변수 전체 등록 확인
- [ ] Google OAuth Redirect URI 프로덕션 도메인 등록 확인
- [x] 개인정보처리방침 페이지 (`/privacy`) 접근 가능 확인
- [x] 서비스 이용약관 페이지 (`/terms`) 접근 가능 확인
- [x] 푸터에 위 두 페이지 링크 포함 확인
- [ ] 회원가입 → 이메일 인증 → 로그인 실제 동작 테스트
- [ ] Google 로그인 실제 동작 테스트
- [ ] Sentry 에러 수집 확인 (테스트 에러 발생 후 Sentry 대시보드에서 확인)

---

*마지막 업데이트: 2026-05-22*
