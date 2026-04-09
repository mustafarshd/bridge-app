'use client'

import { useState } from 'react'

interface SpeechStepProps {
  stepNumber: number
  totalSteps: number
  heading: string
  buttonLabel: string
  onComplete: () => void
}

export default function SpeechStep({
  stepNumber,
  totalSteps,
  heading,
  onComplete,
}: SpeechStepProps) {
  const [listening, setListening] = useState(false)
  const [pressed, setPressed] = useState(false)

  const handlePointerDown = () => {
    setPressed(true)
    setListening(true)
  }

  const handlePointerUp = () => {
    setPressed(false)
    setListening(false)
    onComplete()
  }

  const handlePointerLeave = () => {
    if (pressed) handlePointerUp()
  }

  return (
    <div
      className="relative flex flex-col items-center h-dvh w-full overflow-hidden"
      style={{ background: '#f3ebe0' }}
    >
      {/* Glow ellipse */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden
      >
        <div
          className="w-[566px] h-[566px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(212,85,21,0.22) 0%, rgba(243,235,224,0) 68%)',
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 flex flex-col items-center text-center px-5 pt-20 gap-3">
        <p
          className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: 'rgba(34,21,9,0.45)' }}
        >
          Step {stepNumber} of {totalSteps}
        </p>
        <h1
          className="font-semibold leading-tight"
          style={{ color: '#221509', fontSize: 36 }}
        >
          {heading}
        </h1>
      </div>

      {/* Subtitle */}
      <p
        className="relative z-10 text-center font-medium text-base px-10 mt-4 leading-relaxed"
        style={{ color: 'rgba(34,21,9,0.8)' }}
      >
        {listening
          ? 'Keep going…'
          : 'Hold on to the button to start talking. Let it go when you\u2019re done.'}
      </p>

      {/* 3D Hold button */}
      <div className="absolute bottom-24 flex flex-col items-center">
        <button
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          className="relative select-none touch-none outline-none"
          style={{ width: 230, height: 230 }}
          aria-label={listening ? 'Release when done' : 'Hold to speak'}
        >
          {/* Back shadow layer */}
          <div
            className="absolute rounded-full"
            style={{
              width: 220,
              height: 220,
              left: 5,
              top: pressed ? 14 : 18,
              background: '#8B3208',
              filter: 'blur(3px)',
              opacity: 0.7,
              transition: 'top 80ms ease',
            }}
          />
          {/* Front face */}
          <div
            className="absolute inset-0 rounded-full flex items-center justify-center"
            style={{
              transform: pressed ? 'translateY(6px)' : 'translateY(0)',
              background:
                'radial-gradient(circle at 38% 32%, #F08040 0%, #D45010 55%, #B03808 100%)',
              boxShadow: pressed
                ? '0 2px 10px rgba(0,0,0,0.25)'
                : '0 10px 28px rgba(0,0,0,0.22)',
              transition: 'transform 80ms ease, box-shadow 80ms ease',
            }}
          >
            <span
              className="font-semibold text-white text-xl select-none text-center leading-tight"
              style={{ letterSpacing: '-0.01em' }}
            >
              {listening ? 'Listening…' : 'Hold to Speak'}
            </span>
          </div>
        </button>
      </div>
    </div>
  )
}
