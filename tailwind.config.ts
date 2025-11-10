import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'poppy-cream': '#F2DFD7',
        'poppy-white': '#FEF9FF',
        'poppy-light-purple': '#D4C1EC',
        'poppy-purple': '#9F9FED',
        'poppy-dark-purple': '#736CED',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'raleway': ['Raleway', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1.25rem',
      },
      boxShadow: {
        'soft': '0 4px 15px rgba(0, 0, 0, 0.08)',
        'softer': '0 2px 8px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}
export default config
