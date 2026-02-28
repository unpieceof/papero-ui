'use client'

import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'paperstamp_user_id'
const AUTH_EVENT = 'paperstamp-auth-change'

const USERS = {
  a: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  b: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
} as const

interface SimpleUser {
  id: string
}

function readUser(): SimpleUser | null {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && Object.values(USERS).includes(stored as typeof USERS[keyof typeof USERS])) {
    return { id: stored }
  }
  return null
}

export function useAuth() {
  const [user, setUser] = useState<SimpleUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUser(readUser())
    setLoading(false)

    const sync = () => setUser(readUser())
    window.addEventListener(AUTH_EVENT, sync)
    return () => window.removeEventListener(AUTH_EVENT, sync)
  }, [])

  const login = useCallback((type: 'a' | 'b') => {
    localStorage.setItem(STORAGE_KEY, USERS[type])
    window.dispatchEvent(new Event(AUTH_EVENT))
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new Event(AUTH_EVENT))
  }, [])

  return { user, loading, login, signOut }
}
