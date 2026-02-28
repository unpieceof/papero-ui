'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const STORAGE_KEY = 'paperstamp_comment_reads'
export const COMMENT_READ_EVENT = 'paperstamp-comment-read'

interface CommentRow {
  paper_id: string
  user_id: string
  created_at: string
}

function getReadTimestamps(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function setReadTimestamp(paperId: string) {
  const reads = getReadTimestamps()
  reads[paperId] = new Date().toISOString()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reads))
}

export function useCommentNotifications(userId: string | undefined) {
  const [unreadCount, setUnreadCount] = useState(0)
  const supabase = createClient()
  const myPaperIdsRef = useRef<Set<string>>(new Set())

  const computeUnreadCount = useCallback(async () => {
    if (!userId) { setUnreadCount(0); return }

    // 1. Fetch my paper IDs
    const { data: papers } = await supabase
      .from('papers')
      .select('id')
      .eq('author_id', userId)

    if (!papers || papers.length === 0) { setUnreadCount(0); return }

    const myPaperIds = papers.map(p => p.id)
    myPaperIdsRef.current = new Set(myPaperIds)

    // 2. Fetch comments on my papers from other users
    const { data: comments } = await supabase
      .from('comments')
      .select('paper_id, user_id, created_at')
      .in('paper_id', myPaperIds)
      .neq('user_id', userId)
      .order('created_at', { ascending: false })

    if (!comments || comments.length === 0) { setUnreadCount(0); return }

    // 3. Compare with localStorage read timestamps
    const reads = getReadTimestamps()
    const unreadPapers = new Set<string>()

    for (const c of comments) {
      const lastRead = reads[c.paper_id]
      if (!lastRead || c.created_at > lastRead) {
        unreadPapers.add(c.paper_id)
      }
    }

    setUnreadCount(unreadPapers.size)
  }, [userId, supabase])

  useEffect(() => {
    computeUnreadCount()

    // Listen for markRead events from other components
    const onRead = () => computeUnreadCount()
    window.addEventListener(COMMENT_READ_EVENT, onRead)

    // Realtime subscription on comments INSERT
    const channel = supabase
      .channel('comment-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments' },
        (payload) => {
          const newComment = payload.new as CommentRow
          // Only care about comments on my papers from other users
          if (
            userId &&
            newComment.user_id !== userId &&
            myPaperIdsRef.current.has(newComment.paper_id)
          ) {
            const reads = getReadTimestamps()
            const lastRead = reads[newComment.paper_id]
            if (!lastRead || newComment.created_at > lastRead) {
              setUnreadCount(c => c + 1)
            }
          }
        }
      )
      .subscribe()

    return () => {
      window.removeEventListener(COMMENT_READ_EVENT, onRead)
      supabase.removeChannel(channel)
    }
  }, [computeUnreadCount, supabase, userId])

  const markPaperRead = useCallback((paperId: string) => {
    setReadTimestamp(paperId)
    window.dispatchEvent(new Event(COMMENT_READ_EVENT))
  }, [])

  return { unreadCount, markPaperRead }
}
