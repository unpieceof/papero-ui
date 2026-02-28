'use client'

import { useCallback, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useStamps() {
  const [animatingStamp, setAnimatingStamp] = useState<string | null>(null)
  const supabase = createClient()

  const toggleStamp = useCallback(async (paperId: string, userId: string) => {
    // Check if stamp already exists
    const { data: existing } = await supabase
      .from('stamps')
      .select('id')
      .eq('paper_id', paperId)
      .eq('user_id', userId)
      .single()

    if (existing) {
      // Remove stamp
      await supabase
        .from('stamps')
        .delete()
        .eq('id', existing.id)
      return false
    } else {
      // Add stamp
      await supabase
        .from('stamps')
        .insert({ paper_id: paperId, user_id: userId })
      setAnimatingStamp(`${paperId}-${userId}`)
      setTimeout(() => setAnimatingStamp(null), 400)
      return true
    }
  }, [supabase])

  return { toggleStamp, animatingStamp }
}
