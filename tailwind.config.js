/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './client/**/*.html',
    './client/**/*.js',
    './client/**/*.jsx',
    './client/**/*.ts',
    './client/**/*.tsx',
    './node_modules/react-toastify/dist/ReactToastify.css',
  ],
  safelist: ['bg-${color}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#080942',
        secondary: '#472151',
        third: '#3c1d8a', // faded purple
        fourth: '#f2ad73', // yellow
        fifth: '#ffa345', // golden yellow
        text: '#FFFFFF', //white
        error: '#FF3131',
        purple: {
          1: '#3c1d8a',
        },
        gray: '#8A8E91',
      },
      backgroundImage: {
        'radial-custom': 'radial-gradient(125% 125% at 50% 10%, #000 40%, #63e 100%)',
      },
    },
  },
  plugins: [],
};

// normal space themes
// #3b2747
// #472151
// #624185
// #f2ad73	
// #ffa345
//
// color blind theme