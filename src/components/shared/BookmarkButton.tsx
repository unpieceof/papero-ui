'use client'

import { useState } from 'react'
import type { BookmarkSource } from '@/lib/supabase/types'

interface BookmarkButtonProps {
  isBookmarked: boolean
  onToggle: () => Promise<boolean | void>
  size?: 'sm' | 'md'
  showLoginModal?: () => void
  isLoggedIn?: boolean
}

export default function BookmarkButton({
  isBookmarked,
  onToggle,
  size = 'sm',
  showLoginModal,
  isLoggedIn = true,
}: BookmarkButtonProps) {
  const [animating, setAnimating] = useState(false)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isLoggedIn && showLoginModal) {
      showLoginModal()
      return
    }

    setAnimating(true)
    await onToggle()
    setTimeout(() => setAnimating(false), 300)
  }

  const sizeClass = size === 'md' ? 'w-8 h-8 text-base' : 'w-6 h-6 text-sm'

  return (
    <button
      onClick={handleClick}
      className={`${sizeClass} flex items-center justify-center rounded-full border-none bg-transparent cursor-pointer transition-all hover:scale-110 ${
        animating ? 'scale-125' : ''
      }`}
      title={isBookmarked ? '북마크 해제' : '북마크 추가'}
      aria-label={isBookmarked ? '북마크 해제' : '북마크 추가'}
    >
      {isBookmarked ? (
        <svg width={size === 'md' ? 20 : 16} height={size === 'md' ? 20 : 16} viewBox="0 0 24 24" fill="var(--ink)" stroke="var(--ink)" strokeWidth="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      ) : (
        <svg width={size === 'md' ? 20 : 16} height={size === 'md' ? 20 : 16} viewBox="0 0 24 24" fill="none" stroke="var(--ink-faint)" strokeWidth="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      )}
    </button>
  )
}
