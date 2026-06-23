/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: '#070707',
        surface: '#0f0f0f',
        elevated: '#161616',
        border: { DEFAULT: '#1e1e1e', subtle: '#141414' },
        accent: { DEFAULT: '#818cf8', hover: '#a78bfa', dim: '#818cf820' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      animation: {
        'shimmer': 'shimmer 1.5s ease infinite',
        'float': 'float 4s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } },
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(129,140,248,0.15)',
        'glow': '0 0 20px rgba(129,140,248,0.15)',
        'glow-lg': '0 0 40px rgba(129,140,248,0.2)',
      },
    },
  },
  plugins: [],
};
