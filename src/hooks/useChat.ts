'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Message } from '@/lib/supabase/types'

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*, user:profiles(*)')
      .order('created_at', { ascending: true })
      .limit(100)
    if (data) setMessages(data as Message[])
  }

  const sendMessage = async (content: string, userId: string) => {
    const trimmed = content.trim()
    if (!trimmed) return
    await supabase.from('messages').insert({ content: trimmed, user_id: userId })
  }

  useEffect(() => {
    setLoading(true)
    fetchMessages().finally(() => setLoading(false))

    const channel = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
        fetchMessages()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { messages, sendMessage, loading }
}
