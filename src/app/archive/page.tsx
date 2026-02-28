'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useBookmarks } from '@/hooks/useBookmarks'
import { useAllProfiles } from '@/hooks/useProfile'
import { useStamps } from '@/hooks/useStamps'
import ViewToggle, { type ViewMode } from '@/components/shared/ViewToggle'
import PaperCard from '@/components/papers/PaperCard'
import PaperListItem from '@/components/papers/PaperListItem'
import RecommendationCard from '@/components/recommendations/RecommendationCard'
import RecommendationListItem from '@/components/recommendations/RecommendationListItem'
import type { BookmarkSource } from '@/lib/supabase/types'

type ArchiveFilter = 'all' | 'paper' | 'recommendation'

export default function ArchivePage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { bookmarks, loading, isBookmarked, toggleBookmark } = useBookmarks(user?.id)
  const { profiles } = useAllProfiles()
  const { toggleStamp, animatingStamp } = useStamps()
  const [viewMode, setViewMode] = useState<ViewMode>('card')
  const [filter, setFilter] = useState<ArchiveFilter>('all')

  // Redirect to papers if not logged in
  if (!authLoading && !user) {
    router.push('/papers')
    return null
  }

  const handleToggleStamp = async (paperId: string, userId: string) => {
    if (!user || user.id !== userId) return
    await toggleStamp(paperId, userId)
  }

  const filteredBookmarks = filter === 'all'
    ? bookmarks
    : bookmarks.filter(b => b.source === filter)

  const paperBookmarks = filteredBookmarks.filter(b => b.source === 'paper' && b.paper)
  const recBookmarks = filteredBookmarks.filter(b => b.source === 'recommendation' && b.recommendation)

  const filters: { label: string; value: ArchiveFilter }[] = [
    { label: '전체', value: 'all' },
    { label: '리뷰', value: 'paper' },
    { label: '추천', value: 'recommendation' },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="px-6 md:px-12 pt-16 pb-10 max-w-[1200px] mx-auto">
        <h1 className="font-serif text-4xl md:text-[48px] font-normal tracking-[-1.5px] leading-[1.15] mb-3">
          My<br />
          <em className="italic text-ink-light">Archive</em>
        </h1>
        <p className="text-[15px] text-ink-light font-light leading-relaxed">
          북마크한 논문들을 한 곳에서 관리하세요
        </p>
        <div className="mt-6">
          <div className="font-mono text-xs text-ink-faint tracking-[0.5px] uppercase">
            <strong className="text-ink text-xl block mb-0.5 font-medium">{bookmarks.length}</strong>
            Bookmarked
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 md:px-12 pb-20 max-w-[1200px] mx-auto">
        {/* Filter + View Toggle */}
        <div className="flex items-center justify-between mb-7 pb-4 border-b border-border">
          <div className="flex gap-2">
            {filters.map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-3.5 py-1.5 text-[11px] border rounded-[20px] cursor-pointer transition-all font-sans ${
                  filter === f.value
                    ? 'bg-ink text-bg border-ink'
                    : 'bg-transparent text-ink-light border-border hover:bg-ink hover:text-bg hover:border-ink'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <ViewToggle viewMode={viewMode} onToggle={setViewMode} />
        </div>

        {loading || authLoading ? (
          <div className="text-center py-20">
            <div className="inline-block w-6 h-6 border-2 border-border-dark border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredBookmarks.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-2xl text-ink-light mb-2">아직 북마크가 없어요</p>
            <p className="text-[13px] text-ink-faint">
              리뷰나 추천 페이지에서 북마크 아이콘을 눌러 저장해보세요
            </p>
          </div>
        ) : (
          <div>
            {/* Paper Bookmarks */}
            {(filter === 'all' || filter === 'paper') && paperBookmarks.length > 0 && (
              <div className="mb-10">
                {filter === 'all' && (
                  <h2 className="font-mono text-[11px] uppercase tracking-[2px] text-ink-faint mb-4">
                    리뷰 ({paperBookmarks.length})
                  </h2>
                )}
                {viewMode === 'card' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {paperBookmarks.map((b, idx) => (
                      <PaperCard
                        key={b.id}
                        paper={b.paper!}
                        index={paperBookmarks.length - idx}
                        profiles={profiles}
                        currentUserId={user?.id}
                        animatingStamp={animatingStamp}
                        onToggleStamp={handleToggleStamp}
                        isBookmarked={true}
                        onToggleBookmark={() => toggleBookmark(b.paper_id!, 'paper')}
                        isLoggedIn={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {paperBookmarks.map(b => (
                      <PaperListItem
                        key={b.id}
                        paper={b.paper!}
                        profiles={profiles}
                        currentUserId={user?.id}
                        animatingStamp={animatingStamp}
                        onToggleStamp={handleToggleStamp}
                        isBookmarked={true}
                        onToggleBookmark={() => toggleBookmark(b.paper_id!, 'paper')}
                        isLoggedIn={true}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Recommendation Bookmarks */}
            {(filter === 'all' || filter === 'recommendation') && recBookmarks.length > 0 && (
              <div className="mb-10">
                {filter === 'all' && (
                  <h2 className="font-mono text-[11px] uppercase tracking-[2px] text-ink-faint mb-4">
                    추천 ({recBookmarks.length})
                  </h2>
                )}
                {viewMode === 'card' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {recBookmarks.map(b => (
                      <RecommendationCard
                        key={b.id}
                        recommendation={b.recommendation!}
                        isBookmarked={true}
                        onToggleBookmark={() => toggleBookmark(b.recommendation_id!, 'recommendation')}
                        isLoggedIn={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {recBookmarks.map(b => (
                      <RecommendationListItem
                        key={b.id}
                        recommendation={b.recommendation!}
                        isBookmarked={true}
                        onToggleBookmark={() => toggleBookmark(b.recommendation_id!, 'recommendation')}
                        isLoggedIn={true}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
