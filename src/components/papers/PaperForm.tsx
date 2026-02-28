'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Paper } from '@/lib/supabase/types'
import TagInput from '@/components/shared/TagInput'

interface PaperFormProps {
  paper?: Paper | null
  userId: string
}

export default function PaperForm({ paper, userId }: PaperFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const isEditing = !!paper

  const [title, setTitle] = useState(paper?.title || '')
  const [paperUrl, setPaperUrl] = useState(paper?.paper_url || '')
  const [hook, setHook] = useState(paper?.hook || '')
  const [content, setContent] = useState(paper?.content || '')
  const [tags, setTags] = useState<string[]>(paper?.tags || [])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('논문 제목을 입력해주세요')
      return
    }
    if (!hook.trim()) {
      setError('한줄 서머리를 입력해주세요')
      return
    }

    setSaving(true)
    setError('')

    try {
      if (isEditing && paper) {
        const { error: err } = await supabase
          .from('papers')
          .update({
            title: title.trim(),
            paper_url: paperUrl.trim() || null,
            hook: hook.trim(),
            content,
            tags,
            updated_at: new Date().toISOString(),
          })
          .eq('id', paper.id)
        if (err) throw err
        router.push(`/papers/${paper.id}`)
      } else {
        const { data, error: err } = await supabase
          .from('papers')
          .insert({
            author_id: userId,
            title: title.trim(),
            paper_url: paperUrl.trim() || null,
            hook: hook.trim(),
            content,
            tags,
          })
          .select()
          .single()
        if (err) throw err
        // 작성자 stamp 자동 추가
        await supabase
          .from('stamps')
          .insert({ paper_id: data.id, user_id: userId })
        router.push(`/papers/${data.id}`)
      }
    } catch {
      setError('저장에 실패했습니다')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-[800px] mx-auto px-6 md:px-12 py-12">
      <h1 className="font-serif text-3xl font-normal tracking-[-1px] mb-8">
        {isEditing ? '리뷰 수정' : '새 리뷰 작성'}
      </h1>

      {/* Title */}
      <div className="mb-6">
        <label className="block text-xs text-ink-light mb-2 font-medium">
          논문 제목 <span className="text-[#c0392b]">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g. Attention Is All You Need"
          className="w-full px-4 py-3 border border-border rounded-card text-base bg-bg outline-none focus:border-border-dark transition-colors font-sans"
        />
      </div>

      {/* Paper URL */}
      <div className="mb-6">
        <label className="block text-xs text-ink-light mb-2 font-medium">
          논문 링크
        </label>
        <input
          type="url"
          value={paperUrl}
          onChange={e => setPaperUrl(e.target.value)}
          placeholder="https://arxiv.org/abs/..."
          className="w-full px-4 py-3 border border-border rounded-card text-base bg-bg outline-none focus:border-border-dark transition-colors font-mono text-sm"
        />
      </div>

      {/* Hook */}
      <div className="mb-6">
        <label className="block text-xs text-ink-light mb-2 font-medium">
          한줄 서머리 <span className="text-[#c0392b]">*</span>
        </label>
        <input
          type="text"
          value={hook}
          onChange={e => setHook(e.target.value)}
          placeholder="이 논문을 한 문장으로 설명한다면?"
          className="w-full px-4 py-3 border border-border rounded-card text-base bg-bg outline-none focus:border-border-dark transition-colors font-sans"
        />
      </div>

      {/* Content (Markdown) */}
      <div className="mb-6">
        <label className="block text-xs text-ink-light mb-2 font-medium">
          리뷰 내용 (마크다운 지원)
        </label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={16}
          placeholder="## Summary&#10;&#10;핵심 내용을 정리해보세요...&#10;&#10;## Key Insights&#10;&#10;- 인사이트 1&#10;- 인사이트 2"
          className="w-full px-4 py-3 border border-border rounded-card text-sm bg-bg outline-none focus:border-border-dark transition-colors font-mono resize-y leading-relaxed"
        />
      </div>

      {/* Tags */}
      <div className="mb-8">
        <label className="block text-xs text-ink-light mb-2 font-medium">
          태그
        </label>
        <TagInput tags={tags} onChange={setTags} />
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-[#c0392b] mb-4">{error}</p>
      )}

      {/* Buttons */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 text-sm font-medium bg-ink text-bg border-none rounded-card cursor-pointer transition-all hover:opacity-90 disabled:opacity-50 font-sans"
        >
          {saving ? '저장 중...' : isEditing ? '수정 완료' : '등록'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-3 text-sm border border-border-dark rounded-card bg-transparent text-ink-light cursor-pointer transition-all hover:bg-ink hover:text-bg hover:border-ink font-sans"
        >
          취소
        </button>
      </div>
    </form>
  )
}
