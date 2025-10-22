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
          50: '#eef6ff',
          100: '#d9eaff',
          200: '#b2d4ff',
          300: '#80b6ff',
          400: '#4d8eff',
          500: '#1f5fff',
          600: '#1447db',
          700: '#1237ab',
          800: '#132f84',
          900: '#122963',
        },
        success: '#16a34a',
        warning: '#f97316',
        danger: '#ef4444',
      },
      boxShadow: {
        soft: '0 10px 30px -10px rgba(15, 23, 42, 0.25)',
      },
    },
  },
  plugins: [],
};
