'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Paper, Profile } from '@/lib/supabase/types'
import { formatDate, formatPaperNumber } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import Stamp from '@/components/shared/Stamp'
import Comments from '@/components/papers/Comments'

interface PaperDetailProps {
  paper: Paper
  profiles: Profile[]
  currentUserId?: string
  animatingStamp?: string | null
  onToggleStamp: (paperId: string, userId: string) => void
  paperIndex: number
}

export default function PaperDetail({
  paper,
  profiles,
  currentUserId,
  animatingStamp,
  onToggleStamp,
  paperIndex,
}: PaperDetailProps) {
  const router = useRouter()
  const supabase = createClient()
  const isOwner = currentUserId === paper.author_id

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    await supabase.from('papers').delete().eq('id', paper.id)
    router.push('/papers')
  }

  return (
    <article className="max-w-[800px] mx-auto px-6 md:px-12 py-12">
      {/* Meta */}
      <div className="flex items-center gap-4 mb-6">
        <span className="font-mono text-[11px] text-ink-faint tracking-[1px]">
          {formatPaperNumber(paperIndex)}
        </span>
        <span className="font-mono text-[11px] text-ink-faint">
          {formatDate(paper.created_at)}
        </span>
        {paper.tags?.map(tag => (
          <span
            key={tag}
            className="text-[10px] font-medium px-2.5 py-0.5 rounded-[20px] bg-[rgba(0,0,0,0.05)] text-ink-light font-mono uppercase tracking-[0.5px]"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1 className="font-serif text-3xl md:text-[42px] font-normal tracking-[-1px] leading-[1.2] mb-4">
        {paper.title}
      </h1>

      {/* Hook */}
      <p className="text-lg text-ink-light font-light leading-relaxed mb-6 italic">
        &ldquo;{paper.hook}&rdquo;
      </p>

      {/* Paper URL */}
      {paper.paper_url && (
        <a
          href={paper.paper_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-[20px] text-ink-light hover:bg-ink hover:text-bg hover:border-ink transition-all no-underline mb-8"
        >
          논문 원문 보기 ↗
        </a>
      )}

      {/* Author info */}
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{ background: paper.author?.point_color || '#1a1a1a' }}
        >
          {paper.author?.nickname?.charAt(0) || '?'}
        </div>
        <span className="text-sm font-medium">{paper.author?.nickname}</span>
      </div>

      {/* Content */}
      <div className="markdown-content mb-12">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {paper.content}
        </ReactMarkdown>
      </div>

      {/* Stamps */}
      <div className="flex items-center gap-6 py-6 border-t border-b border-border mb-8">
        <span className="font-mono text-[11px] uppercase tracking-[2px] text-ink-faint">
          Stamps
        </span>
        <div className="flex gap-3">
          {profiles.map(p => {
            const isStamped = paper.stamps?.some(s => s.user_id === p.id) || false
            return (
              <div key={p.id} className="flex items-center gap-2">
                <Stamp
                  profile={p}
                  isStamped={isStamped}
                  isOwn={currentUserId === p.id}
                  animating={animatingStamp === `${paper.id}-${p.id}`}
                  onToggle={() => onToggleStamp(paper.id, p.id)}
                />
                <span className="text-xs text-ink-light">{p.nickname}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Comments */}
      <Comments
        paperId={paper.id}
        currentUserId={currentUserId}
        profiles={profiles}
      />

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Link
          href="/papers"
          className="text-sm text-ink-faint hover:text-ink transition-colors no-underline"
        >
          ← 목록으로
        </Link>
        {isOwner && (
          <div className="ml-auto flex gap-3">
            <Link
              href={`/papers/${paper.id}/edit`}
              className="px-5 py-2 text-sm border border-border-dark rounded-card text-ink-light hover:bg-ink hover:text-bg hover:border-ink transition-all no-underline"
            >
              수정
            </Link>
            <button
              onClick={handleDelete}
              className="px-5 py-2 text-sm border border-[#c0392b] rounded-card text-[#c0392b] hover:bg-[#c0392b] hover:text-white transition-all bg-transparent cursor-pointer font-sans"
            >
              삭제
            </button>
          </div>
        )}
      </div>
    </article>
  )
}
