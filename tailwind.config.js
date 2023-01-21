/* eslint-disable @typescript-eslint/no-var-requires */
const { fontFamily } = require('tailwindcss/defaultTheme');

function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`;
    }
    return `rgb(var(${variable}) / ${opacityValue})`;
  };
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Inter', ...fontFamily.sans],
        handwrite: ['GrandHotel', ...fontFamily.sans],
      },
      colors: {
        dark: withOpacityValue('--tw-color-dark'),
        light: withOpacityValue('--tw-color-light'),
      },
      keyframes: {
        blink: {
          '0%, 50%, 100%': {
            opacity: 1,
          },
          '25%, 75%': {
            opacity: 0,
          },
        },
      },
      animation: {
        blink: 'blink 1s ease-in infinite',
      },
    },
  },
  plugins: [],
};
