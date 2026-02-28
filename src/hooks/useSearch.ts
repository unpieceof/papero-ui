'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Paper, Recommendation } from '@/lib/supabase/types'

interface SearchResult {
  papers: Paper[]
  recommendations: Recommendation[]
}

export function useSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult>({ papers: [], recommendations: [] })
  const [searching, setSearching] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const supabase = createClient()

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults({ papers: [], recommendations: [] })
      setSearching(false)
      return
    }

    setSearching(true)
    const pattern = `%${q.trim()}%`

    const [papersRes, recsRes] = await Promise.all([
      supabase
        .from('papers')
        .select('*, author:profiles(*), stamps(*)')
        .or(`title.ilike.${pattern},hook.ilike.${pattern},content.ilike.${pattern}`)
        .order('created_at', { ascending: false })
        .limit(20),
      supabase
        .from('recommendations')
        .select('*')
        .or(`title.ilike.${pattern},summary_ko.ilike.${pattern}`)
        .order('created_at', { ascending: false })
        .limit(20),
    ])

    setResults({
      papers: papersRes.data || [],
      recommendations: recsRes.data || [],
    })

    setSearching(false)
  }, [supabase])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!query.trim()) {
      setResults({ papers: [], recommendations: [] })
      setSearching(false)
      return
    }

    debounceRef.current = setTimeout(() => {
      search(query)
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, search])

  const clearSearch = useCallback(() => {
    setQuery('')
    setResults({ papers: [], recommendations: [] })
  }, [])

  return { query, setQuery, results, searching, clearSearch }
}
