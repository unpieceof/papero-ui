'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Paper } from '@/lib/supabase/types'

const PAGE_SIZE = 10

interface UsePapersOptions {
  authorFilter?: string | null // user_id to filter by
}

export function usePapers(options: UsePapersOptions = {}) {
  const [papers, setPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const supabase = createClient()

  const fetchPapers = useCallback(async (pageNum: number, reset = false) => {
    setLoading(true)
    let query = supabase
      .from('papers')
      .select('*, author:profiles(*), stamps(*)')
      .order('created_at', { ascending: false })
      .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1)

    if (options.authorFilter) {
      query = query.eq('author_id', options.authorFilter)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching papers:', error)
      setLoading(false)
      return
    }

    const newPapers = data || []
    setHasMore(newPapers.length === PAGE_SIZE)

    if (reset) {
      setPapers(newPapers)
    } else {
      setPapers(prev => [...prev, ...newPapers])
    }
    setLoading(false)
  }, [supabase, options.authorFilter])

  useEffect(() => {
    setPage(0)
    fetchPapers(0, true)
  }, [fetchPapers])

  const loadMore = useCallback(() => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchPapers(nextPage)
  }, [page, fetchPapers])

  const refetch = useCallback(() => {
    setPage(0)
    fetchPapers(0, true)
  }, [fetchPapers])

  return { papers, loading, hasMore, loadMore, refetch }
}

export function usePaper(id: string) {
  const [paper, setPaper] = useState<Paper | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('papers')
      .select('*, author:profiles(*), stamps(*, user:profiles(*))')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error) console.error('Error fetching paper:', error)
        setPaper(data)
        setLoading(false)
      })
  }, [id, supabase])

  return { paper, loading }
}
