'use client'

interface LoadMoreButtonProps {
  onClick: () => void
  loading?: boolean
}

export default function LoadMoreButton({ onClick, loading }: LoadMoreButtonProps) {
  return (
    <div className="flex justify-center mt-10">
      <button
        onClick={onClick}
        disabled={loading}
        className="px-8 py-3 text-sm border border-border-dark rounded-card bg-transparent text-ink-light cursor-pointer transition-all hover:bg-ink hover:text-bg hover:border-ink disabled:opacity-50 font-sans"
      >
        {loading ? '불러오는 중...' : '더보기'}
      </button>
    </div>
  )
}
