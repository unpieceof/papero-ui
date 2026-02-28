'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import PaperForm from '@/components/papers/PaperForm'
import { useEffect } from 'react'

export default function NewPaperPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/papers')
    }
  }, [user, loading, router])

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

  if (!user) return null

  return <PaperForm userId={user.id} />
}
