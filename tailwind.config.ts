import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFDF7',
          100: '#FDF6EC',
          200: '#F5EADB',
          300: '#E8DCC8',
        },
        forest: {
          300: '#6B9E7B',
          400: '#4A8C5C',
          500: '#3D6B4F',
          600: '#2A4E38',
          700: '#1C3726',
        },
        bark: {
          200: '#A08B74',
          300: '#8B7355',
          400: '#6B5744',
          500: '#4A3728',
          600: '#2C1810',
        },
        sage: {
          200: '#C8DBC8',
          300: '#B0CCB0',
          400: '#8BAE8B',
          500: '#6B8E6B',
        },
        gold: {
          300: '#DFC070',
          400: '#D4AA4F',
          500: '#B8930B',
        },
      },
      fontFamily: {
        serif: ['var(--font-dm-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
