'use client'

import { useEffect, useRef, useState } from 'react'
import type { Message, Profile } from '@/lib/supabase/types'

interface ChatPopupProps {
  userId: string
  userProfile: Profile
  messages: Message[]
  sendMessage: (content: string) => Promise<void>
  loading: boolean
  onClose: () => void
  chatButtonRef: React.RefObject<HTMLButtonElement | null>
}

export default function ChatPopup({ userId, userProfile, messages, sendMessage, loading, onClose, chatButtonRef }: ChatPopupProps) {
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Close on outside click (exclude the chat button)
  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      const target = e.target as Node
      if (
        popupRef.current && !popupRef.current.contains(target) &&
        chatButtonRef.current && !chatButtonRef.current.contains(target)
      ) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [onClose, chatButtonRef])

  const handleSend = async () => {
    if (!input.trim()) return
    const content = input
    setInput('')
    await sendMessage(content)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div
      ref={popupRef}
      className="fixed top-[68px] right-6 z-[150] w-80 h-[420px] bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.1)] modal-animate flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-10 border-b border-[var(--border)] shrink-0">
        <span className="font-mono text-[11px] uppercase tracking-[2px] text-[var(--ink-faint)]">채팅</span>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center text-[var(--ink-faint)] hover:text-[var(--ink)] transition-colors bg-transparent border-0 cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2">
        {loading && (
          <p className="text-center text-xs text-[var(--ink-faint)] mt-4">불러오는 중...</p>
        )}
        {!loading && messages.length === 0 && (
          <p className="text-center text-xs text-[var(--ink-faint)] mt-4">아직 메시지가 없어요.</p>
        )}
        {messages.map(msg => {
          const isMine = msg.user_id === userId
          return (
            <div key={msg.id} className={`flex flex-col gap-0.5 ${isMine ? 'items-end' : 'items-start'}`}>
              {!isMine && msg.user && (
                <span className="text-[10px] text-[var(--ink-faint)] px-1">{msg.user.nickname}</span>
              )}
              <div
                className="max-w-[220px] px-3 py-2 rounded-xl text-sm leading-snug break-words"
                style={
                  isMine
                    ? { background: userProfile.point_color, color: '#fff' }
                    : { background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--ink)' }
                }
              >
                {msg.content}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 flex items-end gap-2 px-3 py-2.5 border-t border-[var(--border)]">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지 입력..."
          rows={1}
          maxLength={500}
          className="flex-1 resize-none bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--border-dark)] transition-colors font-sans leading-snug"
          style={{ minHeight: '36px', maxHeight: '80px' }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer border-0 shrink-0"
          style={{
            background: input.trim() ? userProfile.point_color : 'var(--bg)',
            color: input.trim() ? '#fff' : 'var(--ink-faint)',
            border: input.trim() ? 'none' : '1.5px solid var(--border)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
