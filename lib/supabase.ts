import { createClient, SupabaseClient } from '@supabase/supabase-js'

export type EventType = 'exercise_started' | 'step_completed' | 'exercise_completed'

export interface BridgeEvent {
  id?: number
  session_id: string
  event_type: EventType
  step_number?: number | null
  timestamp: string
}

let _supabase: SupabaseClient | null = null
let _supabaseAdmin: SupabaseClient | null = null

function getSupabaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
  return url
}

// Public client — used for inserts (anon key, safe for browser)
export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!anonKey) throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY')
    _supabase = createClient(getSupabaseUrl(), anonKey)
  }
  return _supabase
}

// Server-only admin client — bypasses RLS for admin reads
export function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    const serviceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!serviceKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
    _supabaseAdmin = createClient(getSupabaseUrl(), serviceKey)
  }
  return _supabaseAdmin
}
