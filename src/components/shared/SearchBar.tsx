'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useSearch } from '@/hooks/useSearch'
import type { Paper, Recommendation } from '@/lib/supabase/types'
import { formatDate } from '@/lib/utils'

interface SearchBarProps {
  onClose: () => void
  context?: 'papers' | 'recommendations'
}

export default function SearchBar({ onClose, context = 'papers' }: SearchBarProps) {
  const { query, setQuery, results, searching, clearSearch } = useSearch(context)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearSearch()
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, clearSearch])

  const hasResults = results.papers.length > 0 || results.recommendations.length > 0
  const showResults = query.trim().length > 0

  return (
    <div
      className="fixed inset-0 z-[150] bg-[rgba(0,0,0,0.4)] backdrop-blur-[8px]"
      onClick={e => {
        if (e.target === e.currentTarget) {
          clearSearch()
          onClose()
        }
      }}
    >
      <div className="w-full max-w-[720px] mx-auto mt-20 px-4">
        {/* Search Input */}
        <div className="bg-bg-card border border-border rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] modal-animate">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink-light)" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={context === 'papers' ? '리뷰 검색...' : '추천 논문 검색...'}
              className="flex-1 bg-transparent border-none outline-none text-[15px] text-ink placeholder:text-ink-faint font-sans"
            />
            {query && (
              <button
                onClick={() => { clearSearch(); onClose() }}
                className="text-[12px] text-ink-faint hover:text-ink bg-transparent border-none cursor-pointer font-mono"
              >
                ESC
              </button>
            )}
          </div>

          {/* Results */}
          {showResults && (
            <div className="max-h-[400px] overflow-y-auto">
              {searching ? (
                <div className="px-5 py-8 text-center">
                  <div className="inline-block w-5 h-5 border-2 border-border-dark border-t-transparent rounded-full animate-spin" />
                </div>
              ) : !hasResults ? (
                <div className="px-5 py-8 text-center text-[13px] text-ink-faint">
                  검색 결과가 없습니다
                </div>
              ) : (
                <>
                  {/* Paper Results */}
                  {results.papers.length > 0 && (
                    <div>
                      <div className="px-5 py-2 text-[10px] font-mono uppercase tracking-[1px] text-ink-faint bg-[rgba(0,0,0,0.02)]">
                        리뷰 ({results.papers.length})
                      </div>
                      {results.papers.map(paper => (
                        <Link
                          key={paper.id}
                          href={`/papers/${paper.id}`}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-[rgba(0,0,0,0.03)] transition-colors no-underline text-ink border-b border-[rgba(0,0,0,0.04)] last:border-b-0"
                          onClick={() => { clearSearch(); onClose() }}
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[13px] font-medium truncate">{paper.title}</h4>
                            <p className="text-[11px] text-ink-faint truncate">{paper.hook}</p>
                          </div>
                          <span className="text-[10px] font-mono text-ink-faint shrink-0">
                            {formatDate(paper.created_at)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Recommendation Results */}
                  {results.recommendations.length > 0 && (
                    <div>
                      <div className="px-5 py-2 text-[10px] font-mono uppercase tracking-[1px] text-ink-faint bg-[rgba(0,0,0,0.02)]">
                        추천 ({results.recommendations.length})
                      </div>
                      {results.recommendations.map(rec => (
                        <div
                          key={rec.id}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-[rgba(0,0,0,0.03)] transition-colors border-b border-[rgba(0,0,0,0.04)] last:border-b-0"
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[13px] font-medium truncate">{rec.title}</h4>
                            <p className="text-[11px] text-ink-faint truncate">{rec.summary_ko}</p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            {rec.arxiv_url && (
                              <a href={rec.arxiv_url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono text-ink-light hover:text-ink no-underline">
                                arXiv
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
