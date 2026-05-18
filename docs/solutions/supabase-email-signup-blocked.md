# Supabase 이메일 회원가입 차단 문제

## 증상

회원가입 시 폼을 제출해도 아무 반응 없이 실패하거나 `/?modal=signup&error=signup_failed`로 리다이렉트됨.
코드나 DB 오류가 없는데 회원가입이 안 될 때 반드시 이 항목을 먼저 확인할 것.

## 원인 A — 이메일 주소 차단 (HTTP 400)

Supabase Auth의 **이메일 주소 제한(Restrict email addresses)** 설정이 기본 활성화되어 있다.
이메일 로컬파트(@ 앞)에 `test`가 포함되면 Supabase가 서비스 레벨에서 거부한다.

확인된 차단 패턴 (2026-05-18 기준):
- `test@test.com` → `error_code: email_address_invalid` (400)
- `test@gmail.com` → `error_code: email_address_invalid` (400)
- `testing@...`, `testuser@...` 등 로컬파트에 "test"가 들어간 모든 주소

**통과되는 패턴**: `dev@gmail.com`, `dev1@test.com` 등 로컬파트에 "test"가 없으면 통과됨.

## 원인 B — 이메일 발송 속도 제한 (HTTP 429)

Supabase **무료 플랜**은 시간당 최대 2건만 확인 이메일을 발송할 수 있다.
이메일 주소 자체는 유효해도 이 제한에 걸리면 회원가입이 실패한다.

확인된 에러:
```
"error_code": "over_email_send_rate_limit"
"error": "429: email rate limit exceeded"
```

`dev@gmail.com`, `dev1@test.com`이 차단된 이유가 이것임.

## 진단 방법

Auth 로그에서 error_code 확인:
- `email_address_invalid` (400) → 원인 A (이메일 패턴 차단)
- `over_email_send_rate_limit` (429) → 원인 B (발송 rate limit)

MCP로 확인:
```
get_logs(service: "auth", project_id: "kyqkorjtpccajzjrfrpd")
```

## 해결책 (개발 환경 권장)

### 이메일 확인 비활성화 — 두 원인 모두 해결

Supabase Dashboard → **Authentication** → **Settings** → **"Enable email confirmations" 끄기**

- 이메일 발송 자체가 없으므로 rate limit, 도메인 차단 모두 우회됨
- 가입 즉시 세션이 생성되어 `/dashboard`로 리다이렉트됨
- 코드가 이미 이 케이스를 처리하고 있음 (`actions.ts` — `data.session` 존재 시 바로 리다이렉트)

> 프로덕션 배포 전 반드시 다시 활성화할 것.

### 원인 A만 해결하고 싶을 때

Supabase Dashboard → **Authentication** → **Settings** → **"Restrict email addresses" 비활성화**
또는 이메일 로컬파트에 "test"가 없는 주소 사용.

## 예방

- 개발 시작 시 "Enable email confirmations"를 끄고 개발, 배포 전에 다시 켜는 습관 유지
- 테스트 계정 이메일 로컬파트에 "test" 미사용
- 회원가입 실패 시 코드를 의심하기 전에 **반드시 Supabase Auth 로그에서 error_code 먼저 확인**

## 관련 파일

- `src/app/auth/actions.ts` — `signUpWithEmail` 서버 액션 (line 111: session 체크)
- `src/components/auth/auth-modal.tsx` — 회원가입 폼 UI
