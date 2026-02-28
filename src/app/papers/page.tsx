'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { usePapers } from '@/hooks/usePapers'
import { useAllProfiles } from '@/hooks/useProfile'
import { useStamps } from '@/hooks/useStamps'
import { useBookmarks } from '@/hooks/useBookmarks'
import PaperGrid from '@/components/papers/PaperGrid'
import ViewToggle, { type ViewMode } from '@/components/shared/ViewToggle'
import LoadMoreButton from '@/components/shared/LoadMoreButton'
import SkeletonCard from '@/components/shared/SkeletonCard'
import LoginModal from '@/components/nav/LoginModal'

export default function PapersPage() {
  const { user } = useAuth()
  const { profiles } = useAllProfiles()
  const [authorFilter, setAuthorFilter] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('card')
  const { papers, loading, hasMore, loadMore, refetch } = usePapers({ authorFilter })
  const { toggleStamp, animatingStamp } = useStamps()
  const { isBookmarked, toggleBookmark } = useBookmarks(user?.id)
  const [showLogin, setShowLogin] = useState(false)

  const handleToggleStamp = async (paperId: string, userId: string) => {
    if (!user || user.id !== userId) return
    await toggleStamp(paperId, userId)
    refetch()
  }

  return (
    <div>
      {/* Hero */}
      <section className="px-6 md:px-12 pt-16 pb-10 max-w-[1200px] mx-auto">
        <h1 className="font-serif text-4xl md:text-[48px] font-normal tracking-[-1.5px] leading-[1.15] mb-3">
          Read, Review,<br />
          <em className="italic text-ink-light">Stamp Together.</em>
        </h1>
        <p className="text-[15px] text-ink-light font-light leading-relaxed">
          둘이서 읽고, 각자의 도장을 찍는 논문 리뷰 공간
        </p>
        <div className="mt-6 flex gap-6 items-center">
          <div className="font-mono text-xs text-ink-faint tracking-[0.5px] uppercase">
            <strong className="text-ink text-xl block mb-0.5 font-medium">
              {papers.length}
            </strong>
            Papers Reviewed
          </div>
          <div className="font-mono text-xs text-ink-faint tracking-[0.5px] uppercase">
            <strong className="text-ink text-xl block mb-0.5 font-medium">
              {papers.reduce((sum, p) => sum + (p.stamps?.length || 0), 0)}
            </strong>
            Stamps Collected
          </div>
          <div className="font-mono text-xs text-ink-faint tracking-[0.5px] uppercase">
            <strong className="text-ink text-xl block mb-0.5 font-medium">
              {papers.filter(p => (p.stamps?.length || 0) >= 2).length}
            </strong>
            Both Stamped
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section className="px-6 md:px-12 pb-20 max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-7 pb-4 border-b border-border">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[2px] text-ink-faint">
              Papers
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setAuthorFilter(null)}
                className={`px-3.5 py-1.5 text-[11px] border rounded-[20px] cursor-pointer transition-all font-sans ${
                  authorFilter === null
                    ? 'bg-ink text-bg border-ink'
                    : 'bg-transparent text-ink-light border-border hover:bg-ink hover:text-bg hover:border-ink'
                }`}
              >
                전체
              </button>
              {profiles.map(p => (
                <button
                  key={p.id}
                  onClick={() => setAuthorFilter(p.id)}
                  className={`px-3.5 py-1.5 text-[11px] border rounded-[20px] cursor-pointer transition-all font-sans flex items-center gap-1.5 ${
                    authorFilter === p.id
                      ? 'bg-ink text-bg border-ink'
                      : 'bg-transparent text-ink-light border-border hover:bg-ink hover:text-bg hover:border-ink'
                  }`}
                >
                  {p.nickname}
                  <span style={{ color: authorFilter === p.id ? undefined : p.point_color }}>
                    {p.stamp_icon}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <ViewToggle viewMode={viewMode} onToggle={setViewMode} />
        </div>

        {loading && papers.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <SkeletonCard featured />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : papers.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-ink-faint text-sm">아직 작성된 리뷰가 없습니다</p>
          </div>
        ) : (
          <>
            <PaperGrid
              papers={papers}
              profiles={profiles}
              currentUserId={user?.id}
              animatingStamp={animatingStamp}
              onToggleStamp={handleToggleStamp}
              totalCount={papers.length}
              viewMode={viewMode}
              isBookmarked={(paperId) => isBookmarked(paperId, 'paper')}
              onToggleBookmark={(paperId) => toggleBookmark(paperId, 'paper')}
              isLoggedIn={!!user}
              showLoginModal={() => setShowLogin(true)}
            />
            {hasMore && (
              <LoadMoreButton onClick={loadMore} loading={loading} />
            )}
          </>
        )}
      </section>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  )
}
