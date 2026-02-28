'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useRecommendation } from '@/hooks/useRecommendations'
import { useBookmarks } from '@/hooks/useBookmarks'
import RecommendationDetail from '@/components/recommendations/RecommendationDetail'
import LoginModal from '@/components/nav/LoginModal'

export default function RecommendationDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { user } = useAuth()
  const { recommendation, loading } = useRecommendation(id)
  const { isBookmarked, toggleBookmark } = useBookmarks(user?.id)
  const [showLogin, setShowLogin] = useState(false)

  if (loading) {
    return (
      <div className="max-w-[800px] mx-auto px-6 md:px-12 py-12">
        <div className="space-y-4">
          <div className="h-4 bg-border rounded w-48 skeleton-pulse" />
          <div className="h-10 bg-border rounded w-3/4 skeleton-pulse" />
          <div className="h-6 bg-border rounded w-1/2 skeleton-pulse" />
          <div className="h-px bg-border my-8" />
          <div className="h-4 bg-border rounded w-full skeleton-pulse" />
          <div className="h-4 bg-border rounded w-full skeleton-pulse" />
          <div className="h-4 bg-border rounded w-2/3 skeleton-pulse" />
        </div>
      </div>
    )
  }

  if (!recommendation) {
    return (
      <div className="text-center py-20">
        <p className="text-ink-faint text-sm">추천을 찾을 수 없습니다</p>
      </div>
    )
  }

  return (
    <>
      <RecommendationDetail
        recommendation={recommendation}
        isBookmarked={isBookmarked(recommendation.id, 'recommendation')}
        onToggleBookmark={() => toggleBookmark(recommendation.id, 'recommendation')}
        isLoggedIn={!!user}
        showLoginModal={() => setShowLogin(true)}
      />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  )
}
