'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useProfile, useAllProfiles } from '@/hooks/useProfile'
import { useChat } from '@/hooks/useChat'
import { useCommentNotifications } from '@/hooks/useCommentNotifications'
import LoginModal from './LoginModal'
import ProfilePopover from './ProfilePopover'
import ChatPopup from './ChatPopup'
import NotificationPopup from './NotificationPopup'
import SearchBar from '@/components/shared/SearchBar'

const TABS = [
  { label: '리뷰', href: '/papers' },
  { label: '추천', href: '/recommendations' },
  { label: '아카이브', href: '/archive' },
]

export default function Nav() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const { profile, updateProfile } = useProfile(user?.id)
  const { profiles } = useAllProfiles()
  const [showLogin, setShowLogin] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const chatButtonRef = useRef<HTMLButtonElement>(null)
  const { messages, sendMessage, loading: chatLoading, unreadCount } = useChat(user?.id ?? '', showChat)
  const { unreadCount: commentUnread, unreadPapers } = useCommentNotifications(user?.id)
  const [showNotifications, setShowNotifications] = useState(false)
  const bellButtonRef = useRef<HTMLButtonElement>(null)

  const profileA = profiles.find(p => p.user_type === 'a')
  const profileB = profiles.find(p => p.user_type === 'b')

  return (
    <>
      <nav className="sticky top-0 z-[100] bg-[rgba(245,244,240,0.85)] backdrop-blur-[20px] border-b border-border px-6 md:px-12 h-16 flex items-center justify-between">
        {/* Left: Logo + Tabs */}
        <div className="flex items-center gap-8">
          <Link href="/papers" className="flex items-center gap-2.5 no-underline text-ink">
            <div className="w-7 h-7 border-2 border-ink rounded-full flex items-center justify-center text-[13px] font-mono font-medium">
              PS
            </div>
            <span className="font-serif text-[22px] tracking-[-0.5px]">paperstamp</span>
          </Link>
          <div className="hidden sm:flex gap-1">
            {TABS.map(tab => {
              const isActive = pathname.startsWith(tab.href)
              const needsAuth = tab.href === '/archive'
              return (
                <Link
                  key={tab.href}
                  href={needsAuth && !user ? '#' : tab.href}
                  onClick={e => {
                    if (needsAuth && !user) {
                      e.preventDefault()
                      setShowLogin(true)
                    }
                  }}
                  className={`px-4 py-2 text-[13px] rounded-[20px] transition-all no-underline ${
                    isActive
                      ? 'text-ink bg-[rgba(0,0,0,0.06)] font-medium'
                      : 'text-ink-light hover:text-ink hover:bg-[rgba(0,0,0,0.04)]'
                  }`}
                >
                  {tab.label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Right: Badge + Avatars + Add */}
        <div className="flex items-center gap-4">
          {/* Logged in badge */}
          {profile && (
            <div
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-[20px] text-xs font-medium border-[1.5px] cursor-pointer"
              style={{
                borderColor: profile.point_color,
                color: profile.point_color,
              }}
              onClick={() => setShowProfile(!showProfile)}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: profile.point_color,
                  animation: 'pulse 2s infinite',
                }}
              />
              <span>{profile.nickname}</span>
            </div>
          )}

          {/* User avatars */}
          <div className="flex">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-bg cursor-pointer transition-transform hover:scale-110 hover:z-[2]"
              style={{ background: profileA?.point_color || '#c0392b' }}
              onClick={() => !user ? setShowLogin(true) : undefined}
            >
              {profileA?.nickname?.charAt(0) || 'Y'}
            </div>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-bg cursor-pointer transition-transform hover:scale-110 hover:z-[2] -ml-2"
              style={{ background: profileB?.point_color || '#2c3e8c' }}
              onClick={() => !user ? setShowLogin(true) : undefined}
            >
              {profileB?.nickname?.charAt(0) || 'C'}
            </div>
          </div>

          {/* Search button */}
          <button
            onClick={() => setShowSearch(true)}
            className="w-9 h-9 rounded-full border-[1.5px] border-border bg-transparent text-ink-light flex items-center justify-center transition-all hover:bg-ink hover:text-bg hover:border-ink cursor-pointer"
            title="검색"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>

          {/* Comment notification bell - logged in only */}
          {user && (
            <div className="relative">
              <button
                ref={bellButtonRef}
                onClick={() => setShowNotifications(!showNotifications)}
                className={`w-9 h-9 rounded-full border-[1.5px] flex items-center justify-center transition-all cursor-pointer ${
                  showNotifications
                    ? 'bg-ink text-bg border-ink'
                    : 'border-border bg-transparent text-ink-light hover:bg-ink hover:text-bg hover:border-ink'
                }`}
                title="댓글 알림"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </button>
              {commentUnread > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#e74c3c] text-white text-[10px] font-bold flex items-center justify-center leading-none pointer-events-none">
                  {commentUnread > 9 ? '9+' : commentUnread}
                </span>
              )}
            </div>
          )}

          {/* Chat button - logged in only */}
          {user && (
            <div className="relative">
              <button
                ref={chatButtonRef}
                onClick={() => setShowChat(!showChat)}
                className={`w-9 h-9 rounded-full border-[1.5px] flex items-center justify-center transition-all cursor-pointer ${
                  showChat
                    ? 'bg-ink text-bg border-ink'
                    : 'border-border bg-transparent text-ink-light hover:bg-ink hover:text-bg hover:border-ink'
                }`}
                title="채팅"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </button>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#e74c3c] text-white text-[10px] font-bold flex items-center justify-center leading-none pointer-events-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
          )}

          {/* Write button */}
          <Link
            href={user ? '/papers/new' : '#'}
            onClick={e => {
              if (!user) {
                e.preventDefault()
                setShowLogin(true)
              }
            }}
            className="w-9 h-9 rounded-full border-[1.5px] border-border bg-transparent text-ink-light flex items-center justify-center transition-all hover:bg-ink hover:text-bg hover:border-ink no-underline"
            title="글쓰기"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
          </Link>
        </div>
      </nav>

      {/* Search Overlay */}
      {showSearch && <SearchBar onClose={() => setShowSearch(false)} />}

      {/* Login Modal */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

      {/* Profile Popover */}
      {showProfile && profile && (
        <ProfilePopover
          profile={profile}
          onUpdate={updateProfile}
          onClose={() => setShowProfile(false)}
          onSignOut={signOut}
        />
      )}

      {/* Notification Popup */}
      {showNotifications && user && (
        <NotificationPopup
          papers={unreadPapers}
          onClose={() => setShowNotifications(false)}
          bellButtonRef={bellButtonRef}
        />
      )}

      {/* Chat Popup */}
      {showChat && user && profile && (
        <ChatPopup
          userId={user.id}
          userProfile={profile}
          messages={messages}
          sendMessage={sendMessage}
          loading={chatLoading}
          onClose={() => setShowChat(false)}
          chatButtonRef={chatButtonRef}
        />
      )}
    </>
  )
}
