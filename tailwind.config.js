/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Clash Display', 'sans-serif'],
        body: ['Satoshi', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        void: 'var(--bg-void)',
        base: 'var(--bg-base)',
        surface: 'var(--bg-surface)',
        elevated: 'var(--bg-elevated)',
        glass: 'var(--bg-glass)',
        'glass-border': 'var(--bg-glass-border)',
        green: {
          DEFAULT: 'var(--green)',
          glow: 'var(--green-glow)',
          dim: 'var(--green-dim)',
          trace: 'var(--green-trace)'
        },
        purple: {
          DEFAULT: 'var(--purple)',
          glow: 'var(--purple-glow)'
        },
        amber: {
          DEFAULT: 'var(--amber)',
          glow: 'var(--amber-glow)'
        },
        coral: 'var(--coral)',
        teal: 'var(--teal)',
        pink: 'var(--pink)',
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          green: 'var(--text-green)',
          purple: 'var(--text-purple)'
        },
        border: {
          DEFAULT: 'var(--border)',
          active: 'var(--border-active)',
          green: 'var(--border-green)'
        }
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        'glow-green': 'var(--glow-green-shadow)',
        'glow-purple': 'var(--glow-purple-shadow)',
        'glow-amber': 'var(--glow-amber-shadow)'
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        pill: 'var(--radius-pill)'
      },
      transitionTimingFunction: {
        spring: 'var(--ease-spring)',
        out: 'var(--ease-out)',
        'in-out': 'var(--ease-in-out)',
      },
      transitionDuration: {
        fast: 'var(--dur-fast)',
        base: 'var(--dur-base)',
        slow: 'var(--dur-slow)',
        xslow: 'var(--dur-xslow)'
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.4s ease-out',
        'stagger-in': 'staggerIn 0.5s ease-out both',
        'page-enter': 'pageEnter 350ms var(--ease-out) both',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 1, filter: 'brightness(1)' },
          '50%': { opacity: 0.8, filter: 'brightness(1.2)' },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        staggerIn: {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        pageEnter: {
          from: { opacity: 0, transform: 'translateY(12px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
}
