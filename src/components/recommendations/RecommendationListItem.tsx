'use client'

import type { Recommendation } from '@/lib/supabase/types'
import BookmarkButton from '@/components/shared/BookmarkButton'

interface RecommendationListItemProps {
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

export default function RecommendationListItem({
  recommendation,
  isBookmarked = false,
  onToggleBookmark,
  isLoggedIn = true,
  showLoginModal,
}: RecommendationListItemProps) {
  const r = recommendation

  return (
    <div className="flex items-center gap-4 px-5 py-4 bg-bg-card border border-border rounded-card transition-all hover:border-border-dark hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)] card-animate">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-[14px] font-medium leading-[1.4] tracking-[-0.2px] truncate">
            {r.title}
          </h3>
          <span
            className="text-[9px] font-medium px-1.5 py-0.5 rounded-[8px] text-white shrink-0"
            style={{ background: DIFFICULTY_COLORS[r.difficulty] || '#888' }}
          >
            {r.difficulty_label}
          </span>
        </div>
        <p className="text-[12px] text-ink-light truncate mb-1">
          {r.authors.join(', ')}
          {r.year && <span className="text-ink-faint"> ({r.year})</span>}
        </p>
        <p className="text-[12px] text-ink-light truncate mb-1.5">
          {r.summary_ko}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          {r.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] font-mono text-ink-faint bg-[rgba(0,0,0,0.03)] px-1.5 py-0.5 rounded">
              #{tag}
            </span>
          ))}
          <span className="text-[10px] font-mono text-ink-faint uppercase">
            {r.rec_type}
          </span>
          {r.read_time_min && (
            <span className="text-[10px] font-mono text-ink-faint">
              ~{r.read_time_min}분
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="flex gap-2">
          {r.arxiv_url && (
            <a href={r.arxiv_url} target="_blank" rel="noopener noreferrer" className="text-[11px] font-mono text-ink-light hover:text-ink transition-colors no-underline">
              arXiv
            </a>
          )}
          {r.pdf_url && (
            <a href={r.pdf_url} target="_blank" rel="noopener noreferrer" className="text-[11px] font-mono text-ink-light hover:text-ink transition-colors no-underline">
              PDF
            </a>
          )}
        </div>
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
  )
}
