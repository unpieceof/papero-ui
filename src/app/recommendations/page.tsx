'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRecommendations } from '@/hooks/useRecommendations'
import { useBookmarks } from '@/hooks/useBookmarks'
import ViewToggle, { type ViewMode } from '@/components/shared/ViewToggle'
import ReadingOrderTip from '@/components/recommendations/ReadingOrderTip'
import RecommendationCard from '@/components/recommendations/RecommendationCard'
import RecommendationListItem from '@/components/recommendations/RecommendationListItem'
import LoginModal from '@/components/nav/LoginModal'

export default function RecommendationsPage() {
  const { user } = useAuth()
  const {
    classics,
    trending,
    readingOrderTip,
    loading,
    week,
    weekOffset,
    goToPrevWeek,
    goToNextWeek,
    goToCurrentWeek,
  } = useRecommendations()
  const { isBookmarked, toggleBookmark } = useBookmarks(user?.id)
  const [viewMode, setViewMode] = useState<ViewMode>('card')
  const [showLogin, setShowLogin] = useState(false)

  const handleToggleBookmark = async (recId: string) => {
    return toggleBookmark(recId, 'recommendation')
  }

  const isEmpty = classics.length === 0 && trending.length === 0

  return (
    <div>
      {/* Hero */}
      <section className="px-6 md:px-12 pt-16 pb-10 max-w-[1200px] mx-auto">
        <h1 className="font-serif text-4xl md:text-[48px] font-normal tracking-[-1.5px] leading-[1.15] mb-3">
          Weekly<br />
          <em className="italic text-ink-light">Recommendations</em>
        </h1>
        <p className="text-[15px] text-ink-light font-light leading-relaxed mb-6">
          매주 엄선된 논문 추천 — 클래식부터 트렌딩까지
        </p>

        {/* Week Navigation */}
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={goToPrevWeek}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-border bg-transparent text-ink-light hover:bg-ink hover:text-bg hover:border-ink cursor-pointer transition-all text-sm"
          >
            ←
          </button>
          <span className="font-mono text-[13px] text-ink tracking-[0.5px]">
            {week.label}
          </span>
          <button
            onClick={goToNextWeek}
            disabled={weekOffset >= 0}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-border bg-transparent text-ink-light hover:bg-ink hover:text-bg hover:border-ink cursor-pointer transition-all text-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-ink-light disabled:hover:border-border"
          >
            →
          </button>
          {weekOffset !== 0 && (
            <button
              onClick={goToCurrentWeek}
              className="text-[11px] font-mono text-ink-faint hover:text-ink transition-colors bg-transparent border-none cursor-pointer"
            >
              이번 주로
            </button>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="px-6 md:px-12 pb-20 max-w-[1200px] mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-6 h-6 border-2 border-border-dark border-t-transparent rounded-full animate-spin" />
          </div>
        ) : isEmpty ? (
          <div className="text-center py-20">
            <p className="font-serif text-2xl text-ink-light mb-2">아직 추천이 없어요</p>
            <p className="text-[13px] text-ink-faint">이번 주의 추천이 아직 준비되지 않았습니다</p>
          </div>
        ) : (
          <>
            {/* Reading Order Tip */}
            {readingOrderTip && <ReadingOrderTip tip={readingOrderTip} />}

            {/* View Toggle */}
            <div className="flex items-center justify-between mb-7 pb-4 border-b border-border">
              <span className="font-mono text-[11px] uppercase tracking-[2px] text-ink-faint">
                Recommendations
              </span>
              <ViewToggle viewMode={viewMode} onToggle={setViewMode} />
            </div>

            {/* Classics Section */}
            {classics.length > 0 && (
              <div className="mb-12">
                <h2 className="font-serif text-xl mb-1 tracking-[-0.3px]">Classics</h2>
                <p className="text-[12px] text-ink-faint mb-5">꼭 읽어야 할 고전 논문</p>
                {viewMode === 'card' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {classics.map(r => (
                      <RecommendationCard
                        key={r.id}
                        recommendation={r}
                        isBookmarked={isBookmarked(r.id, 'recommendation')}
                        onToggleBookmark={() => handleToggleBookmark(r.id)}
                        isLoggedIn={!!user}
                        showLoginModal={() => setShowLogin(true)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {classics.map(r => (
                      <RecommendationListItem
                        key={r.id}
                        recommendation={r}
                        isBookmarked={isBookmarked(r.id, 'recommendation')}
                        onToggleBookmark={() => handleToggleBookmark(r.id)}
                        isLoggedIn={!!user}
                        showLoginModal={() => setShowLogin(true)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Trending Section */}
            {trending.length > 0 && (
              <div className="mb-12">
                <h2 className="font-serif text-xl mb-1 tracking-[-0.3px]">Trending</h2>
                <p className="text-[12px] text-ink-faint mb-5">지금 뜨고 있는 최신 논문</p>
                {viewMode === 'card' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {trending.map(r => (
                      <RecommendationCard
                        key={r.id}
                        recommendation={r}
                        isBookmarked={isBookmarked(r.id, 'recommendation')}
                        onToggleBookmark={() => handleToggleBookmark(r.id)}
                        isLoggedIn={!!user}
                        showLoginModal={() => setShowLogin(true)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {trending.map(r => (
                      <RecommendationListItem
                        key={r.id}
                        recommendation={r}
                        isBookmarked={isBookmarked(r.id, 'recommendation')}
                        onToggleBookmark={() => handleToggleBookmark(r.id)}
                        isLoggedIn={!!user}
                        showLoginModal={() => setShowLogin(true)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </section>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  )
}
