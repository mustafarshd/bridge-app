'use client'

export default function StepFour() {
  const handleClose = () => {
    window.close()
  }

  return (
    <div
      className="flex flex-col items-center justify-between h-dvh w-full px-6 py-10"
      style={{ background: '#f3ebe0' }}
    >
      <div />

      <div className="flex flex-col items-center gap-6 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: '#221509' }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <p
          className="text-2xl font-semibold leading-snug max-w-xs"
          style={{ color: '#221509' }}
        >
          You know what you&apos;re doing next.
        </p>

        <p
          className="text-base font-medium leading-relaxed max-w-xs"
          style={{ color: 'rgba(34,21,9,0.7)' }}
        >
          Close this and go.
        </p>
      </div>

      <button
        onClick={handleClose}
        className="w-full max-w-xs py-4 rounded-2xl text-base font-semibold active:scale-95 transition-transform duration-150"
        style={{ background: '#221509', color: '#f3ebe0' }}
      >
        Let&apos;s go
      </button>
    </div>
  )
}
