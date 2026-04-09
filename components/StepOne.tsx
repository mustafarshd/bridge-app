'use client'

import { useEffect, useState } from 'react'

interface StepOneProps {
  onComplete: () => void
}

const COUNTDOWN = 20

export default function StepOne({ onComplete }: StepOneProps) {
  const [seconds, setSeconds] = useState(COUNTDOWN)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (seconds <= 0) {
      setDone(true)
      return
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seconds])

  const progress = ((COUNTDOWN - seconds) / COUNTDOWN) * 100
  const circumference = 2 * Math.PI * 48

  return (
    <div className="flex flex-col items-center justify-center h-dvh w-full px-6 py-10 gap-12">
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-xs font-semibold tracking-widest uppercase text-stone-400">Step 1 of 4</p>
        <h1 className="text-3xl font-semibold text-stone-800 leading-snug max-w-xs">
          Shift your state. Walk around for a bit.
        </h1>
      </div>

      <div className="relative flex items-center justify-center">
        <svg className="-rotate-90" width="112" height="112" viewBox="0 0 112 112">
          <circle
            cx="56"
            cy="56"
            r="48"
            fill="none"
            stroke="#e7e5e0"
            strokeWidth="6"
          />
          <circle
            cx="56"
            cy="56"
            r="48"
            fill="none"
            stroke={done ? '#a67c52' : '#c9a87c'}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (circumference * progress) / 100}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <span className="absolute text-4xl font-light text-stone-700 tabular-nums">
          {done ? '✓' : seconds}
        </span>
      </div>

      <button
        onClick={onComplete}
        disabled={!done}
        className={`w-full max-w-xs py-4 rounded-2xl text-base font-semibold transition-all duration-300 ${
          done
            ? 'bg-stone-800 text-stone-50 active:scale-95'
            : 'bg-stone-200 text-stone-400 cursor-not-allowed'
        }`}
      >
        I&apos;m up
      </button>
    </div>
  )
}
