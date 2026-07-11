import { dark } from '@clerk/themes'
import type { Appearance } from '@clerk/types'

// Mirrors the design tokens in globals.css — keep hex values in sync.
export const clerkAppearance: Appearance = {
  baseTheme: dark,
  variables: {
    colorPrimary: '#7c3aed', // --color-primary
    colorBackground: '#14121b', // --color-surface
    colorInputBackground: '#0d0c13', // input well over surface
    colorInputText: '#f4f3f9', // --color-fg
    colorText: '#f4f3f9',
    colorTextSecondary: '#a6a1b5', // --color-fg-muted
    colorDanger: '#fb7185', // --color-danger
    colorSuccess: '#34d399',
    colorWarning: '#fbbf24',
    borderRadius: '0.625rem', // --radius-lg
    fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
  },
  elements: {
    cardBox: 'border border-edge shadow-elevated',
    card: 'bg-surface/80 backdrop-blur-xl',
    headerTitle: 'font-display font-semibold',
    formButtonPrimary:
      'bg-primary hover:bg-primary-hover shadow-glow-sm inset-shadow-highlight text-white text-sm font-medium normal-case transition-all',
    formFieldInput: 'border-edge-strong bg-black/25 focus:border-primary-bright/60',
    formFieldLabel: 'text-fg-muted',
    socialButtonsBlockButton: 'border-edge-strong bg-white/5 hover:bg-white/10 text-fg',
    dividerLine: 'bg-edge',
    dividerText: 'text-fg-subtle',
    footerActionText: 'text-fg-muted',
    footerActionLink: 'text-primary-bright hover:text-primary-bright/80',
    identityPreview: 'border-edge bg-white/[0.04]',
    userButtonPopoverCard:
      'border border-edge bg-surface-2/90 backdrop-blur-xl shadow-elevated',
  },
}
