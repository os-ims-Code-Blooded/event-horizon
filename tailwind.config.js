/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './client/**/*.html',
    './client/**/*.js',
    './client/**/*.jsx',
    './client/**/*.ts',
    './client/**/*.tsx',
  ],
  darkMode: 'selector',
  theme: {
    extend: {
      backgroundImage: {
        'gradient1': 'linear-gradient(180deg, rgba(12,19,79,1) 0%, rgba(29,38,125,1) 39%, rgba(92,70,156,1) 78%, rgba(137,134,140,1) 100%)',
        // 'spaceship': "url('/event-horizon.png')",
        'gold': 'linear-gradient(45deg, rgba(174,134,37,1) 6%, rgba(247,239,138,1) 31%, rgba(210,172,71,1) 49%, rgba(247,239,138,1) 68%, rgba(210,172,71,1) 84%, rgba(237,201,103,1) 100%)',
      },
      colors: {
        purple: {
          1: '#3c1d8a'
        },
        gray: '#8A8E91'

      }

    },
  },
  plugins: [],
}