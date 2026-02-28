# paperstamp

2인 전용 비공개 논문 리뷰 앱.

논문을 읽고, 리뷰를 남기고, 서로 스탬프를 찍어주는 공간입니다.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS v3
- **Fonts**: Instrument Serif / Noto Sans KR / JetBrains Mono
- **Deploy**: Vercel

## Features

- 논문 리뷰 작성 (마크다운 지원)
- 스탬프 — 상대방 리뷰에 도장 찍기
- 댓글
- 북마크 (리뷰 & 추천 논문)
- 논문 추천 피드 (주간 크론)
- 아카이브 (북마크 모아보기)
- 검색 (제목 · 태그 · 본문)

## Getting Started

```bash
pnpm install
cp .env.example .env.local
# .env.local에 Supabase URL과 anon key 입력
pnpm dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | 추천 크론용 service role key |
| `CRON_SECRET` | Vercel cron 인증 토큰 |
| `RECOMMENDATION_API_URL` | 추천 논문 API 엔드포인트 |
| `ENABLE_RECOMMENDATIONS` | 추천 크론 활성화 (`true` / `false`) |

## Database

Supabase SQL Editor에서 마이그레이션 순서대로 실행:

```
supabase/migrations/001_schema.sql
supabase/migrations/002_update_schema.sql
supabase/migrations/003_remove_auth.sql
supabase/migrations/004_comments.sql
```

## Project Structure

```
src/
├── app/                  # Pages (App Router)
├── components/
│   ├── nav/              # Nav, LoginModal, ProfilePopover
│   ├── papers/           # PaperCard, PaperDetail, PaperForm, Comments, ...
│   ├── recommendations/  # RecommendationCard, ...
│   └── shared/           # Stamp, BookmarkButton, SearchBar, ...
├── hooks/                # useAuth, usePapers, useComments, ...
├── lib/supabase/         # Client, types
└── styles/               # Global CSS
```
