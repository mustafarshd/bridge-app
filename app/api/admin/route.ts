import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: events, error } = await getSupabaseAdmin()
      .from('events')
      .select('*')
      .order('timestamp', { ascending: false })

    if (error) throw error

    const sessions = new Set(events?.map((e) => e.session_id) ?? [])
    const startedSessions = new Set(
      events?.filter((e) => e.event_type === 'exercise_started').map((e) => e.session_id) ?? []
    )
    const completedSessions = new Set(
      events?.filter((e) => e.event_type === 'exercise_completed').map((e) => e.session_id) ?? []
    )

    const totalStarted = startedSessions.size
    const totalCompleted = completedSessions.size
    const completionRate = totalStarted > 0 ? Math.round((totalCompleted / totalStarted) * 100) : 0

    return NextResponse.json({
      totalSessions: sessions.size,
      totalStarted,
      totalCompleted,
      completionRate,
      events: events ?? [],
    })
  } catch (err) {
    console.error('Admin fetch error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
