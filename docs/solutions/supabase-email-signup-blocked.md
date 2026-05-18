# Supabase 이메일 회원가입 차단 문제

## 증상

회원가입 시 폼을 제출해도 아무 반응 없이 `/?modal=signup&error=signup_failed`로 리다이렉트됨.
코드나 DB 오류가 없는데 회원가입이 안 될 때 반드시 이 항목을 먼저 확인할 것.

## 원인

Supabase Auth에는 **이메일 주소 제한(Restrict email addresses)** 설정이 기본 활성화되어 있다.
이 설정이 켜져 있으면 Supabase 자체가 특정 패턴의 이메일을 서비스 레벨에서 거부한다.

확인된 차단 패턴 (2026-05-18 기준):
- `test@test.com` → `error_code: email_address_invalid`
- `test@gmail.com` → `error_code: email_address_invalid`
- 이메일 로컬파트(@ 앞)에 "test"가 포함된 경우 차단될 가능성 높음

Supabase Auth 로그에서 확인할 수 있는 에러:
```
"error": "400: Email address \"test@gmail.com\" is invalid"
"error_code": "email_address_invalid"
```

이 에러는 우리 코드의 `signUpWithEmail`이 `supabase.auth.signUp()`을 호출했을 때 Supabase가 반환하는 것이며, 애플리케이션 코드 문제가 아니다.

## 진단 방법

1. Supabase Dashboard → **Logs** → **Auth** 탭에서 최근 `/signup` 요청 확인
2. `error_code: email_address_invalid` 여부 확인
3. 코드 문제가 아닌 경우 아래 해결책 적용

CLI로 확인:
```
supabase → MCP get_logs(service: "auth", project_id: "kyqkorjtpccajzjrfrpd")
```

## 해결책

### 개발 테스트용 (권장)

실제 이메일 주소 또는 다음과 같은 형식으로 테스트:
- `dev-crossposting+test1@gmail.com` (Gmail plus addressing)
- 본인 소유의 실제 이메일 주소

### 이메일 제한 해제 (개발 환경에서만)

Supabase Dashboard → **Authentication** → **Settings** → **"Restrict email addresses"** 비활성화

> 프로덕션에서는 이 옵션을 다시 활성화할 것. 비활성화 상태로 배포하면 disposable/fake 이메일로 가입 가능해짐.

## 예방

- 새 프로젝트 초기 세팅 시 Supabase Auth Settings에서 이메일 제한 옵션 상태를 확인하고 팀에 공유
- 테스트 계정 이메일은 `test`를 포함하지 않는 형식 사용
- 회원가입 실패 시 코드를 의심하기 전에 **반드시 Supabase Auth 로그를 먼저 확인**

## 관련 파일

- `src/app/auth/actions.ts` — `signUpWithEmail` 서버 액션
- `src/components/auth/auth-modal.tsx` — 회원가입 폼 UI
