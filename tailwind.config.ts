import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#F7E8E5',
          100: '#F0D0CA',
          200: '#E0A195',
          400: '#D06050',
          600: '#C0472A',   
          700: '#A33A21',
          800: '#7A2418',
          900: '#4F1610',
        },
        slate: {
         
        }
      },
      backgroundColor: {
        page: '#FFFFFF',
        'page-dark': '#0F172A',
      }
    },
  },
  plugins: [],
}
export default config