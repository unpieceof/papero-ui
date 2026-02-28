-- ============================================
-- PAPERSTAMP Phase 2 Schema Migration
-- ============================================
-- Run this in Supabase SQL Editor after 001_schema.sql

-- ── DROP OLD RECOMMENDATIONS ──
drop table if exists public.recommendations cascade;

-- ── RECREATE RECOMMENDATIONS ──
create table public.recommendations (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  authors text[] not null default '{}',
  year int,
  arxiv_url text,
  pdf_url text,
  category text,
  tags text[] not null default '{}',
  rec_type text not null default 'classic' check (rec_type in ('classic', 'trending')),
  summary_ko text not null default '',
  why_read text not null default '',
  difficulty int not null default 3 check (difficulty between 1 and 5),
  difficulty_label text not null default '보통',
  read_time_min int,
  display_order int not null default 0,
  source text,
  score float,
  reading_order_tip text,
  fetched_date date not null default current_date,
  created_at timestamptz not null default now()
);

alter table public.recommendations enable row level security;

create policy "Recommendations are viewable by everyone"
  on public.recommendations for select using (true);

-- Only service_role can insert (via cron) — RLS blocks anon/authenticated
create policy "Only service role can insert recommendations"
  on public.recommendations for insert with check (false);

create policy "Only service role can update recommendations"
  on public.recommendations for update using (false);

create policy "Only service role can delete recommendations"
  on public.recommendations for delete using (false);

create index idx_recommendations_fetched on public.recommendations(fetched_date desc);
create index idx_recommendations_type on public.recommendations(rec_type);

-- ── UPDATE BOOKMARKS ──
-- Add recommendation_id and source columns

-- Make paper_id nullable (bookmarks can reference recommendations too)
alter table public.bookmarks alter column paper_id drop not null;

-- Drop the existing foreign key constraint on paper_id to allow null
-- (The constraint name follows Supabase convention)
alter table public.bookmarks drop constraint if exists bookmarks_paper_id_fkey;
alter table public.bookmarks
  add constraint bookmarks_paper_id_fkey
  foreign key (paper_id) references public.papers(id) on delete cascade;

-- Add recommendation_id column
alter table public.bookmarks
  add column if not exists recommendation_id uuid references public.recommendations(id) on delete cascade;

-- Add source column to distinguish bookmark origin
alter table public.bookmarks
  add column if not exists source text not null default 'paper' check (source in ('paper', 'recommendation'));

-- Drop old unique constraint and create new one
alter table public.bookmarks drop constraint if exists bookmarks_paper_id_user_id_key;

-- Create unique indexes for each source type
create unique index if not exists idx_bookmarks_paper_unique
  on public.bookmarks(paper_id, user_id) where paper_id is not null;

create unique index if not exists idx_bookmarks_rec_unique
  on public.bookmarks(recommendation_id, user_id) where recommendation_id is not null;

-- Add check constraint: exactly one of paper_id/recommendation_id must be set
alter table public.bookmarks
  add constraint bookmarks_source_check
  check (
    (source = 'paper' and paper_id is not null and recommendation_id is null) or
    (source = 'recommendation' and recommendation_id is not null and paper_id is null)
  );

create index if not exists idx_bookmarks_recommendation on public.bookmarks(recommendation_id);
