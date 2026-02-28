-- ============================================
-- PAPERSTAMP: Remove Supabase Auth dependency
-- ============================================
-- 2명만 사용하는 비공개 앱 → 클릭 즉시 로그인으로 전환
-- auth.users FK 제거, RLS 전체 허용, 고정 프로필 시드

-- ── 1. 기존 데이터 정리 (깨끗한 시작) ──
truncate public.bookmarks cascade;
truncate public.stamps cascade;
truncate public.papers cascade;
truncate public.profiles cascade;

-- ── 2. auth.users 트리거 제거 ──
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- ── 3. profiles: auth.users FK 제거, 독립 테이블로 변환 ──
-- profiles_id_fkey = profiles.id → auth.users FK (이걸 먼저 제거해야 독립 insert 가능)
alter table public.profiles drop constraint if exists profiles_id_fkey;
-- PK cascade → papers/stamps/bookmarks의 profiles 참조 FK도 함께 제거
alter table public.profiles drop constraint profiles_pkey cascade;
alter table public.profiles add primary key (id);
-- FK가 cascade로 제거되었으므로 papers, stamps, bookmarks FK 재생성
alter table public.papers
  add constraint papers_author_id_fkey
  foreign key (author_id) references public.profiles(id) on delete cascade;

alter table public.stamps
  add constraint stamps_user_id_fkey
  foreign key (user_id) references public.profiles(id) on delete cascade;

alter table public.bookmarks
  add constraint bookmarks_user_id_fkey
  foreign key (user_id) references public.profiles(id) on delete cascade;

-- ── 4. 고정 프로필 시드 ──
insert into public.profiles (id, email, nickname, user_type, point_color, stamp_icon)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'young@paperstamp.com', '영영', 'a', '#c0392b', '◉'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'chap@paperstamp.com', '찹찹', 'b', '#2c3e8c', '◈');

-- ── 5. RLS 정책 교체: auth.uid() → true ──

-- profiles
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Anyone can update profiles"
  on public.profiles for update using (true);

-- papers
drop policy if exists "Authenticated users can insert papers" on public.papers;
drop policy if exists "Users can update own papers" on public.papers;
drop policy if exists "Users can delete own papers" on public.papers;

create policy "Anyone can insert papers"
  on public.papers for insert with check (true);
create policy "Anyone can update papers"
  on public.papers for update using (true);
create policy "Anyone can delete papers"
  on public.papers for delete using (true);

-- stamps
drop policy if exists "Users can insert own stamps" on public.stamps;
drop policy if exists "Users can delete own stamps" on public.stamps;

create policy "Anyone can insert stamps"
  on public.stamps for insert with check (true);
create policy "Anyone can delete stamps"
  on public.stamps for delete using (true);

-- bookmarks
drop policy if exists "Users can view own bookmarks" on public.bookmarks;
drop policy if exists "Users can insert own bookmarks" on public.bookmarks;
drop policy if exists "Users can delete own bookmarks" on public.bookmarks;

create policy "Anyone can view bookmarks"
  on public.bookmarks for select using (true);
create policy "Anyone can insert bookmarks"
  on public.bookmarks for insert with check (true);
create policy "Anyone can delete bookmarks"
  on public.bookmarks for delete using (true);
