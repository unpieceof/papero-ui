'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Message } from '@/lib/supabase/types'

export function useChat(userId: string, isOpen: boolean) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const supabase = createClient()
  const isOpenRef = useRef(isOpen)

  useEffect(() => { isOpenRef.current = isOpen }, [isOpen])

  // Reset unread when popup opens
  useEffect(() => {
    if (isOpen) setUnreadCount(0)
  }, [isOpen])

  const fetchMessages = useCallback(async () => {
    const { data } = await supabase
      .from('messages')
      .select('*, user:profiles(*)')
      .order('created_at', { ascending: true })
      .limit(100)
    if (data) setMessages(data as Message[])
  }, [supabase])

  const sendMessage = async (content: string) => {
    const trimmed = content.trim()
    if (!trimmed) return
    await supabase.from('messages').insert({ content: trimmed, user_id: userId })
    await fetchMessages()
  }

  useEffect(() => {
    setLoading(true)
    fetchMessages().finally(() => setLoading(false))

    const channel = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        fetchMessages()
        const newMsg = payload.new as { user_id: string }
        if (newMsg.user_id !== userId && !isOpenRef.current) {
          setUnreadCount(c => c + 1)
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchMessages, supabase])

  return { messages, sendMessage, loading, unreadCount }
}
