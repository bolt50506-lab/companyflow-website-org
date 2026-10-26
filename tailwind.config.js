/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          muted: 'rgb(var(--ink) / 0.62)',
          dim: 'rgb(var(--ink) / 0.36)',
        },
        bg: {
          DEFAULT: 'rgb(var(--bg) / <alpha-value>)',
          surface: 'rgb(var(--bg-surface) / <alpha-value>)',
          surface2: 'rgb(var(--bg-surface2) / <alpha-value>)',
        },
        burgundy: {
          DEFAULT: '#7c1f2e',
          light: 'rgb(var(--burg-l) / <alpha-value>)',
          dark: '#5c1620',
        },
        /* text that sits on top of burgundy fills: always light, in both themes */
        onburg: '#fff7f4',
        line: {
          DEFAULT: 'rgb(var(--line) / 0.1)',
          strong: 'rgb(var(--line) / 0.15)',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Inter Tight"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in': 'fadeIn 0.6s ease forwards',
        'slide-up': 'slideUp 1.2s cubic-bezier(0.16,1,0.3,1) forwards',
        marquee: 'marquee 40s linear infinite',
        'spin-slow': 'spin 20s linear infinite',
        blink: 'blink 1.8s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'drop-in': 'dropIn .28s cubic-bezier(0.16,1,0.3,1) both',
        'menu-in': 'menuIn .55s cubic-bezier(0.16,1,0.3,1) both',
        'wps-float': 'wpsFloat 3.4s ease-in-out infinite',
        'wps-pulse': 'wpsPulse 1.8s ease-in-out infinite',
        'wps-needle': 'wpsNeedle 3.6s ease-in-out infinite alternate',
        'wps-shuffle': 'wpsShuffle 4s ease-in-out infinite',
        'wps-blink': 'wpsBlink 1s steps(2,end) infinite',
        'wps-tick': 'wpsTick 2.2s steps(7,end) infinite',
        'wps-draw': 'wpsDraw 4.6s ease-in-out infinite',
        'wps-wobble': 'wpsWobble 2.4s ease-in-out infinite',
        'wps-cursor': 'wpsCursor 4.8s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(108%)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        dropIn: {
          from: { opacity: '0', transform: 'translateY(-8px) scale(0.97)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        menuIn: {
          from: { opacity: '0', transform: 'translateY(26px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
