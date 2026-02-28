-- ============================================
-- PAPERSTAMP Database Schema
-- ============================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ── PROFILES ──
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  nickname text not null default '',
  user_type text not null check (user_type in ('a', 'b')),
  point_color text not null default '#c0392b',
  stamp_icon text not null default '◉',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- ── PAPERS ──
create table public.papers (
  id uuid default uuid_generate_v4() primary key,
  author_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  paper_url text,
  hook text not null default '',
  content text not null default '',
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.papers enable row level security;

create policy "Papers are viewable by everyone"
  on public.papers for select using (true);

create policy "Authenticated users can insert papers"
  on public.papers for insert with check (auth.uid() = author_id);

create policy "Users can update own papers"
  on public.papers for update using (auth.uid() = author_id);

create policy "Users can delete own papers"
  on public.papers for delete using (auth.uid() = author_id);

-- ── STAMPS ──
create table public.stamps (
  id uuid default uuid_generate_v4() primary key,
  paper_id uuid references public.papers(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  unique(paper_id, user_id)
);

alter table public.stamps enable row level security;

create policy "Stamps are viewable by everyone"
  on public.stamps for select using (true);

create policy "Users can insert own stamps"
  on public.stamps for insert with check (auth.uid() = user_id);

create policy "Users can delete own stamps"
  on public.stamps for delete using (auth.uid() = user_id);

-- ── RECOMMENDATIONS (Phase 2) ──
create table public.recommendations (
  id uuid default uuid_generate_v4() primary key,
  paper_id uuid references public.papers(id) on delete cascade not null,
  reason text not null default '',
  created_at timestamptz not null default now()
);

alter table public.recommendations enable row level security;

create policy "Recommendations are viewable by everyone"
  on public.recommendations for select using (true);

-- Only service_role can insert (via cron)
create policy "Only service role can insert recommendations"
  on public.recommendations for insert with check (false);

-- ── BOOKMARKS (Phase 2) ──
create table public.bookmarks (
  id uuid default uuid_generate_v4() primary key,
  paper_id uuid references public.papers(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  unique(paper_id, user_id)
);

alter table public.bookmarks enable row level security;

create policy "Users can view own bookmarks"
  on public.bookmarks for select using (auth.uid() = user_id);

create policy "Users can insert own bookmarks"
  on public.bookmarks for insert with check (auth.uid() = user_id);

create policy "Users can delete own bookmarks"
  on public.bookmarks for delete using (auth.uid() = user_id);

-- ── INDEXES ──
create index idx_papers_author on public.papers(author_id);
create index idx_papers_created on public.papers(created_at desc);
create index idx_stamps_paper on public.stamps(paper_id);
create index idx_stamps_user on public.stamps(user_id);
create index idx_bookmarks_user on public.bookmarks(user_id);

-- ── AUTO-UPDATE updated_at ──
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_profiles_updated
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger on_papers_updated
  before update on public.papers
  for each row execute function public.handle_updated_at();

-- ── AUTO-CREATE PROFILE ON AUTH SIGNUP ──
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, nickname, user_type, point_color, stamp_icon)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nickname', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'user_type', 'a'),
    case
      when coalesce(new.raw_user_meta_data->>'user_type', 'a') = 'a' then '#c0392b'
      else '#2c3e8c'
    end,
    case
      when coalesce(new.raw_user_meta_data->>'user_type', 'a') = 'a' then '◉'
      else '◈'
    end
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
