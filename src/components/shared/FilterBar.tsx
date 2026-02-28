'use client'

import type { Profile } from '@/lib/supabase/types'

interface FilterBarProps {
  profiles: Profile[]
  activeFilter: string | null
  onFilterChange: (userId: string | null) => void
  year?: number
}

export default function FilterBar({ profiles, activeFilter, onFilterChange, year }: FilterBarProps) {
  return (
    <div className="flex items-center justify-between mb-7 pb-4 border-b border-border">
      <span className="font-mono text-[11px] uppercase tracking-[2px] text-ink-faint">
        Papers{year ? ` — ${year}` : ''}
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => onFilterChange(null)}
          className={`
            px-3.5 py-1.5 text-[11px] border rounded-[20px] cursor-pointer transition-all font-sans
            ${activeFilter === null
              ? 'bg-ink text-bg border-ink'
              : 'bg-transparent text-ink-light border-border hover:bg-ink hover:text-bg hover:border-ink'
            }
          `}
        >
          전체
        </button>
        {profiles.map(p => (
          <button
            key={p.id}
            onClick={() => onFilterChange(p.id)}
            className={`
              px-3.5 py-1.5 text-[11px] border rounded-[20px] cursor-pointer transition-all font-sans flex items-center gap-1.5
              ${activeFilter === p.id
                ? 'bg-ink text-bg border-ink'
                : 'bg-transparent text-ink-light border-border hover:bg-ink hover:text-bg hover:border-ink'
              }
            `}
          >
            {p.nickname}
            <span style={{ color: activeFilter === p.id ? undefined : p.point_color }}>
              {p.stamp_icon}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
