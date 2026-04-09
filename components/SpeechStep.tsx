'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// Web Speech API types not in lib.dom.d.ts for all environments
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
  buttonLabel,
  onComplete,
}: SpeechStepProps) {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [hasSpeech, setHasSpeech] = useState(false)
  const recognitionRef = useRef<ISpeechRecognition | null>(null)

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

    const recognition = new SR()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event: ISpeechRecognitionEvent) => {
      let full = ''
      for (let i = 0; i < event.results.length; i++) {
        full += event.results[i][0].transcript
      }
      setTranscript(full)
      if (full.trim().length > 0) setHasSpeech(true)
    }

    recognition.onend = () => {
      setListening(false)
    }

    recognition.onerror = () => {
      setListening(false)
    }

    recognitionRef.current = recognition
    recognition.start()
    setListening(true)
  }, [])

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
    }
  }, [])

  const toggleListening = () => {
    if (listening) {
      stopListening()
    } else {
      startListening()
    }
  }

  return (
    <div className="flex flex-col items-center justify-between h-dvh w-full px-6 py-10">
      <div className="flex flex-col items-center gap-3 text-center pt-8">
        <p className="text-xs font-semibold tracking-widest uppercase text-stone-400">
          Step {stepNumber} of {totalSteps}
        </p>
        <h1 className="text-3xl font-semibold text-stone-800 leading-snug max-w-xs">
          {heading}
        </h1>
      </div>

      <div className="flex flex-col items-center gap-8 w-full">
        {/* Transcript area */}
        <div className="w-full min-h-24 rounded-2xl bg-stone-100 px-5 py-4 flex items-start">
          {transcript ? (
            <p className="text-stone-700 text-base leading-relaxed">{transcript}</p>
          ) : (
            <p className="text-stone-400 text-base italic">
              {listening ? 'Listening…' : 'Tap the mic and speak'}
            </p>
          )}
        </div>

        {/* Mic button */}
        <button
          onClick={toggleListening}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 ${
            listening
              ? 'bg-red-100 ring-4 ring-red-300 ring-offset-2 ring-offset-stone-50'
              : 'bg-stone-800'
          }`}
          aria-label={listening ? 'Stop recording' : 'Start recording'}
        >
          {listening ? (
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500" />
            </span>
          ) : (
            <MicIcon />
          )}
        </button>
      </div>

      <button
        onClick={() => onComplete(transcript)}
        disabled={!hasSpeech}
        className={`w-full max-w-xs py-4 rounded-2xl text-base font-semibold transition-all duration-300 ${
          hasSpeech
            ? 'bg-stone-800 text-stone-50 active:scale-95'
            : 'bg-stone-200 text-stone-400 cursor-not-allowed'
        }`}
      >
        {buttonLabel}
      </button>
    </div>
  )
}

function MicIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <line x1="12" y1="17" x2="12" y2="21" />
      <line x1="9" y1="21" x2="15" y2="21" />
    </svg>
  )
}
