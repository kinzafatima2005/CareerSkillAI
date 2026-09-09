/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: '#0E73B9',
          accent: '#0084E2',
          warm: '#EE6C4D',
          teal: '#18B29C',
        },
        surface: {
          bg: '#F4F7FA',
          card: '#FFFFFF',
          tint: '#EAF3FA',
          border: '#DFE6ED',
        },
        text: {
          primary: '#1A2D42',
          muted: '#738598',
        }
      },
      boxShadow: {
        card: '0 4px 12px rgba(26, 45, 66, 0.04)',
        'card-hover': '0 8px 24px rgba(26, 45, 66, 0.08)',
      }
    },
  },
  plugins: [],
}
