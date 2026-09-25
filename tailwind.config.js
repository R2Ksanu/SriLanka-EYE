/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        museum: {
          950: '#07090e',
          900: '#0b0f17',
          850: '#101622',
          800: '#141c2c',
          700: '#1d273c',
          600: '#2b3954',
          500: '#485876',
          400: '#7c8ba1',
          300: '#a3b1c6',
          200: '#cbd5e1',
          100: '#f1f5f9',
          50: '#f8fafc',
        },
        lanka: {
          gold: '#cfa935',
          goldLight: '#e6c764',
          goldDark: '#9b7c20',
          maroon: '#8d1b3d',
          maroonLight: '#b82d54',
          teal: '#0c7c72',
          tealLight: '#18a89b',
          sapphire: '#1e40af',
          sapphireLight: '#3b82f6',
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
