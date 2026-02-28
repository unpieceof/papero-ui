'use client'

import Link from 'next/link'
import type { Recommendation } from '@/lib/supabase/types'
import BookmarkButton from '@/components/shared/BookmarkButton'

interface RecommendationDetailProps {
  recommendation: Recommendation
  isBookmarked: boolean
  onToggleBookmark: () => Promise<boolean | void>
  isLoggedIn: boolean
  showLoginModal: () => void
}

const DIFFICULTY_COLORS: Record<number, string> = {
  1: '#27ae60',
  2: '#2ecc71',
  3: '#f39c12',
  4: '#e67e22',
  5: '#c0392b',
}

export default function RecommendationDetail({
  recommendation,
  isBookmarked,
  onToggleBookmark,
  isLoggedIn,
  showLoginModal,
}: RecommendationDetailProps) {
  const r = recommendation

  return (
    <article className="max-w-[800px] mx-auto px-6 md:px-12 py-12">
      {/* Meta */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        {r.category && (
          <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-[20px] bg-[rgba(0,0,0,0.05)] text-ink-light font-mono uppercase tracking-[0.5px]">
            {r.category}
          </span>
        )}
        <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-[20px] bg-[rgba(0,0,0,0.05)] text-ink-light font-mono uppercase tracking-[0.5px]">
          {r.rec_type}
        </span>
        <span
          className="text-[10px] font-medium px-2 py-0.5 rounded-[10px] text-white"
          style={{ background: DIFFICULTY_COLORS[r.difficulty] || '#888' }}
        >
          {r.difficulty_label}
        </span>
        {r.read_time_min && (
          <span className="text-[11px] font-mono text-ink-faint">
            ~{r.read_time_min}분
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="font-serif text-3xl md:text-[42px] font-normal tracking-[-1px] leading-[1.2] mb-4">
        {r.title}
      </h1>

      {/* Authors + Year */}
      <p className="text-[14px] text-ink-light mb-6">
        {r.authors.join(', ')}
        {r.year && <span className="text-ink-faint"> ({r.year})</span>}
      </p>

      {/* External links */}
      <div className="flex gap-3 mb-8">
        {r.arxiv_url && (
          <a
            href={r.arxiv_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-[20px] text-ink-light hover:bg-ink hover:text-bg hover:border-ink transition-all no-underline"
          >
            arXiv 보기 ↗
          </a>
        )}
        {r.pdf_url && (
          <a
            href={r.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-[20px] text-ink-light hover:bg-ink hover:text-bg hover:border-ink transition-all no-underline"
          >
            PDF 보기 ↗
          </a>
        )}
      </div>

      {/* Summary */}
      <div className="mb-8">
        <h2 className="font-mono text-[11px] uppercase tracking-[2px] text-ink-faint mb-3">
          요약
        </h2>
        <p className="text-[15px] text-ink leading-relaxed">
          {r.summary_ko}
        </p>
      </div>

      {/* Why Read */}
      {r.why_read && (
        <div className="mb-8">
          <h2 className="font-mono text-[11px] uppercase tracking-[2px] text-ink-faint mb-3">
            왜 읽어야 하나?
          </h2>
          <p className="text-[15px] text-ink-light leading-relaxed italic">
            &ldquo;{r.why_read}&rdquo;
          </p>
        </div>
      )}

      {/* Tags */}
      {r.tags.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-8 pb-6 border-b border-border">
          {r.tags.map(tag => (
            <span
              key={tag}
              className="text-[11px] font-mono text-ink-faint bg-[rgba(0,0,0,0.03)] px-2 py-1 rounded-[10px]"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Bookmark */}
      <div className="flex items-center gap-3 mb-8">
        <BookmarkButton
          isBookmarked={isBookmarked}
          onToggle={onToggleBookmark}
          size="md"
          isLoggedIn={isLoggedIn}
          showLoginModal={showLoginModal}
        />
        <span className="text-sm text-ink-faint">
          {isBookmarked ? '북마크됨' : '북마크 추가'}
        </span>
      </div>

      {/* Back link */}
      <Link
        href="/recommendations"
        className="text-sm text-ink-faint hover:text-ink transition-colors no-underline"
      >
        ← 목록으로
      </Link>
    </article>
  )
}
