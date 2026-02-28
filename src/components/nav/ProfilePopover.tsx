'use client'

import { useState, useRef, useEffect } from 'react'
import type { Profile } from '@/lib/supabase/types'
import { COLOR_PRESETS, STAMP_ICON_PRESETS } from '@/lib/utils'

interface ProfilePopoverProps {
  profile: Profile
  onUpdate: (updates: Partial<Profile>) => Promise<Profile | undefined>
  onClose: () => void
  onSignOut: () => void
}

export default function ProfilePopover({ profile, onUpdate, onClose, onSignOut }: ProfilePopoverProps) {
  const [nickname, setNickname] = useState(profile.nickname)
  const [saving, setSaving] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  const handleNicknameBlur = async () => {
    const trimmed = nickname.trim().slice(0, 10)
    if (trimmed && trimmed !== profile.nickname) {
      setSaving(true)
      await onUpdate({ nickname: trimmed })
      setSaving(false)
    }
  }

  const handleColorChange = async (color: string) => {
    if (color !== profile.point_color) {
      setSaving(true)
      await onUpdate({ point_color: color })
      setSaving(false)
    }
  }

  const handleIconChange = async (icon: string) => {
    if (icon !== profile.stamp_icon) {
      setSaving(true)
      await onUpdate({ stamp_icon: icon })
      setSaving(false)
    }
  }

  return (
    <div
      ref={ref}
      className="fixed top-[72px] right-6 md:right-12 z-[150] bg-bg-card border border-border rounded-xl p-6 w-[300px] shadow-[0_12px_40px_rgba(0,0,0,0.1)] modal-animate"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-[11px] uppercase tracking-[2px] text-ink-faint">
          프로필 설정
        </span>
        {saving && (
          <span className="text-[10px] text-ink-faint">저장 중...</span>
        )}
      </div>

      {/* Nickname */}
      <div className="mb-5">
        <label className="block text-xs text-ink-light mb-1.5">닉네임 (최대 10자)</label>
        <input
          type="text"
          value={nickname}
          onChange={e => setNickname(e.target.value.slice(0, 10))}
          onBlur={handleNicknameBlur}
          onKeyDown={e => e.key === 'Enter' && handleNicknameBlur()}
          maxLength={10}
          className="w-full px-3 py-2 border border-border rounded-card text-sm bg-bg outline-none focus:border-border-dark transition-colors font-sans"
        />
      </div>

      {/* Point Color */}
      <div className="mb-5">
        <label className="block text-xs text-ink-light mb-2">포인트 컬러</label>
        <div className="flex gap-2 flex-wrap">
          {COLOR_PRESETS.map(color => (
            <button
              key={color}
              onClick={() => handleColorChange(color)}
              className="w-8 h-8 rounded-full border-2 cursor-pointer transition-transform hover:scale-110"
              style={{
                background: color,
                borderColor: color === profile.point_color ? 'var(--ink)' : 'transparent',
                transform: color === profile.point_color ? 'scale(1.1)' : undefined,
              }}
            />
          ))}
        </div>
      </div>

      {/* Stamp Icon */}
      <div className="mb-5">
        <label className="block text-xs text-ink-light mb-2">도장 아이콘</label>
        <div className="flex gap-2 flex-wrap">
          {STAMP_ICON_PRESETS.map(icon => (
            <button
              key={icon}
              onClick={() => handleIconChange(icon)}
              className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-base cursor-pointer transition-all hover:scale-110 bg-bg"
              style={{
                borderColor: icon === profile.stamp_icon ? profile.point_color : 'var(--border)',
                color: icon === profile.stamp_icon ? profile.point_color : 'var(--ink-light)',
              }}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Sign Out */}
      <button
        onClick={() => { onSignOut(); onClose() }}
        className="w-full pt-4 border-t border-border text-xs text-ink-faint hover:text-ink transition-colors bg-transparent border-x-0 border-b-0 cursor-pointer text-center"
      >
        로그아웃
      </button>
    </div>
  )
}
