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
        fourth: '#FDDA0D', // yellow
        fifth: '#ffa345', // golden yellow
        text: '#FFFFFF', //white
        error: '#FF3131',
        success: '#98FB98',
        neutral: '#899499',
        metal: '#C0C0C0',
        darkGreen: '#097969',
        purple: {
          1: '#3c1d8a',
        },
        gray: '#8A8E91',
      },
      backgroundImage: {
        'radial-custom': 'radial-gradient(125% 125% at 50% 10%, #ffa500 40%, #ffff00 100%)',
        'radial-dark': 'radial-gradient(125% 125% at 50% 10%, #000 40%, #63e 100%)',
        'black-hole': 'url("https://i.imgur.com/So8ytLh.png")',
        'starfield': 'url("https://i.imgur.com/76SAN8D.gif")'
      },
      animation:{
        'shake': 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
        'shake' : {
          '10%, 90%': {
              transform: 'translate3d(-1px, 0, 0)'
          },
          '20%, 80%' : {
              transform: 'translate3d(2px, 0, 0)'
          },
          '30%, 50%, 70%': {
              transform: 'translate3d(-4px, 0, 0)'
          },
          '40%, 60%': {
              transform: 'translate3d(4px, 0, 0)'
          }
        }
      },
    },
  },
  plugins: [],
};

