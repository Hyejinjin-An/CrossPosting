# Risk Register

## R1. KakaoStory 자동 게시 API 불확실성

- Severity: High
- Probability: High
- Impact: 핵심 메시지인 "그대로 복사붙여넣기" 자동화 범위가 줄어들 수 있음
- Mitigation: MVP에서는 수동 게시 보조 플로우로 출시하고, 자동 발행은 공식 API 확인 후 확장
- Owner: PM, Backend

## R2. Instagram 권한 심사와 계정 유형 제한

- Severity: High
- Probability: Medium
- Impact: 개인 계정 사용자는 자동 발행을 사용할 수 없음
- Mitigation: 온보딩에서 Professional 계정 요구사항을 명확히 안내
- Owner: PM

## R3. 플랫폼 약관 위반 리스크

- Severity: Critical
- Probability: Medium
- Impact: 앱 차단, 계정 제한, 서비스 중단
- Mitigation: 스크래핑과 비공식 자동 입력 제외, 게시 전 사용자 검수 유지
- Owner: PM, Legal, Engineering

## R4. 이미지 저작권과 무단 재게시

- Severity: High
- Probability: Medium
- Impact: 사용자 분쟁 또는 플랫폼 제재
- Mitigation: 본인 연결 계정의 게시물만 가져오고, 타인 콘텐츠 복제 기능 제외
- Owner: PM

## R5. 토큰 유출

- Severity: Critical
- Probability: Low
- Impact: 사용자 SNS 계정 오남용
- Mitigation: 서버 전용 처리, 암호화 저장, 로그 마스킹, RLS 적용
- Owner: Engineering

## R6. 중복 게시

- Severity: Medium
- Probability: Medium
- Impact: 사용자의 SNS 피드 품질 저하
- Mitigation: idempotency key, 게시 전 중복 경고, 발행 상태 머신
- Owner: Engineering

## R7. 외부 API rate limit

- Severity: Medium
- Probability: Medium
- Impact: 발행 실패와 사용자 불만
- Mitigation: 큐 기반 처리, 재시도 백오프, 사용자별 사용량 제한
- Owner: Backend

## R8. 사용자 기대와 실제 자동화 범위 차이

- Severity: High
- Probability: High
- Impact: 초기 이탈
- Mitigation: 랜딩/온보딩/Composer에서 "자동 발행 가능"과 "수동 보조"를 명확히 구분
- Owner: PM, Design
