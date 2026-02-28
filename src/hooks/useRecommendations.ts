'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Recommendation } from '@/lib/supabase/types'

function getWeekRange(offset: number = 0) {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek

  const monday = new Date(now)
  monday.setDate(now.getDate() + mondayOffset + offset * 7)
  monday.setHours(0, 0, 0, 0)

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)

  return {
    start: monday.toISOString().split('T')[0],
    end: sunday.toISOString().split('T')[0],
    label: formatWeekLabel(monday, sunday),
  }
}

function formatWeekLabel(monday: Date, sunday: Date) {
  const mStr = `${monday.getMonth() + 1}/${monday.getDate()}`
  const sStr = `${sunday.getMonth() + 1}/${sunday.getDate()}`
  return `${monday.getFullYear()}년 ${mStr} — ${sStr}`
}

export function useRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [weekOffset, setWeekOffset] = useState(0)
  const supabase = createClient()

  const week = useMemo(() => getWeekRange(weekOffset), [weekOffset])

  const fetchRecommendations = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('recommendations')
      .select('*')
      .gte('fetched_date', week.start)
      .lte('fetched_date', week.end)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching recommendations:', error)
      setLoading(false)
      return
    }
    setRecommendations(data || [])
    setLoading(false)
  }, [supabase, week.start, week.end])

  useEffect(() => {
    fetchRecommendations()
  }, [fetchRecommendations])

  const classics = useMemo(
    () => recommendations.filter(r => r.rec_type === 'classic'),
    [recommendations]
  )
  const trending = useMemo(
    () => recommendations.filter(r => r.rec_type === 'trending'),
    [recommendations]
  )

  const readingOrderTip = useMemo(
    () => recommendations.find(r => r.reading_order_tip)?.reading_order_tip || null,
    [recommendations]
  )

  const goToPrevWeek = useCallback(() => setWeekOffset(prev => prev - 1), [])
  const goToNextWeek = useCallback(() => setWeekOffset(prev => prev + 1), [])
  const goToCurrentWeek = useCallback(() => setWeekOffset(0), [])

  return {
    recommendations,
    classics,
    trending,
    readingOrderTip,
    loading,
    week,
    weekOffset,
    goToPrevWeek,
    goToNextWeek,
    goToCurrentWeek,
    refetch: fetchRecommendations,
  }
}
