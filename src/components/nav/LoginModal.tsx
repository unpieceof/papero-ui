'use client'

import { useAuth } from '@/hooks/useAuth'

interface LoginModalProps {
  onClose: () => void
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const { login } = useAuth()

  const handleLogin = (type: 'a' | 'b') => {
    login(type)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.4)] backdrop-blur-[8px] z-[200] flex items-center justify-center"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-bg-card border border-border rounded-xl p-12 w-[380px] text-center modal-animate">
        <div className="font-serif text-[28px] mb-2">paperstamp</div>
        <p className="text-[13px] text-ink-light mb-8">
          도장을 찍으려면 로그인하세요
        </p>

        <button
          onClick={() => handleLogin('a')}
          className="w-full py-3.5 border-none rounded-card text-sm font-medium cursor-pointer mb-2.5 flex items-center justify-center gap-2.5 text-white transition-all"
          style={{ background: '#c0392b' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#a93226')}
          onMouseLeave={e => (e.currentTarget.style.background = '#c0392b')}
        >
          <span className="text-base">◉</span> 영영으로 로그인
        </button>

        <div className="text-[11px] text-ink-faint my-2">or</div>

        <button
          onClick={() => handleLogin('b')}
          className="w-full py-3.5 border-none rounded-card text-sm font-medium cursor-pointer mb-2.5 flex items-center justify-center gap-2.5 text-white transition-all"
          style={{ background: '#2c3e8c' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#1f2d6b')}
          onMouseLeave={e => (e.currentTarget.style.background = '#2c3e8c')}
        >
          <span className="text-base">◈</span> 찹찹으로 로그인
        </button>

        <button
          onClick={onClose}
          className="mt-4 bg-transparent border-none text-[13px] text-ink-faint cursor-pointer hover:text-ink"
        >
          닫기
        </button>
      </div>
    </div>
  )
}
