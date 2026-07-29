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
        primary: {
          DEFAULT: '#4F7CFF',
          50: '#F4F7FF',
          100: '#E8EFFF',
          200: '#D1E0FF',
          300: '#A3C2FF',
          400: '#75A3FF',
          500: '#4F7CFF',
          600: '#2659ED',
          700: '#1944C6',
          800: '#1637A0',
          900: '#16307F',
        },
        brand: {
          50: '#F4F7FF',
          100: '#E8EFFF',
          200: '#D1E0FF',
          300: '#A3C2FF',
          400: '#75A3FF',
          500: '#4F7CFF',
          600: '#2659ED',
          700: '#1944C6',
          800: '#1637A0',
          900: '#16307F',
          950: '#0F2056',
        },
        secondary: {
          DEFAULT: '#8B5CF6',
          50: '#F5F3FF',
          100: '#EDE9FE',
          500: '#8B5CF6',
          600: '#7C3AED',
        },
        accent: {
          DEFAULT: '#38BDF8',
          50: '#F0F9FF',
          500: '#38BDF8',
        },
        softbg: '#F8FAFC',
        emerald: {
          500: '#22C55E',
          600: '#16A34A',
        },
        coral: {
          DEFAULT: '#EF4444',
          500: '#EF4444',
          600: '#DC2626',
        },
        darkslate: '#1E293B',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
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
