# Supabase 회원가입 — profiles 동기화 이슈

## 발생 맥락

`signUpWithEmail` 서버 액션에서 Supabase Auth로 유저를 생성한 뒤 `profiles` 테이블에 추가 필드(gender, phone, display_name)를 기록하는 흐름에서 3가지 이슈를 확인.

---

## 이슈 1 — admin update 에러 무시

### 문제
```typescript
// 잘못된 패턴: 결과를 받지 않으면 에러를 알 수 없음
await admin.from("profiles").update({ gender, phone }).eq("id", userId);
```

update가 실패해도 redirect는 정상 실행된다. gender/phone이 null인 채로 가입이 완료된 것처럼 보인다.

### 수정
```typescript
const { error: profileError } = await admin
  .from("profiles")
  .upsert(...)

if (profileError) {
  console.error("[signUpWithEmail] profile upsert failed:", profileError.message);
}
```

**규칙: DB 쓰기 작업은 항상 error를 받아서 확인한다.**

---

## 이슈 2 — update 대신 upsert 미사용

### 문제
`handle_new_user` 트리거가 `auth.users` INSERT 시 `profiles` 행을 생성한다.
정상 흐름에서는 트리거가 먼저 실행되므로 `update`로 충분하다.
그러나 트리거 실패, DB 연결 지연, 마이그레이션 누락 등 예외 상황에서 profiles 행이 없으면 `update`는 0건 처리하고 조용히 넘어간다.

### 수정
```typescript
await admin
  .from("profiles")
  .upsert(
    { id: data.user.id, display_name: displayName, gender, phone },
    { onConflict: "id" }
  );
```

- 행이 있으면 → UPDATE (정상 케이스)
- 행이 없으면 → INSERT (트리거 미실행 방어)
- `onboarding_status` 등 NOT NULL 컬럼은 DB DEFAULT로 처리됨

**규칙: 외부 트리거에 의존하는 행을 업데이트할 때는 upsert를 사용한다.**

---

## 이슈 3 — 중복 이메일 감지 불완전

### 문제
이메일 확인이 **활성화**된 환경에서 기존 이메일로 재가입 시도 시, Supabase는 보안 정책상 HTTP 200을 반환하고 에러를 발생시키지 않는다. 대신 `identities: []`로 응답한다.

기존 코드는 `error.message.includes("already registered")`만 체크했기 때문에 이 케이스를 잡지 못하고 `/?modal=signup&error=check_email`로 리다이렉트했다.

이메일 확인이 **비활성화**된 환경에서는 Supabase가 `User already registered` 에러를 반환하므로 기존 체크가 동작한다.

### 수정
```typescript
// signUp 이후 추가 검사
if (!data.user || data.user.identities?.length === 0) {
  redirect("/?modal=signup&error=already_registered");
}
```

### 두 환경에서의 동작

| 환경 | 중복 이메일 시 Supabase 반환 | 처리 방법 |
|---|---|---|
| 이메일 확인 OFF | error.message: "User already registered" | `error` 분기 |
| 이메일 확인 ON | HTTP 200, `identities: []` | `identities.length === 0` 분기 |

---

## 관련 파일

- `src/app/auth/actions.ts` — `signUpWithEmail` (수정 완료)
- `supabase/migrations/*_add_profile_fields.sql` — profiles 테이블 스키마
- `docs/solutions/supabase-email-signup-blocked.md` — 이메일 차단 / rate limit 이슈
