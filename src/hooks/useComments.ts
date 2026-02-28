'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Comment } from '@/lib/supabase/types'

export function useComments(paperId: string) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchComments = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('comments')
      .select('*, user:profiles(*)')
      .eq('paper_id', paperId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching comments:', error)
      setLoading(false)
      return
    }
    setComments(data || [])
    setLoading(false)
  }, [paperId, supabase])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const addComment = useCallback(
    async (userId: string, content: string) => {
      const { data, error } = await supabase
        .from('comments')
        .insert({ paper_id: paperId, user_id: userId, content })
        .select('*, user:profiles(*)')
        .single()

      if (error) {
        console.error('Error adding comment:', error)
        return null
      }
      if (data) {
        setComments(prev => [...prev, data])
      }
      return data
    },
    [paperId, supabase]
  )

  const deleteComment = useCallback(
    async (commentId: string) => {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)

      if (error) {
        console.error('Error deleting comment:', error)
        return false
      }
      setComments(prev => prev.filter(c => c.id !== commentId))
      return true
    },
    [supabase]
  )

  return { comments, loading, addComment, deleteComment }
}
