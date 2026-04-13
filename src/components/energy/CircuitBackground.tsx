"use client";

export function CircuitBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden opacity-20 pointer-events-none">
      <svg className="w-full h-full text-ws-accent-blue" xmlns="http://www.w3.org/2000/svg">
        <title>Circuit pattern background</title>
        <pattern
          id="circuit-pattern"
          x="0"
          y="0"
          width="100"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 10 10 L 90 10 L 90 90 L 10 90 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />
          <circle cx="10" cy="10" r="2" fill="currentColor" />
          <circle cx="90" cy="10" r="2" fill="currentColor" />
          <circle cx="90" cy="90" r="2" fill="currentColor" />
          <circle cx="10" cy="90" r="2" fill="currentColor" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
      </svg>

      {/* Animated Glow effect */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ws-accent-blue/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ws-accent-amber/10 blur-[120px] rounded-full animate-pulse delay-700" />
    </div>
  );
}
