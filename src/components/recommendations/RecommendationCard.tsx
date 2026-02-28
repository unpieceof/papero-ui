'use client'

import Link from 'next/link'
import type { Recommendation } from '@/lib/supabase/types'
import { getPatternClass, getThumbSymbol, PATTERN_BACKGROUNDS } from '@/lib/utils'
import BookmarkButton from '@/components/shared/BookmarkButton'

interface RecommendationCardProps {
  recommendation: Recommendation
  isBookmarked?: boolean
  onToggleBookmark?: () => Promise<boolean | void>
  isLoggedIn?: boolean
  showLoginModal?: () => void
}

const DIFFICULTY_COLORS: Record<number, string> = {
  1: '#27ae60',
  2: '#2ecc71',
  3: '#f39c12',
  4: '#e67e22',
  5: '#c0392b',
}

export default function RecommendationCard({
  recommendation,
  isBookmarked = false,
  onToggleBookmark,
  isLoggedIn = true,
  showLoginModal,
}: RecommendationCardProps) {
  const r = recommendation
  const patternClass = getPatternClass(r.id)
  const thumbSymbol = getThumbSymbol(r.id)
  const bgColor = PATTERN_BACKGROUNDS[patternClass] || '#2c2c2c'

  return (
    <Link href={`/recommendations/${r.id}`} className="block no-underline text-inherit bg-bg-card border border-border rounded-card overflow-hidden transition-all duration-[350ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:border-border-dark card-animate">
      {/* Thumbnail */}
      <div
        className="w-full h-[140px] relative overflow-hidden flex items-center justify-center"
        style={{ background: bgColor }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[50%] to-[rgba(0,0,0,0.4)]" />
        {r.category && (
          <span className="absolute top-3 left-3 text-[10px] font-medium px-2.5 py-0.5 rounded-[20px] bg-[rgba(255,255,255,0.15)] backdrop-blur-[8px] text-white z-[2] font-mono uppercase tracking-[0.5px]">
            {r.category}
          </span>
        )}
        <span className="absolute top-3 right-3 text-[10px] font-medium px-2.5 py-0.5 rounded-[20px] bg-[rgba(255,255,255,0.2)] backdrop-blur-[8px] text-white z-[2] font-mono uppercase tracking-[0.5px]">
          {r.rec_type}
        </span>
        <span className="font-serif text-[48px] text-[rgba(255,255,255,0.06)] z-[1] relative tracking-[-3px]">
          {thumbSymbol}
        </span>
      </div>

      {/* Body */}
      <div className="px-5 pt-4 pb-3">
        <h3 className="text-[15px] font-medium leading-[1.45] mb-1.5 tracking-[-0.3px] line-clamp-2">
          {r.title}
        </h3>
        <p className="text-[12px] text-ink-light mb-2 truncate">
          {r.authors.join(', ')}
          {r.year && <span className="text-ink-faint"> ({r.year})</span>}
        </p>

        {/* Difficulty + Read Time */}
        <div className="flex items-center gap-3 mb-3">
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-[10px] text-white"
            style={{ background: DIFFICULTY_COLORS[r.difficulty] || '#888' }}
          >
            {r.difficulty_label}
          </span>
          {r.read_time_min && (
            <span className="text-[11px] text-ink-faint font-mono">
              ~{r.read_time_min}분
            </span>
          )}
        </div>

        {/* Summary */}
        <p className="text-[13px] text-ink-light leading-relaxed mb-2 line-clamp-3">
          {r.summary_ko}
        </p>

        {/* Why Read */}
        {r.why_read && (
          <p className="text-[12px] text-ink-faint italic leading-relaxed mb-3 line-clamp-2">
            &ldquo;{r.why_read}&rdquo;
          </p>
        )}

        {/* Tags */}
        {r.tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mb-3">
            {r.tags.map(tag => (
              <span key={tag} className="text-[10px] font-mono text-ink-faint bg-[rgba(0,0,0,0.03)] px-1.5 py-0.5 rounded-[10px]">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-[rgba(0,0,0,0.01)]">
        <div className="flex gap-2">
          {r.arxiv_url && (
            <a
              href={r.arxiv_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-mono text-ink-light hover:text-ink transition-colors no-underline"
              onClick={e => e.stopPropagation()}
            >
              arXiv →
            </a>
          )}
          {r.pdf_url && (
            <a
              href={r.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-mono text-ink-light hover:text-ink transition-colors no-underline"
              onClick={e => e.stopPropagation()}
            >
              PDF →
            </a>
          )}
        </div>
        <div className="flex items-center gap-2">
          {r.rec_type === 'trending' && r.source && r.score != null && (
            <span className="text-[10px] font-mono text-ink-faint">
              {r.source} {r.score.toFixed(1)}
            </span>
          )}
          {onToggleBookmark && (
            <BookmarkButton
              isBookmarked={isBookmarked}
              onToggle={onToggleBookmark}
              isLoggedIn={isLoggedIn}
              showLoginModal={showLoginModal}
            />
          )}
        </div>
      </div>
    </Link>
  )
}
