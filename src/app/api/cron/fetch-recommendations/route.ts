import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check feature flag
  if (process.env.ENABLE_RECOMMENDATIONS !== 'true') {
    return NextResponse.json({ message: 'Recommendations disabled' }, { status: 200 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const apiUrl = process.env.RECOMMENDATION_API_URL

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Missing Supabase config' }, { status: 500 })
  }

  if (!apiUrl) {
    return NextResponse.json({ error: 'Missing RECOMMENDATION_API_URL' }, { status: 500 })
  }

  // Use service_role to bypass RLS
  const supabase = createClient(supabaseUrl, serviceRoleKey)

  const DIFFICULTY_MAP: Record<string, number> = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
  }

  try {
    // Fetch from /api/today — returns { classics: [...], trending: [...], reading_order_tip: "..." }
    const response = await fetch(`${apiUrl}/api/today`, {
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      throw new Error(`API responded with ${response.status}`)
    }

    const data = await response.json()
    const readingOrderTip = data.reading_order_tip || null
    const classics: Record<string, unknown>[] = data.classics || []
    const trending: Record<string, unknown>[] = data.trending || []

    if (classics.length === 0 && trending.length === 0) {
      return NextResponse.json({ message: 'No recommendations received' }, { status: 200 })
    }

    const today = data.date || new Date().toISOString().split('T')[0]

    const mapRec = (rec: Record<string, unknown>, recType: string, idx: number) => ({
      title: rec.title || 'Untitled',
      authors: rec.authors || [],
      year: rec.year || null,
      arxiv_url: rec.arxiv_url || null,
      pdf_url: rec.pdf_url || null,
      category: rec.category || null,
      tags: rec.tags || [],
      rec_type: recType,
      summary_ko: rec.summary_ko || '',
      why_read: rec.why_read || '',
      difficulty: DIFFICULTY_MAP[rec.difficulty as string] ?? 3,
      difficulty_label: rec.difficulty_label || '보통',
      read_time_min: rec.read_time_min || null,
      display_order: (rec.order as number) ?? idx,
      source: rec.source || null,
      score: rec.score || null,
      reading_order_tip: readingOrderTip,
      fetched_date: today,
    })

    const rows = [
      ...classics.map((rec, idx) => mapRec(rec, 'classic', idx)),
      ...trending.map((rec, idx) => mapRec(rec, 'trending', classics.length + idx)),
    ]

    const { error } = await supabase
      .from('recommendations')
      .insert(rows)

    if (error) {
      throw error
    }

    return NextResponse.json({
      message: `Inserted ${rows.length} recommendations (${classics.length} classics, ${trending.length} trending)`,
      count: rows.length,
    })
  } catch (err) {
    console.error('Cron fetch-recommendations error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
