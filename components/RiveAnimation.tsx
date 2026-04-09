'use client'

import { useRive } from '@rive-app/react-canvas'

interface RiveAnimationProps {
  src?: string
  stateMachine?: string
  className?: string
}

export default function RiveAnimation({
  src = '/animations/bridge.riv',
  stateMachine = 'State Machine 1',
  className = '',
}: RiveAnimationProps) {
  const { RiveComponent, rive } = useRive({
    src,
    stateMachines: stateMachine,
    autoplay: true,
  })

  // If no .riv file exists yet, render a calm placeholder
  if (!rive) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl bg-stone-100 ${className}`}
        aria-label="Animation placeholder"
      >
        <div className="h-24 w-24 animate-pulse rounded-full bg-stone-200" />
      </div>
    )
  }

  return <RiveComponent className={className} />
}
