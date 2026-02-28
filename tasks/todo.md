# PAPERSTAMP Phase 1 — Implementation Progress

## Steps
- [x] Step 1: 프로젝트 초기화 (Next.js 14 + pnpm + Tailwind)
- [x] Step 2: Tailwind + 글로벌 스타일 (CSS Variables, 애니메이션, 폰트)
- [x] Step 3: Supabase 연동 (client, server, types, middleware)
- [x] Step 4: DB 스키마 & 시드 데이터 (SQL 마이그레이션)
- [x] Step 5: 글로벌 레이아웃 + Nav
- [x] Step 6: 인증 (로그인 모달 + hooks)
- [x] Step 7: 프로필 편집 팝오버
- [x] Step 8: 리뷰 탭 — 카드 그리드 (/papers)
- [x] Step 9: 리뷰 상세 페이지 (/papers/[id])
- [x] Step 10: 글쓰기/수정 (/papers/new, /papers/[id]/edit)

## Build Verification
- [x] `pnpm build` — 성공 (모든 페이지 생성)
- [x] `pnpm dev` — 성공 (localhost:3000 정상 구동)

## Review
- Node.js 24.14.0 + pnpm 10.30.3 설치 완료
- Next.js 14.2.35 + React 18.3.1 + Tailwind 3.4.19
- `@supabase/ssr` 0.8.0 + `@supabase/supabase-js` 2.98.0
- next.config.mjs 사용 (Next.js 14는 .ts 미지원)
- Supabase client: env 없이도 빌드 가능하도록 Proxy fallback 처리
- Nav: `next/dynamic`으로 SSR false 처리 (SSG 빌드 호환)
- 시안 (paperstamp.html) 디자인 CSS Variables, 애니메이션, 컴포넌트 구조 충실 반영

---

# PAPERSTAMP Phase 2 — Implementation Progress

## Steps
- [x] Step 1: DB 마이그레이션 (002_update_schema.sql) — recommendations drop & recreate, bookmarks alter
- [x] Step 2: TypeScript 타입 업데이트 — Recommendation/Bookmark 인터페이스 전면 교체
- [x] Step 3: useBookmarks 훅 — bookmarks[], isBookmarked(), toggleBookmark()
- [x] Step 4: BookmarkButton 컴포넌트 — 토글 아이콘 + 비로그인 시 로그인 모달
- [x] Step 5: ViewToggle 컴포넌트 — 카드/목록 아이콘 토글
- [x] Step 6: PaperListItem 컴포넌트 — 가로형 목록 레이아웃
- [x] Step 7: PaperCard 업데이트 — 해시태그 칩 + BookmarkButton 추가
- [x] Step 8: PaperGrid 업데이트 — viewMode prop + 북마크 props
- [x] Step 9: useRecommendations 훅 — 주간 fetch + 네비게이션 + classics/trending 분리
- [x] Step 10a: ReadingOrderTip — 읽는 순서 팁 박스
- [x] Step 10b: RecommendationCard — 풀 카드 컴포넌트
- [x] Step 10c: RecommendationListItem — 컴팩트 목록형
- [x] Step 11: 추천 페이지 (/recommendations) — 주간 네비게이션 + Classics/Trending
- [x] Step 12: Cron API Route (/api/cron/fetch-recommendations) — CRON_SECRET + service_role
- [x] Step 13: useSearch 훅 — 탭 컨텍스트별 검색 + 300ms 디바운스
- [x] Step 14: SearchBar 컴포넌트 — 전체 너비 오버레이 + ESC 닫기
- [x] Step 15: Nav 업데이트 — 추천/아카이브 탭 활성화 + 검색 아이콘
- [x] Step 16: 아카이브 페이지 (/archive) — 로그인 필수 + 북마크 필터
- [x] Step 17: Papers 페이지 업데이트 — ViewToggle + useBookmarks 연동
- [x] Step 18: 환경변수 + vercel.json 업데이트

## Build Verification
- [x] `next build` — 성공 (모든 페이지 생성, 0 에러)

## 새로 생성된 파일 (14개)
```
supabase/migrations/002_update_schema.sql
src/app/recommendations/page.tsx
src/app/archive/page.tsx
src/app/api/cron/fetch-recommendations/route.ts
src/components/recommendations/RecommendationCard.tsx
src/components/recommendations/RecommendationListItem.tsx
src/components/recommendations/ReadingOrderTip.tsx
src/components/papers/PaperListItem.tsx
src/components/shared/SearchBar.tsx
src/components/shared/ViewToggle.tsx
src/components/shared/BookmarkButton.tsx
src/hooks/useBookmarks.ts
src/hooks/useSearch.ts
src/hooks/useRecommendations.ts
```

## 수정된 파일 (8개)
```
src/lib/supabase/types.ts
src/components/nav/Nav.tsx
src/components/papers/PaperCard.tsx
src/components/papers/PaperGrid.tsx
src/app/papers/page.tsx
.env.example
vercel.json
tasks/todo.md
```

## 남은 작업 (사용자 필요)
- [ ] Supabase SQL Editor에서 002_update_schema.sql 마이그레이션 실행
- [ ] .env.local에 SUPABASE_SERVICE_ROLE_KEY, CRON_SECRET 설정
- [ ] ENABLE_RECOMMENDATIONS=true 설정 시 RECOMMENDATION_API_URL 필요
- [ ] Vercel에 환경변수 배포 설정
