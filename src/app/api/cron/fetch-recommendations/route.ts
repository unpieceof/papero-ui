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

  try {
    // Fetch recommendations from external API
    const response = await fetch(apiUrl, {
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      throw new Error(`API responded with ${response.status}`)
    }

    const data = await response.json()

    // Expected format: { recommendations: [...] }
    const recommendations = data.recommendations || data

    if (!Array.isArray(recommendations) || recommendations.length === 0) {
      return NextResponse.json({ message: 'No recommendations received' }, { status: 200 })
    }

    const today = new Date().toISOString().split('T')[0]

    // Map and insert recommendations
    const rows = recommendations.map((rec: Record<string, unknown>, idx: number) => ({
      title: rec.title || 'Untitled',
      authors: rec.authors || [],
      year: rec.year || null,
      arxiv_url: rec.arxiv_url || null,
      pdf_url: rec.pdf_url || null,
      category: rec.category || null,
      tags: rec.tags || [],
      rec_type: rec.rec_type || 'classic',
      summary_ko: rec.summary_ko || '',
      why_read: rec.why_read || '',
      difficulty: rec.difficulty || 3,
      difficulty_label: rec.difficulty_label || '보통',
      read_time_min: rec.read_time_min || null,
      display_order: rec.display_order ?? idx,
      source: rec.source || null,
      score: rec.score || null,
      reading_order_tip: rec.reading_order_tip || null,
      fetched_date: today,
    }))

    const { error } = await supabase
      .from('recommendations')
      .insert(rows)

    if (error) {
      throw error
    }

    return NextResponse.json({
      message: `Inserted ${rows.length} recommendations`,
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
