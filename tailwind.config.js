/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#00e5ff',
          light: '#67f0ff',
          dark: '#0090b8',
          50: '#e6fbff',
          100: '#c6f5ff',
          200: '#96ecff',
          300: '#5ee1ff',
          400: '#00e5ff',
          500: '#00cceb',
          600: '#00a8c9',
          700: '#0086a6',
          800: '#00637c',
          900: '#00485a'
        },
        violetx: {
          400: '#a78bfa',
          500: '#7c5cff',
          600: '#5b3fd6',
          700: '#4833a8'
        },
        mintx: {
          400: '#2ee6a8',
          500: '#10b981'
        },
        dark: {
          900: '#0b0d1e',
          800: '#0f1127',
          700: '#151838',
          600: '#1e2240',
          500: '#2a2f52'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif']
      },
      borderRadius: {
        '4xl': '2rem'
      },
      boxShadow: {
        card: '0 4px 20px rgba(0, 0, 0, 0.4)',
        hover: '0 8px 30px rgba(0, 229, 255, 0.25)',
        glow: '0 0 40px rgba(0, 229, 255, 0.30)',
        glowv: '0 0 40px rgba(124, 92, 255, 0.30)'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
}
