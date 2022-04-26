module.exports = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: [process.env.NEXT_PUBLIC_LIGHT_THEME_NAME, process.env.NEXT_PUBLIC_DARK_THEME_NAME],
  },
};
