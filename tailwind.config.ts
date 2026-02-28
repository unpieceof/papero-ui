import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Instrument Serif', 'serif'],
        sans: ['Noto Sans KR', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg: 'var(--bg)',
        'bg-card': 'var(--bg-card)',
        ink: 'var(--ink)',
        'ink-light': 'var(--ink-light)',
        'ink-faint': 'var(--ink-faint)',
        border: 'var(--border)',
        'border-dark': 'var(--border-dark)',
        accent: 'var(--accent)',
        'stamp-a': 'var(--stamp-a)',
        'stamp-b': 'var(--stamp-b)',
      },
      borderRadius: {
        card: 'var(--radius)',
      },
      keyframes: {
        stampIn: {
          '0%': { transform: 'scale(0) rotate(-30deg)', opacity: '0' },
          '60%': { transform: 'scale(1.3) rotate(5deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        cardIn: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        modalIn: {
          from: { transform: 'translateY(20px) scale(0.96)', opacity: '0' },
          to: { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
        skeletonPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'stamp-in': 'stampIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'card-in': 'cardIn 0.5s ease forwards',
        pulse: 'pulse 2s infinite',
        'modal-in': 'modalIn 0.3s ease',
        'skeleton-pulse': 'skeletonPulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
