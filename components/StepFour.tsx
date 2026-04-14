'use client'

import { useEffect, useState } from 'react'
import PulsingCircle from '@/components/PulsingCircle'

export default function StepFour() {
  const [countdown, setCountdown] = useState<number | null>(null)

  useEffect(() => {
    if (countdown === null) return
    if (countdown === 0) {
      window.close()
      return
    }
    const t = setTimeout(() => setCountdown((c) => (c !== null ? c - 1 : null)), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const handleClose = () => setCountdown(3)

  return (
    <div
      className="relative flex flex-col items-center h-dvh w-full px-6 py-10 overflow-hidden"
      style={{ background: '#F5DBC8' }}
    >
      <PulsingCircle />

      {/* Closing overlay */}
      {countdown !== null && (
        <div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4"
          style={{ background: 'rgba(245,219,200,0.85)', backdropFilter: 'blur(8px)' }}
        >
          <p className="text-lg font-medium" style={{ color: 'rgba(34,21,9,0.6)' }}>
            This tab is closing in
          </p>
          <span className="text-8xl font-bold" style={{ color: '#F16C13' }}>
            {countdown === 0 ? '' : countdown}
          </span>
        </div>
      )}

      <div />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center flex-1 justify-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: '#F16C13' }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <p className="text-2xl font-semibold leading-snug max-w-xs" style={{ color: '#221509' }}>
          You know what you&apos;re doing next.
        </p>

        <p className="text-base font-medium leading-relaxed max-w-xs" style={{ color: 'rgba(34,21,9,0.6)' }}>
          Close this and go.
        </p>
      </div>

      <div className="relative z-10 w-full max-w-xs pb-6">
        <button
          onClick={handleClose}
          className="w-full py-4 rounded-2xl text-base font-semibold active:scale-95 transition-transform duration-150"
          style={{ background: '#F16C13', color: '#fff' }}
        >
          Let&apos;s go
        </button>
      </div>
    </div>
  )
}
