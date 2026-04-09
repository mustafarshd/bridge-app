'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface ISpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  onresult: ((event: ISpeechRecognitionEvent) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
}

interface ISpeechRecognitionEvent {
  results: ISpeechRecognitionResultList
}

interface ISpeechRecognitionResultList {
  length: number
  [index: number]: ISpeechRecognitionResult
}

interface ISpeechRecognitionResult {
  [index: number]: ISpeechRecognitionAlternative
}

interface ISpeechRecognitionAlternative {
  transcript: string
}

declare global {
  interface Window {
    SpeechRecognition?: new () => ISpeechRecognition
    webkitSpeechRecognition?: new () => ISpeechRecognition
  }
}

interface SpeechStepProps {
  stepNumber: number
  totalSteps: number
  heading: string
  buttonLabel: string
  onComplete: (transcript: string) => void
}

export default function SpeechStep({
  stepNumber,
  totalSteps,
  heading,
  onComplete,
}: SpeechStepProps) {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [pressed, setPressed] = useState(false)
  const recognitionRef = useRef<ISpeechRecognition | null>(null)
  const transcriptRef = useRef('')

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setListening(false)
  }, [])

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      alert('Speech recognition is not supported in this browser. Try Chrome.')
      return
    }

    transcriptRef.current = ''
    setTranscript('')

    const recognition = new SR()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event: ISpeechRecognitionEvent) => {
      let full = ''
      for (let i = 0; i < event.results.length; i++) {
        full += event.results[i][0].transcript
      }
      transcriptRef.current = full
      setTranscript(full)
    }

    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setListening(true)
  }, [])

  useEffect(() => {
    return () => { recognitionRef.current?.stop() }
  }, [])

  const handlePointerDown = () => {
    setPressed(true)
    startListening()
  }

  const handlePointerUp = () => {
    setPressed(false)
    stopListening()
    if (transcriptRef.current.trim().length > 0) {
      onComplete(transcriptRef.current)
    }
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
        <p className="text-xs font-semibold tracking-widest uppercase text-[rgba(34,21,9,0.45)]">
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
        Hold on to the button to start talking. Let it go to put your words out
        into the world.
      </p>

      {/* Transcript */}
      {transcript && (
        <div className="relative z-10 mx-6 mt-6 w-[calc(100%-3rem)] rounded-2xl bg-white/50 px-5 py-4">
          <p
            className="text-base leading-relaxed"
            style={{ color: '#221509' }}
          >
            {transcript}
          </p>
        </div>
      )}

      {!transcript && listening && (
        <p
          className="relative z-10 mt-6 text-sm font-medium"
          style={{ color: 'rgba(34,21,9,0.5)' }}
        >
          Listening…
        </p>
      )}

      {/* 3D Hold button */}
      <div className="absolute bottom-24 flex flex-col items-center">
        <button
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          className="relative select-none touch-none outline-none"
          style={{ width: 230, height: 230 }}
          aria-label={listening ? 'Release to submit' : 'Hold to speak'}
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
