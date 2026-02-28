'use client'

import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { usePaper } from '@/hooks/usePapers'
import PaperForm from '@/components/papers/PaperForm'
import { useEffect } from 'react'

export default function EditPaperPage() {
  const params = useParams()
  const id = params.id as string
  const { user, loading: authLoading } = useAuth()
  const { paper, loading: paperLoading } = usePaper(id)
  const router = useRouter()

  const loading = authLoading || paperLoading

  useEffect(() => {
    if (!loading && (!user || (paper && paper.author_id !== user.id))) {
      router.push(`/papers/${id}`)
    }
  }, [user, paper, loading, router, id])

  if (loading) {
    return (
      <div className="max-w-[800px] mx-auto px-6 md:px-12 py-12">
        <div className="h-8 bg-border rounded w-48 skeleton-pulse mb-8" />
        <div className="space-y-6">
          <div className="h-12 bg-border rounded skeleton-pulse" />
          <div className="h-12 bg-border rounded skeleton-pulse" />
          <div className="h-12 bg-border rounded skeleton-pulse" />
          <div className="h-48 bg-border rounded skeleton-pulse" />
        </div>
      </div>
    )
  }

  if (!user || !paper || paper.author_id !== user.id) return null

  return <PaperForm paper={paper} userId={user.id} />
}
