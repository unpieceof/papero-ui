'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import type { UnreadPaper } from '@/hooks/useCommentNotifications'

interface NotificationPopupProps {
  papers: UnreadPaper[]
  onClose: () => void
  bellButtonRef: React.RefObject<HTMLButtonElement | null>
}

export default function NotificationPopup({ papers, onClose, bellButtonRef }: NotificationPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null)

  // Close on outside click (exclude the bell button)
  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      const target = e.target as Node
      if (
        popupRef.current && !popupRef.current.contains(target) &&
        bellButtonRef.current && !bellButtonRef.current.contains(target)
      ) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [onClose, bellButtonRef])

  return (
    <div
      ref={popupRef}
      className="fixed top-[68px] right-6 z-[150] w-72 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.1)] modal-animate flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-10 border-b border-[var(--border)] shrink-0">
        <span className="font-mono text-[11px] uppercase tracking-[2px] text-[var(--ink-faint)]">알림</span>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center text-[var(--ink-faint)] hover:text-[var(--ink)] transition-colors bg-transparent border-0 cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* List */}
      <div className="max-h-[280px] overflow-y-auto">
        {papers.length === 0 ? (
          <p className="text-center text-xs text-[var(--ink-faint)] py-8">새 알림이 없어요.</p>
        ) : (
          papers.map(paper => (
            <Link
              key={paper.id}
              href={`/papers/${paper.id}`}
              onClick={onClose}
              className="flex items-start gap-3 px-4 py-3 hover:bg-[var(--bg)] transition-colors no-underline border-b border-[var(--border)] last:border-b-0"
            >
              <span className="shrink-0 mt-0.5 w-2 h-2 rounded-full bg-[#e74c3c]" />
              <div className="min-w-0">
                <p className="text-sm text-[var(--ink)] font-medium truncate">{paper.title}</p>
                <p className="text-[11px] text-[var(--ink-faint)] mt-0.5">새 댓글이 달렸어요</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
