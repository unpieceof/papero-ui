'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { usePaper } from '@/hooks/usePapers'
import { useAllProfiles } from '@/hooks/useProfile'
import { useStamps } from '@/hooks/useStamps'
import { COMMENT_READ_EVENT } from '@/hooks/useCommentNotifications'
import PaperDetail from '@/components/papers/PaperDetail'

function markPaperRead(paperId: string) {
  try {
    const key = 'paperstamp_comment_reads'
    const reads = JSON.parse(localStorage.getItem(key) || '{}')
    reads[paperId] = new Date().toISOString()
    localStorage.setItem(key, JSON.stringify(reads))
    window.dispatchEvent(new Event(COMMENT_READ_EVENT))
  } catch { /* noop */ }
}

export default function PaperDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { user } = useAuth()

  // Mark this paper's comments as read when entering the page
  useEffect(() => {
    if (user?.id && id) markPaperRead(id)
  }, [user?.id, id])
  const { paper, loading } = usePaper(id)
  const { profiles } = useAllProfiles()
  const { toggleStamp, animatingStamp } = useStamps()

  const handleToggleStamp = async (paperId: string, userId: string) => {
    if (!user || user.id !== userId) return
    await toggleStamp(paperId, userId)
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="max-w-[800px] mx-auto px-6 md:px-12 py-12">
        <div className="space-y-4">
          <div className="h-4 bg-border rounded w-32 skeleton-pulse" />
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

  if (!paper) {
    return (
      <div className="text-center py-20">
        <p className="text-ink-faint text-sm">논문을 찾을 수 없습니다</p>
      </div>
    )
  }

  return (
    <PaperDetail
      paper={paper}
      profiles={profiles}
      currentUserId={user?.id}
      animatingStamp={animatingStamp}
      onToggleStamp={handleToggleStamp}
      paperIndex={1}
    />
  )
}
