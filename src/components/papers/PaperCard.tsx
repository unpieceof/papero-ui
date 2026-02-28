'use client'

import Link from 'next/link'
import type { Paper, Profile } from '@/lib/supabase/types'
import { formatDate, getPatternClass, getThumbSymbol, PATTERN_BACKGROUNDS } from '@/lib/utils'
import Stamp from '@/components/shared/Stamp'
import BookmarkButton from '@/components/shared/BookmarkButton'

interface PaperCardProps {
  paper: Paper
  index: number
  featured?: boolean
  profiles: Profile[]
  currentUserId?: string
  animatingStamp?: string | null
  onToggleStamp: (paperId: string, userId: string) => void
  isBookmarked?: boolean
  onToggleBookmark?: () => Promise<boolean | void>
  isLoggedIn?: boolean
  showLoginModal?: () => void
}

export default function PaperCard({
  paper,
  index,
  featured = false,
  profiles,
  currentUserId,
  animatingStamp,
  onToggleStamp,
  isBookmarked = false,
  onToggleBookmark,
  isLoggedIn = true,
  showLoginModal,
}: PaperCardProps) {
  const patternClass = getPatternClass(paper.id)
  const thumbSymbol = getThumbSymbol(paper.id)
  const bgColor = PATTERN_BACKGROUNDS[patternClass] || '#2c2c2c'
  const firstTag = paper.tags?.[0]
  const paperNumber = `No.${String(index).padStart(3, '0')}`

  if (featured) {
    return (
      <Link
        href={`/papers/${paper.id}`}
        className="col-span-full grid grid-cols-1 md:grid-cols-2 bg-bg-card border border-border rounded-card overflow-hidden cursor-pointer transition-all duration-[350ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:border-border-dark card-animate no-underline text-ink"
      >
        {/* Thumbnail */}
        <div
          className="relative overflow-hidden flex items-center justify-center min-h-[260px]"
          style={{ background: bgColor }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(0,0,0,0.4)]" />
          <span className="absolute top-3.5 left-3.5 font-mono text-[11px] text-[rgba(255,255,255,0.5)] z-[2] tracking-[1px]">
            {paperNumber}
          </span>
          <span className="absolute top-3.5 right-3.5 text-[10px] font-medium px-2.5 py-0.5 rounded-[20px] bg-[rgba(255,255,255,0.15)] backdrop-blur-[8px] text-white z-[2] font-mono uppercase tracking-[0.5px]">
            Featured
          </span>
          <span className="font-serif text-[64px] text-[rgba(255,255,255,0.06)] z-[1] relative tracking-[-3px]">
            {thumbSymbol}
          </span>
        </div>
        {/* Body */}
        <div className="p-8 flex flex-col justify-center">
          <h3 className="text-[22px] font-serif font-normal tracking-[-0.5px] leading-[1.45] mb-2 line-clamp-3">
            {paper.title}
          </h3>
          <p className="text-sm text-ink-light font-light leading-relaxed mb-3">
            &ldquo;{paper.hook}&rdquo;
          </p>
          {paper.tags && paper.tags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap mb-4">
              {paper.tags.map(tag => (
                <span key={tag} className="text-[10px] font-mono text-ink-faint bg-[rgba(0,0,0,0.03)] px-2 py-0.5 rounded-[10px]">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between mt-auto">
            <span className="font-mono text-[11px] text-ink-faint">
              {formatDate(paper.created_at)}
            </span>
            <div className="flex gap-2 items-center" onClick={e => e.preventDefault()}>
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
              {onToggleBookmark && (
                <BookmarkButton isBookmarked={isBookmarked} onToggle={onToggleBookmark} isLoggedIn={isLoggedIn} showLoginModal={showLoginModal} />
              )}
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/papers/${paper.id}`}
      className="bg-bg-card border border-border rounded-card overflow-hidden cursor-pointer transition-all duration-[350ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:border-border-dark card-animate no-underline text-ink block"
    >
      {/* Thumbnail */}
      <div
        className="w-full h-[180px] relative overflow-hidden flex items-center justify-center"
        style={{ background: bgColor }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[50%] to-[rgba(0,0,0,0.4)]" />
        <span className="absolute top-3.5 left-3.5 font-mono text-[11px] text-[rgba(255,255,255,0.5)] z-[2] tracking-[1px]">
          {paperNumber}
        </span>
        {firstTag && (
          <span className="absolute top-3.5 right-3.5 text-[10px] font-medium px-2.5 py-0.5 rounded-[20px] bg-[rgba(255,255,255,0.15)] backdrop-blur-[8px] text-white z-[2] font-mono uppercase tracking-[0.5px]">
            {firstTag}
          </span>
        )}
        <span className="font-serif text-[64px] text-[rgba(255,255,255,0.06)] z-[1] relative tracking-[-3px]">
          {thumbSymbol}
        </span>
      </div>
      {/* Body */}
      <div className="px-5 pt-5 pb-4">
        <h3 className="text-[15px] font-medium leading-[1.45] mb-2 tracking-[-0.3px] line-clamp-2">
          {paper.title}
        </h3>
        <p className="text-[13px] text-ink-light font-light leading-relaxed mb-2">
          &ldquo;{paper.hook}&rdquo;
        </p>
        {paper.tags && paper.tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mb-2">
            {paper.tags.map(tag => (
              <span key={tag} className="text-[10px] font-mono text-ink-faint bg-[rgba(0,0,0,0.03)] px-1.5 py-0.5 rounded-[10px]">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-[rgba(0,0,0,0.01)]" onClick={e => e.preventDefault()}>
        <span className="font-mono text-[11px] text-ink-faint">
          {formatDate(paper.created_at)}
        </span>
        <div className="flex gap-2 items-center">
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
          {onToggleBookmark && (
            <BookmarkButton isBookmarked={isBookmarked} onToggle={onToggleBookmark} isLoggedIn={isLoggedIn} showLoginModal={showLoginModal} />
          )}
        </div>
      </div>
    </Link>
  )
}
