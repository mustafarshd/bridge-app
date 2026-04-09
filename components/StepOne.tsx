'use client'

import { useEffect, useRef, useState } from 'react'

interface StepOneProps {
  onComplete: () => void
}

// Accumulated samples above threshold needed to unlock
const MOVEMENT_GOAL = 300

// m/s² — magnitude of net acceleration that counts as "moving"
const MOVEMENT_THRESHOLD = 0.9

type Status = 'needs-permission' | 'listening' | 'unsupported' | 'denied'

export default function StepOne({ onComplete }: StepOneProps) {
  const [score, setScore] = useState(0)
  const [status, setStatus] = useState<Status>('listening')
  const scoreRef = useRef(0)
  const handlerRef = useRef<((e: DeviceMotionEvent) => void) | null>(null)

  const done = score >= MOVEMENT_GOAL
  const progress = Math.min((score / MOVEMENT_GOAL) * 100, 100)
  const circumference = 2 * Math.PI * 48

  const startListening = () => {
    const handler = (e: DeviceMotionEvent) => {
      const a = e.acceleration
      const ag = e.accelerationIncludingGravity
      let mag = 0

      if (a && (a.x !== null || a.y !== null || a.z !== null)) {
        mag = Math.sqrt((a.x ?? 0) ** 2 + (a.y ?? 0) ** 2 + (a.z ?? 0) ** 2)
      } else if (ag) {
        // Subtract resting gravity magnitude to get net movement
        const raw = Math.sqrt((ag.x ?? 0) ** 2 + (ag.y ?? 0) ** 2 + (ag.z ?? 0) ** 2)
        mag = Math.abs(raw - 9.81)
      }

      if (mag > MOVEMENT_THRESHOLD) {
        const next = Math.min(scoreRef.current + 1, MOVEMENT_GOAL)
        scoreRef.current = next
        setScore(next)
      }
    }

    handlerRef.current = handler
    window.addEventListener('devicemotion', handler)
    setStatus('listening')
  }

  useEffect(() => {
    if (typeof window === 'undefined' || typeof DeviceMotionEvent === 'undefined') {
      setStatus('unsupported')
      return
    }

    type DME = typeof DeviceMotionEvent & { requestPermission?: () => Promise<string> }
    if (typeof (DeviceMotionEvent as DME).requestPermission === 'function') {
      // iOS 13+ — must be triggered by a user gesture, show a prompt first
      setStatus('needs-permission')
    } else {
      startListening()
    }

    return () => {
      if (handlerRef.current) window.removeEventListener('devicemotion', handlerRef.current)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const requestPermission = async () => {
    type DME = typeof DeviceMotionEvent & { requestPermission: () => Promise<string> }
    try {
      const result = await (DeviceMotionEvent as DME).requestPermission()
      if (result === 'granted') {
        startListening()
      } else {
        setStatus('denied')
      }
    } catch {
      setStatus('denied')
    }
  }

  const canBypass = status === 'unsupported' || status === 'denied'

  return (
    <div
      className="flex flex-col items-center justify-center h-dvh w-full px-6 py-10 gap-12"
      style={{ background: '#f3ebe0' }}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <p
          className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: 'rgba(34,21,9,0.45)' }}
        >
          Step 1 of 4
        </p>
        <h1
          className="text-3xl font-semibold leading-snug max-w-xs"
          style={{ color: '#221509' }}
        >
          Shift your state. Walk around for a bit.
        </h1>
      </div>

      {status === 'needs-permission' && (
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm" style={{ color: 'rgba(34,21,9,0.6)' }}>
            This step uses your phone&apos;s motion sensor to detect when you&apos;re moving.
          </p>
          <button
            onClick={requestPermission}
            className="px-6 py-3 rounded-2xl text-base font-semibold"
            style={{ background: '#221509', color: '#f3ebe0' }}
          >
            Allow motion sensor
          </button>
        </div>
      )}

      {status === 'listening' && (
        <div className="relative flex items-center justify-center">
          <svg className="-rotate-90" width="112" height="112" viewBox="0 0 112 112">
            <circle cx="56" cy="56" r="48" fill="none" stroke="#e4d5c0" strokeWidth="6" />
            <circle
              cx="56"
              cy="56"
              r="48"
              fill="none"
              stroke={done ? '#8B3208' : '#D45010'}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (circumference * progress) / 100}
              style={{ transition: 'stroke-dashoffset 0.15s linear' }}
            />
          </svg>
          <span
            className="absolute text-4xl font-light"
            style={{ color: '#221509' }}
          >
            {done ? '✓' : <WalkIcon />}
          </span>
        </div>
      )}

      {(status === 'unsupported' || status === 'denied') && (
        <p className="text-center text-sm" style={{ color: 'rgba(34,21,9,0.6)' }}>
          {status === 'denied'
            ? 'Motion access denied. Take a moment to walk around, then tap below.'
            : 'Motion sensor not available on this device. Take a moment to walk around, then tap below.'}
        </p>
      )}

      {status !== 'needs-permission' && (
        <button
          onClick={onComplete}
          disabled={status === 'listening' && !done}
          className="w-full max-w-xs py-4 rounded-2xl text-base font-semibold transition-all duration-300"
          style={
            done || canBypass
              ? { background: '#221509', color: '#f3ebe0' }
              : { background: '#e4d5c0', color: 'rgba(34,21,9,0.4)', cursor: 'not-allowed' }
          }
        >
          I&apos;m up
        </button>
      )}
    </div>
  )
}

function WalkIcon() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 24 24"
      fill="none"
      stroke="rgba(34,21,9,0.35)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="13" cy="3.5" r="1.5" />
      <path d="M10 8.5l1.5 2.5-2 4h5" />
      <path d="M14 8.5l1.5 2-1.5 1" />
      <path d="M9.5 15l-1 4.5M14.5 15l1 4.5" />
    </svg>
  )
}
