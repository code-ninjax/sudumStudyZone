import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#15803d',
          dark: '#16a34a',
        },
        accent: {
          light: '#22c55e',
          dark: '#4ade80',
        },
        background: {
          light: '#ffffff',
          dark: '#0f172a',
        },
        subtle: {
          light: '#f9fafb',
          dark: '#1e293b',
        },
        text: {
          light: '#0f172a',
          dark: '#f8fafc',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
