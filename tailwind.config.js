/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './client/**/*.html',
    // './client/**/*.js',
    './client/**/*.jsx',
    './client/**/*.tsx',
    './node_modules/react-toastify/dist/ReactToastify.css',
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'xs': '100px',
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      backgroundColor: ['cbMode'],
      colors: {
        primary: '#080942',
        secondary: '#472151',
        third: '#371c69', // faded purple
        fourth: '#FDDA0D', // yellow
        fifth: '#ffa345', // golden yellow
        text: '#000000',
        darkText: '#FFFFFF', //white
        error: '#FF3131',
        success: '#98FB98',
        neutral: '#899499',
        metal: '#C0C0C0',
        darkGreen: '#097969',
        darkCbBg: '#0F52BA',
        purple: {
          1: '#3c1d8a',
        },
        gray: '#8A8E91',
      },
      backgroundImage: {
        'radial-custom': 'radial-gradient(125% 125% at 50% 10%, #ffa500 40%, #ffff00 100%)',
        'radial-dark': 'radial-gradient(125% 125% at 50% 10%, #000 40%, #63e 100%)',
        'black-hole': 'url("https://i.imgur.com/So8ytLh.png")',
        'starfield': 'url("https://i.imgur.com/76SAN8D.gif")',
        'starfield-light': 'url("https://i.imgur.com/DeaAAKn.gif")',
        'logo-light': 'url("https://i.imgur.com/oM3zj2J.png")',
        'logo-dark': 'url("https://i.imgur.com/e5Tmg4r.png")',
        'starboard': 'url("https://i.imgur.com/9AZQe2Y.gif")'
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

