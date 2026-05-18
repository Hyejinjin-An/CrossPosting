# 배포 전 체크리스트

프로덕션 배포 전 반드시 아래 항목을 순서대로 확인한다.

---

## Supabase Auth 설정

### [ ] 이메일 확인 활성화
- **위치**: Supabase Dashboard → Authentication → Providers → Email → `Confirm email` 체크
- **이유**: 개발 중 테스트 편의를 위해 이 옵션을 꺼두었음. 프로덕션에서는 반드시 켜야 함. 꺼진 상태로 배포하면 이메일 인증 없이 누구나 가입 가능해짐.
- **확인 방법**: 회원가입 후 이메일 수신 및 인증 링크 클릭이 요구되는지 테스트

### [ ] 이메일 SMTP 설정 (무료 플랜 제한 해제)
- **위치**: Supabase Dashboard → Project Settings → Auth → SMTP Settings
- **이유**: 무료 플랜은 시간당 이메일 2건 제한. 프로덕션에서는 Resend, SendGrid 등 외부 SMTP를 연결해야 함.
- **권장 서비스**: Resend (무료 플랜 월 3,000건)

### [ ] 이메일 주소 제한 확인
- **위치**: Supabase Dashboard → Authentication → Providers → Email
- **이유**: "Restrict email addresses" 옵션이 켜져 있으면 일부 이메일 도메인이 차단됨. 프로덕션 대상 사용자가 사용하는 이메일 도메인이 막히지 않는지 확인.

---

## 환경 변수

### [ ] 프로덕션 환경 변수 설정
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- 배포 플랫폼(Vercel 등) 환경 변수에 등록했는지 확인

---

## Google OAuth (소셜 로그인)

### [ ] Google OAuth Redirect URI 등록
- **위치**: Google Cloud Console → OAuth 2.0 → 승인된 리디렉션 URI
- 프로덕션 도메인 URI 추가: `https://{프로덕션 도메인}/auth/callback`
- Supabase Dashboard → Authentication → Providers → Google → Redirect URL과 일치하는지 확인

---

## 일반

### [ ] `npm run build` 오류 없이 통과
### [ ] `npm run lint` 오류 없이 통과
### [ ] 회원가입 → 이메일 인증 → 로그인 흐름 E2E 테스트
### [ ] Google 로그인 흐름 E2E 테스트

---

> 이 문서는 배포할 때마다 처음부터 끝까지 확인한다.
> 새로운 배포 전 체크 항목이 생기면 이 파일에 추가한다.
