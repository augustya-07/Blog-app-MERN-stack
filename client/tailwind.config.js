/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'serif']
      },
      colors: {
        ink: '#191715',
        paper: '#faf8f3',
        line: '#e8e0d4',
        leaf: '#287568',
        coral: '#d95f49',
        gold: '#c9892b'
      },
      boxShadow: {
        soft: '0 18px 50px rgba(25, 23, 21, 0.08)'
      }
    }
  },
  plugins: []
};
