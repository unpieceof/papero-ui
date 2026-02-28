'use client'

import type { Profile } from '@/lib/supabase/types'

interface StampProps {
  profile: Profile
  isStamped: boolean
  isOwn: boolean
  animating?: boolean
  onToggle: () => void
}

export default function Stamp({ profile, isStamped, isOwn, animating, onToggle }: StampProps) {
  return (
    <button
      onClick={isOwn ? onToggle : undefined}
      className={`
        w-[34px] h-[34px] rounded-full flex items-center justify-center text-sm
        transition-all relative bg-bg group
        ${isOwn ? 'cursor-pointer' : 'cursor-default'}
        ${isStamped
          ? 'border-2'
          : 'border-[1.5px] border-dashed border-border-dark opacity-40 hover:opacity-80 hover:scale-110'
        }
        ${animating ? 'stamp-animate' : ''}
      `}
      style={isStamped ? {
        borderColor: profile.point_color,
        color: profile.point_color,
      } : undefined}
    >
      <span>{isStamped ? profile.stamp_icon : '·'}</span>
      <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 scale-90 bg-ink text-bg text-[10px] px-2.5 py-1 rounded whitespace-nowrap opacity-0 pointer-events-none transition-all group-hover:opacity-100 group-hover:scale-100 font-sans">
        {profile.nickname} — {isStamped ? '읽음' : '미확인'}
      </div>
    </button>
  )
}
