'use client'

import { useState } from 'react'
import PulsingCircle from '@/components/PulsingCircle'
import StepOne from '@/components/StepOne'
import SpeechStep from '@/components/SpeechStep'
import StepFour from '@/components/StepFour'
import { trackEvent } from '@/lib/track'

type Screen = 'home' | 'step1' | 'step2' | 'step3' | 'step4'

export default function Home() {
  const [screen, setScreen] = useState<Screen>('home')

  const goTo = (next: Screen) => setScreen(next)

  const handleStart = () => {
    trackEvent('exercise_started')
    goTo('step1')
  }

  const handleStep1Done = () => {
    trackEvent('step_completed', 1)
    goTo('step2')
  }

  const handleStep2Done = () => {
    trackEvent('step_completed', 2)
    goTo('step3')
  }

  const handleStep3Done = () => {
    trackEvent('step_completed', 3)
    trackEvent('exercise_completed')
    goTo('step4')
  }

  return (
    <main
      className="relative h-dvh w-full max-w-[430px] mx-auto overflow-hidden"
      style={{ background: '#F5DBC8' }}
    >
      <Fade visible={screen === 'home'}>
        <HomeScreen onStart={handleStart} />
      </Fade>
      <Fade visible={screen === 'step1'}>
        <StepOne onComplete={handleStep1Done} />
      </Fade>
      <Fade visible={screen === 'step2'}>
        {screen === 'step2' && (
          <SpeechStep
            stepNumber={2}
            totalSteps={4}
            heading="Describe how you're feeling out loud."
            onComplete={handleStep2Done}
          />
        )}
      </Fade>
      <Fade visible={screen === 'step3'}>
        {screen === 'step3' && (
          <SpeechStep
            stepNumber={3}
            totalSteps={4}
            heading="Say out loud what you have to do next."
            onComplete={handleStep3Done}
          />
        )}
      </Fade>
      <Fade visible={screen === 'step4'}>
        <StepFour />
      </Fade>
    </main>
  )
}

function Fade({ visible, children }: { visible: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`absolute inset-0 transition-opacity duration-300 ${
        visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {children}
    </div>
  )
}

function HomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div
      className="relative flex flex-col items-center justify-between h-dvh w-full px-6 py-14 overflow-hidden"
      style={{ background: '#F5DBC8' }}
    >
      <PulsingCircle />

      <div className="relative z-10 flex flex-col items-center gap-2 text-center pt-6">
        <h1 className="text-5xl font-semibold tracking-tight" style={{ color: '#221509' }}>
          Bridge
        </h1>
        <p className="text-base font-light max-w-[220px] leading-relaxed" style={{ color: 'rgba(34,21,9,0.6)' }}>
          A short exercise to shift your state and get moving.
        </p>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-4 w-full">
        <p className="text-sm text-center" style={{ color: 'rgba(34,21,9,0.45)' }}>
          About 2 minutes. No account needed.
        </p>
        <button
          onClick={onStart}
          className="w-full max-w-xs py-4 rounded-2xl text-base font-semibold active:scale-95 transition-transform duration-150"
          style={{ background: '#F16C13', color: '#fff' }}
        >
          Start
        </button>
      </div>
    </div>
  )
}
