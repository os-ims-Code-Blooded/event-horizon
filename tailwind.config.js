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
      'xs': '640px',
      'sm': '800px',
      // => @media (min-width: 640px) { ... }

      'md': '1000px',
      // => @media (min-width: 768px) { ... }

      'lg': '1200px',
      // => @media (min-width: 1024px) { ... }

      'xl': '15000px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1800px',
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
        'starfield-light': 'url("https://i.imgur.com/OpyaIUE.gif")',
        'logo-light': 'url("https://i.imgur.com/A457vgq.png")',
        'logo-dark': 'url("https://i.imgur.com/e5Tmg4r.png")',
        'starboard': 'url("https://i.imgur.com/9AZQe2Y.gif")',
        'starboard-light': 'url("https://i.imgur.com/0luEXCT.gif")'
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

