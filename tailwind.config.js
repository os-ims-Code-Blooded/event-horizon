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
        'gradientlight': 'linear-gradient(164deg, rgba(98,112,161,1) 0%, rgba(208,173,63,1) 28%, rgba(164,55,26,1) 77%, rgba(74,42,105,1) 100%)',
      },
    },
  },
  plugins: [],
}