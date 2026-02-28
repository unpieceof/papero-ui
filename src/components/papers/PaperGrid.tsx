'use client'

import type { Paper, Profile } from '@/lib/supabase/types'
import { getYear } from '@/lib/utils'
import type { ViewMode } from '@/components/shared/ViewToggle'
import PaperCard from './PaperCard'
import PaperListItem from './PaperListItem'
import YearSection from '@/components/shared/YearSection'

interface PaperGridProps {
  papers: Paper[]
  profiles: Profile[]
  currentUserId?: string
  animatingStamp?: string | null
  onToggleStamp: (paperId: string, userId: string) => void
  totalCount: number
  viewMode?: ViewMode
  isBookmarked?: (paperId: string) => boolean
  onToggleBookmark?: (paperId: string) => Promise<boolean | void>
  isLoggedIn?: boolean
  showLoginModal?: () => void
}

export default function PaperGrid({
  papers,
  profiles,
  currentUserId,
  animatingStamp,
  onToggleStamp,
  totalCount,
  viewMode = 'card',
  isBookmarked,
  onToggleBookmark,
  isLoggedIn = true,
  showLoginModal,
}: PaperGridProps) {
  const grouped = papers.reduce<Record<number, Paper[]>>((acc, paper) => {
    const year = getYear(paper.created_at)
    if (!acc[year]) acc[year] = []
    acc[year].push(paper)
    return acc
  }, {})

  const years = Object.keys(grouped).map(Number).sort((a, b) => b - a)
  let globalIndex = totalCount

  return (
    <div>
      {years.map(year => (
        <YearSection key={year} year={year}>
          {viewMode === 'list' ? (
            <div className="flex flex-col gap-2">
              {grouped[year].map(paper => {
                globalIndex--
                return (
                  <PaperListItem
                    key={paper.id}
                    paper={paper}
                    profiles={profiles}
                    currentUserId={currentUserId}
                    animatingStamp={animatingStamp}
                    onToggleStamp={onToggleStamp}
                    isBookmarked={isBookmarked?.(paper.id)}
                    onToggleBookmark={onToggleBookmark ? () => onToggleBookmark(paper.id) : undefined}
                    isLoggedIn={isLoggedIn}
                    showLoginModal={showLoginModal}
                  />
                )
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {grouped[year].map((paper, idx) => {
                const paperIndex = globalIndex--
                const isFeatured = idx === 0 && year === years[0] && papers[0] === paper
                return (
                  <PaperCard
                    key={paper.id}
                    paper={paper}
                    index={paperIndex}
                    featured={isFeatured}
                    profiles={profiles}
                    currentUserId={currentUserId}
                    animatingStamp={animatingStamp}
                    onToggleStamp={onToggleStamp}
                    isBookmarked={isBookmarked?.(paper.id)}
                    onToggleBookmark={onToggleBookmark ? () => onToggleBookmark(paper.id) : undefined}
                    isLoggedIn={isLoggedIn}
                    showLoginModal={showLoginModal}
                  />
                )
              })}
            </div>
          )}
        </YearSection>
      ))}
    </div>
  )
}
