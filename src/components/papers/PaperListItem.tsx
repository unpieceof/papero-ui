'use client'

import Link from 'next/link'
import type { Paper, Profile } from '@/lib/supabase/types'
import { formatDate } from '@/lib/utils'
import Stamp from '@/components/shared/Stamp'
import BookmarkButton from '@/components/shared/BookmarkButton'

interface PaperListItemProps {
  paper: Paper
  profiles: Profile[]
  currentUserId?: string
  animatingStamp?: string | null
  onToggleStamp: (paperId: string, userId: string) => void
  isBookmarked?: boolean
  onToggleBookmark?: () => Promise<boolean | void>
  isLoggedIn?: boolean
  showLoginModal?: () => void
}

export default function PaperListItem({
  paper,
  profiles,
  currentUserId,
  animatingStamp,
  onToggleStamp,
  isBookmarked = false,
  onToggleBookmark,
  isLoggedIn = true,
  showLoginModal,
}: PaperListItemProps) {
  return (
    <Link
      href={`/papers/${paper.id}`}
      className="flex items-center gap-4 px-5 py-4 bg-bg-card border border-border rounded-card transition-all hover:border-border-dark hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)] no-underline text-ink card-animate"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-[14px] font-medium leading-[1.4] tracking-[-0.2px] truncate">
            {paper.title}
          </h3>
        </div>
        <p className="text-[12px] text-ink-light truncate mb-1.5">
          &ldquo;{paper.hook}&rdquo;
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          {paper.tags?.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-[10px] font-mono text-ink-faint bg-[rgba(0,0,0,0.03)] px-1.5 py-0.5 rounded"
            >
              #{tag}
            </span>
          ))}
          <span className="text-[11px] font-mono text-ink-faint">
            {formatDate(paper.created_at)}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0" onClick={e => e.preventDefault()}>
        <div className="flex gap-1.5 items-center">
          {profiles.map(p => {
            const isStamped = paper.stamps?.some(s => s.user_id === p.id) || false
            return (
              <Stamp
                key={p.id}
                profile={p}
                isStamped={isStamped}
                isOwn={currentUserId === p.id}
                animating={animatingStamp === `${paper.id}-${p.id}`}
                onToggle={() => onToggleStamp(paper.id, p.id)}
              />
            )
          })}
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
    </Link>
  )
}
