import { useId } from 'react'

// The ContactRef mark: a constellation of contact nodes tracing a "C" —
// the same artwork as src/app/icon.svg. Keep the two in sync.
export default function LogoMark({ className }: { className?: string }) {
  const id = useId()
  const stroke = `${id}-stroke`
  const glow = `${id}-glow`

  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient
          id={stroke}
          x1="0"
          y1="0"
          x2="64"
          y2="64"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#c026d3" />
        </linearGradient>
        <radialGradient id={glow} cx="0.5" cy="0.32" r="0.8">
          <stop offset="0" stopColor="#7c3aed" stopOpacity="0.38" />
          <stop offset="1" stopColor="#7c3aed" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="1" y="1" width="62" height="62" rx="15" fill="#100e17" />
      <rect x="1" y="1" width="62" height="62" rx="15" fill={`url(#${glow})`} />
      <rect
        x="1.5"
        y="1.5"
        width="61"
        height="61"
        rx="14.5"
        fill="none"
        stroke={`url(#${stroke})`}
        strokeOpacity="0.45"
      />
      <path
        d="M41 21.3 26.1 19.3 18 32l8.1 12.7 14.9-2"
        fill="none"
        stroke={`url(#${stroke})`}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
      <circle cx="41" cy="21.3" r="6.5" fill="#a78bfa" opacity="0.22" />
      <circle cx="41" cy="42.7" r="6.5" fill="#d946ef" opacity="0.22" />
      <circle cx="41" cy="21.3" r="3.1" fill="#c4b5fd" />
      <circle cx="26.1" cy="19.3" r="2.3" fill="#a78bfa" />
      <circle cx="18" cy="32" r="2.6" fill="#8b5cf6" />
      <circle cx="26.1" cy="44.7" r="2.3" fill="#a855f7" />
      <circle cx="41" cy="42.7" r="3.1" fill="#e879f9" />
    </svg>
  )
}
