/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      height: {
        'half': '50vh',
      },
      fontFamily: {
        plusJakarta: ['PlusJakartaSans-Regular', 'sans-serif'],
      },
      animation: {
        'spin-90': 'spin-90 0.3s ease-in-out forwards',
        'spin-0': 'spin-0 0.3s ease-in-out forwards',
      },
      keyframes: {
        'spin-90': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(-90deg)' },
        },
        'spin-0': {
          from: { transform: 'rotate(-90deg)' },
          to: { transform: 'rotate(0deg)' },
        },
      },
    },
    variants: {
      extend: {
        animation: ['hover', 'focus', 'active', 'group-hover'],
      },
    },
  },
  plugins: [],
}
