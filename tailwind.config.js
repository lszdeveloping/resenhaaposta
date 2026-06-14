/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Dark dashboard palette
        bg: {
          DEFAULT: '#0b0f1a',
          soft: '#111827',
          card: '#161d2e',
          hover: '#1d2740',
        },
        brand: {
          DEFAULT: '#6366f1',
          dark: '#4f46e5',
          light: '#818cf8',
        },
        success: '#22c55e',
        danger: '#ef4444',
        warning: '#f59e0b',
        muted: '#94a3b8',
        line: '#243049',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
}
