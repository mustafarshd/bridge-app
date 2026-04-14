'use client'

import { useEffect, useState } from 'react'
import PulsingCircle from '@/components/PulsingCircle'

interface SpeechStepProps {
  stepNumber: number
  totalSteps: number
  heading: string
  onComplete: () => void
}

export default function SpeechStep({ stepNumber, totalSteps, heading, onComplete }: SpeechStepProps) {
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const ready = countdown === 0

  return (
    <div
      className="relative flex flex-col items-center h-dvh w-full px-6 py-10 overflow-hidden"
      style={{ background: '#F5DBC8' }}
    >
      <PulsingCircle />

      {/* Step counter — pinned to top */}
      <p className="relative z-10 text-xs font-semibold tracking-widest uppercase pt-6" style={{ color: 'rgba(34,21,9,0.45)' }}>
        Step {stepNumber} of {totalSteps}
      </p>

      {/* Centered text */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center gap-3 flex-1">
        <h1 className="font-semibold leading-tight text-[34px]" style={{ color: '#221509' }}>
          {heading}
        </h1>
        <p className="text-base" style={{ color: 'rgba(34,21,9,0.6)' }}>
          Take as much time as you need.
        </p>
      </div>

      {/* Continue button */}
      <div className="relative z-10 w-full max-w-xs flex flex-col items-center gap-2 pb-6">
        <button
          onClick={onComplete}
          disabled={!ready}
          className="w-full py-4 rounded-2xl text-base font-semibold transition-all duration-300 active:scale-95"
          style={
            ready
              ? { background: '#F16C13', color: '#fff' }
              : { background: 'rgba(241,108,19,0.25)', color: 'rgba(34,21,9,0.35)', cursor: 'not-allowed' }
          }
        >
          {ready ? 'Continue' : `Continue in ${countdown}`}
        </button>
      </div>
    </div>
  )
}
