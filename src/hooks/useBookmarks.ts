'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Bookmark, BookmarkSource } from '@/lib/supabase/types'

export function useBookmarks(userId: string | undefined) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchBookmarks = useCallback(async () => {
    if (!userId) {
      setBookmarks([])
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*, paper:papers(*, author:profiles(*), stamps(*)), recommendation:recommendations(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching bookmarks:', error)
      setLoading(false)
      return
    }
    setBookmarks(data || [])
    setLoading(false)
  }, [userId, supabase])

  useEffect(() => {
    fetchBookmarks()
  }, [fetchBookmarks])

  const isBookmarked = useCallback(
    (itemId: string, source: BookmarkSource = 'paper') => {
      if (source === 'paper') {
        return bookmarks.some(b => b.paper_id === itemId)
      }
      return bookmarks.some(b => b.recommendation_id === itemId)
    },
    [bookmarks]
  )

  const toggleBookmark = useCallback(
    async (itemId: string, source: BookmarkSource = 'paper') => {
      if (!userId) return false

      const existing = source === 'paper'
        ? bookmarks.find(b => b.paper_id === itemId)
        : bookmarks.find(b => b.recommendation_id === itemId)

      if (existing) {
        await supabase.from('bookmarks').delete().eq('id', existing.id)
        setBookmarks(prev => prev.filter(b => b.id !== existing.id))
        return false
      } else {
        const insert: Record<string, unknown> = {
          user_id: userId,
          source,
        }
        if (source === 'paper') {
          insert.paper_id = itemId
        } else {
          insert.recommendation_id = itemId
        }

        const { data, error } = await supabase
          .from('bookmarks')
          .insert(insert)
          .select('*, paper:papers(*, author:profiles(*), stamps(*)), recommendation:recommendations(*)')
          .single()

        if (error) {
          console.error('Error adding bookmark:', error)
          return false
        }
        if (data) {
          setBookmarks(prev => [data, ...prev])
        }
        return true
      }
    },
    [userId, bookmarks, supabase]
  )

  return { bookmarks, loading, isBookmarked, toggleBookmark, refetch: fetchBookmarks }
}
