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

export interface UnreadPaper {
  id: string
  title: string
}

export function useCommentNotifications(userId: string | undefined) {
  const [unreadPapers, setUnreadPapers] = useState<UnreadPaper[]>([])
  const supabase = createClient()
  const myPaperIdsRef = useRef<Set<string>>(new Set())
  const myPaperTitlesRef = useRef<Record<string, string>>({})

  const computeUnread = useCallback(async () => {
    if (!userId) { setUnreadPapers([]); return }

    // 1. Fetch my papers (id + title)
    const { data: papers } = await supabase
      .from('papers')
      .select('id, title')
      .eq('author_id', userId)

    if (!papers || papers.length === 0) { setUnreadPapers([]); return }

    const myPaperIds = papers.map(p => p.id)
    myPaperIdsRef.current = new Set(myPaperIds)
    myPaperTitlesRef.current = Object.fromEntries(papers.map(p => [p.id, p.title]))

    // 2. Fetch comments on my papers from other users
    const { data: comments } = await supabase
      .from('comments')
      .select('paper_id, user_id, created_at')
      .in('paper_id', myPaperIds)
      .neq('user_id', userId)
      .order('created_at', { ascending: false })

    if (!comments || comments.length === 0) { setUnreadPapers([]); return }

    // 3. Compare with localStorage read timestamps
    const reads = getReadTimestamps()
    const unreadIds = new Set<string>()

    for (const c of comments) {
      const lastRead = reads[c.paper_id]
      if (!lastRead || c.created_at > lastRead) {
        unreadIds.add(c.paper_id)
      }
    }

    setUnreadPapers(
      Array.from(unreadIds).map(id => ({ id, title: myPaperTitlesRef.current[id] || '' }))
    )
  }, [userId, supabase])

  useEffect(() => {
    computeUnread()

    // Listen for markRead events from other components
    const onRead = () => computeUnread()
    window.addEventListener(COMMENT_READ_EVENT, onRead)

    // Realtime subscription on comments INSERT
    const channel = supabase
      .channel('comment-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments' },
        (payload) => {
          const newComment = payload.new as CommentRow
          if (
            userId &&
            newComment.user_id !== userId &&
            myPaperIdsRef.current.has(newComment.paper_id)
          ) {
            const reads = getReadTimestamps()
            const lastRead = reads[newComment.paper_id]
            if (!lastRead || newComment.created_at > lastRead) {
              setUnreadPapers(prev => {
                if (prev.some(p => p.id === newComment.paper_id)) return prev
                return [...prev, { id: newComment.paper_id, title: myPaperTitlesRef.current[newComment.paper_id] || '' }]
              })
            }
          }
        }
      )
      .subscribe()

    return () => {
      window.removeEventListener(COMMENT_READ_EVENT, onRead)
      supabase.removeChannel(channel)
    }
  }, [computeUnread, supabase, userId])

  const markPaperRead = useCallback((paperId: string) => {
    setReadTimestamp(paperId)
    window.dispatchEvent(new Event(COMMENT_READ_EVENT))
  }, [])

  return { unreadCount: unreadPapers.length, unreadPapers, markPaperRead }
}
