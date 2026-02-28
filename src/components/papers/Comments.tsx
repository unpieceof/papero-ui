'use client'

import { useState } from 'react'
import { useComments } from '@/hooks/useComments'
import { formatDate } from '@/lib/utils'
import type { Profile } from '@/lib/supabase/types'

interface CommentsProps {
  paperId: string
  currentUserId?: string
  profiles: Profile[]
}

export default function Comments({ paperId, currentUserId, profiles }: CommentsProps) {
  const { comments, loading, addComment, deleteComment } = useComments(paperId)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const getProfile = (userId: string) => profiles.find(p => p.id === userId)

  const handleSubmit = async () => {
    if (!currentUserId || !content.trim()) return
    setSubmitting(true)
    await addComment(currentUserId, content.trim())
    setContent('')
    setSubmitting(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="py-6 border-t border-border mb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="font-mono text-[11px] uppercase tracking-[2px] text-ink-faint">
          Comments
        </span>
        {!loading && (
          <span className="font-mono text-[11px] text-ink-faint">
            ({comments.length})
          </span>
        )}
      </div>

      {/* Comment list */}
      {loading ? (
        <div className="space-y-3 mb-6">
          <div className="h-4 bg-border rounded w-1/3 skeleton-pulse" />
          <div className="h-4 bg-border rounded w-2/3 skeleton-pulse" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-ink-faint mb-6">아직 댓글이 없습니다.</p>
      ) : (
        <div className="space-y-4 mb-6">
          {comments.map(comment => {
            const author = comment.user || getProfile(comment.user_id)
            const isOwn = currentUserId === comment.user_id
            return (
              <div key={comment.id} className="group">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                    style={{ background: author?.point_color || '#1a1a1a' }}
                  >
                    {author?.nickname?.charAt(0) || '?'}
                  </div>
                  <span className="text-xs font-medium text-ink">
                    {author?.nickname || '알 수 없음'}
                  </span>
                  <span className="font-mono text-[10px] text-ink-faint">
                    {formatDate(comment.created_at)}
                  </span>
                  {isOwn && (
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="ml-auto text-[10px] text-ink-faint hover:text-[#c0392b] transition-colors opacity-0 group-hover:opacity-100 bg-transparent border-none cursor-pointer font-sans"
                    >
                      삭제
                    </button>
                  )}
                </div>
                <p className="text-sm text-ink leading-relaxed pl-7 whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {/* Input form (logged in only) */}
      {currentUserId && (
        <div className="flex gap-3">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-1"
            style={{ background: getProfile(currentUserId)?.point_color || '#1a1a1a' }}
          >
            {getProfile(currentUserId)?.nickname?.charAt(0) || '?'}
          </div>
          <div className="flex-1">
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="댓글을 남겨보세요..."
              rows={2}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-transparent text-ink placeholder:text-ink-faint resize-none focus:outline-none focus:border-ink-light transition-colors font-sans"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleSubmit}
                disabled={!content.trim() || submitting}
                className="px-4 py-1.5 text-xs font-medium rounded-[20px] border border-border text-ink-light hover:bg-ink hover:text-bg hover:border-ink transition-all bg-transparent cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed font-sans"
              >
                {submitting ? '등록 중...' : '등록'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
