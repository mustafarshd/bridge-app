'use client'

import { useEffect, useRef, useState } from 'react'
import PulsingCircle from '@/components/PulsingCircle'

interface StepOneProps {
  onComplete: () => void
}

const MOVEMENT_THRESHOLD = 0.9
type Status = 'needs-permission' | 'listening' | 'unsupported' | 'denied'

export default function StepOne({ onComplete }: StepOneProps) {
  const [status, setStatus] = useState<Status>('listening')
  const [countdown, setCountdown] = useState(5)
  const handlerRef = useRef<((e: DeviceMotionEvent) => void) | null>(null)
  const scoreRef = useRef(0)

  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const ready = countdown === 0

  const startListening = () => {
    const handler = (e: DeviceMotionEvent) => {
      const a = e.acceleration
      const ag = e.accelerationIncludingGravity
      let mag = 0
      if (a && (a.x !== null || a.y !== null || a.z !== null)) {
        mag = Math.sqrt((a.x ?? 0) ** 2 + (a.y ?? 0) ** 2 + (a.z ?? 0) ** 2)
      } else if (ag) {
        const raw = Math.sqrt((ag.x ?? 0) ** 2 + (ag.y ?? 0) ** 2 + (ag.z ?? 0) ** 2)
        mag = Math.abs(raw - 9.81)
      }
      if (mag > MOVEMENT_THRESHOLD) scoreRef.current += 1
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
      if (result === 'granted') startListening()
      else setStatus('denied')
    } catch {
      setStatus('denied')
    }
  }

  return (
    <div
      className="relative flex flex-col items-center justify-between h-dvh w-full px-6 py-14 overflow-hidden"
      style={{ background: '#F5DBC8' }}
    >
      <PulsingCircle />

      <div className="relative z-10 flex flex-col items-center gap-3 text-center pt-6">
        <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'rgba(34,21,9,0.45)' }}>
          Step 1 of 4
        </p>
        <h1 className="text-3xl font-semibold leading-snug max-w-xs" style={{ color: '#221509' }}>
          Shift your state. Walk around for a bit.
        </h1>
        <p className="text-base" style={{ color: 'rgba(34,21,9,0.6)' }}>
          Come back when you&apos;re ready.
        </p>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-3 w-full max-w-xs">
        {status === 'needs-permission' ? (
          <button
            onClick={requestPermission}
            className="w-full py-4 rounded-2xl text-base font-semibold"
            style={{ background: '#F16C13', color: '#fff' }}
          >
            Allow motion sensor
          </button>
        ) : (
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
            {ready ? "I'm up" : `I'm up in ${countdown}`}
          </button>
        )}
      </div>
    </div>
  )
}
