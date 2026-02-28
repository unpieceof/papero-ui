'use client'

import { useState, type KeyboardEvent } from 'react'

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
}

export default function TagInput({ tags, onChange }: TagInputProps) {
  const [input, setInput] = useState('')

  const addTag = (value: string) => {
    const tag = value.trim().replace(/^#/, '')
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag])
    }
    setInput('')
  }

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(input)
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags.length - 1)
    }
  }

  return (
    <div className="flex flex-wrap gap-2 p-3 border border-border rounded-card bg-bg min-h-[44px] focus-within:border-border-dark transition-colors">
      {tags.map((tag, i) => (
        <span
          key={tag}
          className="flex items-center gap-1 px-2.5 py-1 text-xs bg-[rgba(0,0,0,0.05)] rounded-[20px] text-ink"
        >
          #{tag}
          <button
            onClick={() => removeTag(i)}
            className="bg-transparent border-none text-ink-faint cursor-pointer text-sm hover:text-ink leading-none"
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => input && addTag(input)}
        placeholder={tags.length === 0 ? '태그 입력 후 Enter' : ''}
        className="flex-1 min-w-[100px] border-none outline-none bg-transparent text-sm font-sans text-ink placeholder:text-ink-faint"
      />
    </div>
  )
}
