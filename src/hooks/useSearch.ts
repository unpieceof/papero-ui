'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Paper, Recommendation } from '@/lib/supabase/types'

type SearchContext = 'papers' | 'recommendations'

interface SearchResult {
  papers: Paper[]
  recommendations: Recommendation[]
}

export function useSearch(context: SearchContext = 'papers') {
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

    const newResults: SearchResult = { papers: [], recommendations: [] }

    if (context === 'papers') {
      const { data } = await supabase
        .from('papers')
        .select('*, author:profiles(*), stamps(*)')
        .or(`title.ilike.${pattern},hook.ilike.${pattern},content.ilike.${pattern}`)
        .order('created_at', { ascending: false })
        .limit(20)
      newResults.papers = data || []
    }

    if (context === 'recommendations') {
      const { data } = await supabase
        .from('recommendations')
        .select('*')
        .or(`title.ilike.${pattern},summary_ko.ilike.${pattern}`)
        .order('created_at', { ascending: false })
        .limit(20)
      newResults.recommendations = data || []
    }

    setResults(newResults)

    setSearching(false)
  }, [supabase, context])

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
