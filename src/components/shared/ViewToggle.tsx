'use client'

export type ViewMode = 'card' | 'list'

interface ViewToggleProps {
  viewMode: ViewMode
  onToggle: (mode: ViewMode) => void
}

export default function ViewToggle({ viewMode, onToggle }: ViewToggleProps) {
  return (
    <div className="flex gap-1 bg-[rgba(0,0,0,0.04)] rounded-[20px] p-0.5">
      <button
        onClick={() => onToggle('card')}
        className={`px-3 py-1.5 text-[11px] rounded-[18px] border-none cursor-pointer transition-all font-sans flex items-center gap-1.5 ${
          viewMode === 'card'
            ? 'bg-ink text-bg'
            : 'bg-transparent text-ink-light hover:text-ink'
        }`}
        title="카드형 보기"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
        카드
      </button>
      <button
        onClick={() => onToggle('list')}
        className={`px-3 py-1.5 text-[11px] rounded-[18px] border-none cursor-pointer transition-all font-sans flex items-center gap-1.5 ${
          viewMode === 'list'
            ? 'bg-ink text-bg'
            : 'bg-transparent text-ink-light hover:text-ink'
        }`}
        title="목록형 보기"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
        목록
      </button>
    </div>
  )
}
