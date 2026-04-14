export default function PulsingCircle() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden
    >
      <div
        style={{
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: '#F16C13',
          filter: 'blur(72px)',
          animationName: 'pulse-glow',
          animationDuration: '2.4s',
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite',
        }}
      />
    </div>
  )
}
