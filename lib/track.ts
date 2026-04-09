import { getOrCreateSessionId } from './session'
import { EventType } from './supabase'

export async function trackEvent(eventType: EventType, stepNumber?: number) {
  const sessionId = getOrCreateSessionId()
  try {
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        event_type: eventType,
        step_number: stepNumber ?? null,
        timestamp: new Date().toISOString(),
      }),
    })
  } catch {
    // Non-critical: silently fail tracking
  }
}
