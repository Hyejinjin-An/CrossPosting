# CrossPosting

한 번 만든 SNS 게시물을 여러 채널에 맞게 재활용하고, 발행까지 돕는 크로스포스팅 워크스페이스입니다.

CrossPosting은 소상공인, 크리에이터, 브랜드 운영자가 반복 게시에 쓰는 시간을 줄이고, 채널별 운영 실수를 낮추는 콘텐츠 운영 도구를 목표로 합니다.

## Why Now

Instagram, KakaoStory, 블로그, 커뮤니티 등 SNS 채널은 계속 늘어나지만 운영자는 같은 사진과 문구를 매번 다시 정리해야 합니다.

채널마다 이미지 규격, 글자 수, 해시태그 문화, 링크 처리, 발행 방식이 달라 단순 복사로는 끝나지 않습니다. 이 반복 업무는 매출을 직접 만들지 않지만, 꾸준히 시간을 잡아먹는 운영 비용입니다.

## Solution

CrossPosting은 하나의 원본 게시물을 가져와 채널별 게시 초안으로 변환합니다.

- 공식 API가 가능한 채널은 자동 발행을 지원합니다.
- 공식 API가 제한적인 채널은 복사, 이미지 다운로드, 체크리스트 기반 수동 게시를 지원합니다.
- 모든 게시 초안, 발행 상태, 실패 사유, 재시도 이력을 한 곳에서 관리합니다.

핵심은 무리한 자동화가 아니라, 플랫폼 정책을 지키면서 반복 게시의 마찰을 줄이는 것입니다.

## Business Value

- 반복 게시 시간을 줄여 소상공인과 크리에이터의 운영 비용을 낮춥니다.
- Instagram, KakaoStory처럼 사용 빈도는 높지만 발행 방식이 다른 채널을 하나의 워크플로우로 묶습니다.
- 플랫폼 약관을 우회하지 않는 자동화/수동 보조 모델로 장기 운영 가능성을 확보합니다.
- 향후 블로그, 커뮤니티, 쇼핑몰 공지, 문자/알림톡 등으로 확장 가능한 콘텐츠 운영 허브가 될 수 있습니다.

## Target Users

- 신상품, 이벤트, 공지를 여러 SNS에 반복 게시하는 로컬 매장
- 촬영물과 캡션을 여러 채널에 맞게 재활용하는 1인 크리에이터
- 게시 이력, 실패 여부, 재시도를 한 화면에서 관리해야 하는 마케터

## MVP Scope

- Instagram 게시물 가져오기
- Instagram 공식 API 기반 발행 플로우
- KakaoStory 수동 게시 보조 플로우
- 원본 게시물 기반 채널별 초안 생성
- 이미지 저장, 캡션 편집, 게시 전 검수
- 발행 이력, 실패 로그, 재시도 관리

## Product Principle

CrossPosting은 플랫폼 약관을 우회하지 않습니다.

자동 발행이 가능한 채널은 공식 API를 사용하고, 공식 API가 불명확하거나 제한적인 채널은 사용자가 최종 검수 후 직접 게시할 수 있도록 돕습니다.

## Tech Stack

- Next.js App Router
- React, TypeScript
- Tailwind CSS, shadcn/ui
- Supabase Auth, Postgres, Storage

## Getting Started

```bash
npm install
npm run dev
```

개발 서버 실행 후 `http://localhost:3000`을 엽니다.

환경 변수는 `.env.example`을 복사해 `.env.local`에 설정합니다.

```powershell
Copy-Item .env.example .env.local
```

## Documentation

- [Product Overview](docs/PRODUCT_OVERVIEW.md)
- [Product Requirements](docs/PRD.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Database](docs/DATABASE.md)
- [Roadmap](docs/ROADMAP.md)
