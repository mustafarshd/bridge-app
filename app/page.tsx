'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import StepOne from '@/components/StepOne'
import SpeechStep from '@/components/SpeechStep'
import StepFour from '@/components/StepFour'
import { trackEvent } from '@/lib/track'

const RiveAnimation = dynamic(() => import('@/components/RiveAnimation'), { ssr: false })

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
    <main className="relative h-dvh w-full max-w-[430px] mx-auto overflow-hidden bg-[#faf8f5]">
      <ScreenSlide visible={screen === 'home'}>
        <HomeScreen onStart={handleStart} />
      </ScreenSlide>

      <ScreenSlide visible={screen === 'step1'}>
        <StepOne onComplete={handleStep1Done} />
      </ScreenSlide>

      <ScreenSlide visible={screen === 'step2'}>
        {screen === 'step2' && (
          <SpeechStep
            stepNumber={2}
            totalSteps={4}
            heading="Describe how you're feeling out loud."
            buttonLabel="That's how I feel"
            onComplete={handleStep2Done}
          />
        )}
      </ScreenSlide>

      <ScreenSlide visible={screen === 'step3'}>
        {screen === 'step3' && (
          <SpeechStep
            stepNumber={3}
            totalSteps={4}
            heading="Say out loud what you have to do next."
            buttonLabel="That's what I'm doing"
            onComplete={handleStep3Done}
          />
        )}
      </ScreenSlide>

      <ScreenSlide visible={screen === 'step4'}>
        <StepFour />
      </ScreenSlide>
    </main>
  )
}

function ScreenSlide({ visible, children }: { visible: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`absolute inset-0 transition-all duration-500 ease-in-out ${
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      {children}
    </div>
  )
}

function HomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-between h-dvh w-full px-6 py-14">
      <div className="flex flex-col items-center gap-2 text-center pt-6">
        <h1 className="text-5xl font-semibold text-stone-800 tracking-tight">Bridge</h1>
        <p className="text-stone-500 text-base font-light max-w-[220px] leading-relaxed">
          A short exercise to shift your state and get moving.
        </p>
      </div>

      <div className="w-full flex items-center justify-center">
        <RiveAnimation className="w-64 h-64" />
      </div>

      <div className="flex flex-col items-center gap-4 w-full">
        <p className="text-stone-400 text-sm text-center">About 2 minutes. No account needed.</p>
        <button
          onClick={onStart}
          className="w-full max-w-xs py-4 rounded-2xl bg-stone-800 text-stone-50 text-base font-semibold active:scale-95 transition-transform duration-150"
        >
          Start
        </button>
      </div>
    </div>
  )
}
