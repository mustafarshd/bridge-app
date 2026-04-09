'use client'

interface StepFourProps {
  intention: string
  onRestart: () => void
}

export default function StepFour({ intention, onRestart }: StepFourProps) {
  return (
    <div className="flex flex-col items-center justify-between h-dvh w-full px-6 py-10">
      <div />

      <div className="flex flex-col items-center gap-8 text-center">
        <div className="w-16 h-16 rounded-full bg-stone-800 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-stone-500 text-sm font-medium tracking-wide uppercase">Your next move</p>
          <blockquote className="text-2xl font-semibold text-stone-800 leading-snug max-w-xs italic">
            &ldquo;{intention}&rdquo;
          </blockquote>
        </div>

        <p className="text-stone-600 text-lg font-medium leading-relaxed max-w-xs">
          You know what you&apos;re doing next.<br />
          Close this and go.
        </p>
      </div>

      <button
        onClick={onRestart}
        className="w-full max-w-xs py-4 rounded-2xl bg-stone-800 text-stone-50 text-base font-semibold active:scale-95 transition-transform duration-150"
      >
        Let&apos;s go
      </button>
    </div>
  )
}
