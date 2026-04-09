'use client'

import { useEffect, useState } from 'react'

interface AdminData {
  totalSessions: number
  totalStarted: number
  totalCompleted: number
  completionRate: number
  events: {
    id: number
    session_id: string
    event_type: string
    step_number: number | null
    timestamp: string
  }[]
}

export default function AdminPage() {
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin')
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error)
        setData(d)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-400 text-sm">Loading…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-red-500 text-sm">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-12 font-sans">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        <div>
          <h1 className="text-3xl font-semibold text-stone-800">Bridge — Admin</h1>
          <p className="text-stone-400 text-sm mt-1">Usage overview · Unlisted page</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Sessions" value={data?.totalSessions ?? 0} />
          <StatCard label="Started" value={data?.totalStarted ?? 0} />
          <StatCard label="Completed" value={data?.totalCompleted ?? 0} />
          <StatCard label="Completion Rate" value={`${data?.completionRate ?? 0}%`} />
        </div>

        {/* Event log */}
        <div>
          <h2 className="text-lg font-semibold text-stone-700 mb-4">Event Log</h2>
          <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-stone-400 uppercase tracking-wide border-b border-stone-100">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">Step</th>
                  <th className="px-4 py-3">Session ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {data?.events.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-stone-400">
                      No events yet.
                    </td>
                  </tr>
                ) : (
                  data?.events.map((e) => (
                    <tr key={e.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-4 py-3 text-stone-500 whitespace-nowrap">
                        {new Date(e.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <EventBadge type={e.event_type} />
                      </td>
                      <td className="px-4 py-3 text-stone-500">
                        {e.step_number ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-stone-400 font-mono text-xs">
                        {e.session_id.slice(0, 8)}…
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 px-5 py-5 flex flex-col gap-1">
      <p className="text-xs text-stone-400 uppercase tracking-wide font-medium">{label}</p>
      <p className="text-3xl font-semibold text-stone-800">{value}</p>
    </div>
  )
}

function EventBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    exercise_started: 'bg-amber-50 text-amber-700',
    step_completed: 'bg-blue-50 text-blue-700',
    exercise_completed: 'bg-green-50 text-green-700',
  }
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${colors[type] ?? 'bg-stone-100 text-stone-600'}`}>
      {type}
    </span>
  )
}
