/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './client/**/*.html',
    './client/**/*.js',
    './client/**/*.jsx',
    './client/**/*.ts',
    './client/**/*.tsx',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient1': 'linear-gradient(180deg, rgba(12,19,79,1) 0%, rgba(29,38,125,1) 39%, rgba(92,70,156,1) 78%, rgba(137,134,140,1) 100%)',
        // 'spaceship': "url('/event-horizon.png')",
      },
    },
  },
  plugins: [],
}