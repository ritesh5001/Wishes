/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#FFF6EB',
          100: '#FFECD6',
          200: '#FFD4A8',
          300: '#FFBC7A',
          400: '#FFA44D',
          500: '#FF9933',
          600: '#E68A2E',
          700: '#CC7A29',
          800: '#A86422',
          900: '#854F1B',
        },
        success: '#16a34a',
        warning: '#ffb366',
        danger: '#ef4444',
      },
      boxShadow: {
        soft: '0 10px 30px -10px rgba(15, 23, 42, 0.25)',
      },
    },
  },
  plugins: [],
};
