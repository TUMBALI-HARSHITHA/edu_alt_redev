/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './pages/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'Inter', 'sans-serif'],
        sora: ['Poppins', 'Sora', 'sans-serif'],
        heading: ['Poppins', 'Sora', 'sans-serif'],
        display: ['Poppins', 'Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        georgia: ['Georgia', 'serif'],
        bitcount: ['"Bitcount Prop Single"', 'cursive', 'sans-serif'],
      },
      fontSize: {
        '4xl': ['2rem', { lineHeight: '2.25rem' }],
        '5xl': ['2.75rem', { lineHeight: '1.1' }],
        '6xl': ['3.375rem', { lineHeight: '1.1' }],
        '7xl': ['4.125rem', { lineHeight: '1' }],
        '8xl': ['5.25rem', { lineHeight: '1' }],
      },
      colors: {
        bg: 'rgba(var(--bg-rgb), <alpha-value>)',
        'bg-secondary': 'rgba(var(--bg-secondary-rgb), <alpha-value>)',
        surface: 'rgba(var(--surface-rgb), <alpha-value>)',
        'surface-2': 'rgba(var(--surface-2-rgb), <alpha-value>)',
        text: 'rgba(var(--text-rgb), <alpha-value>)',
        'text-secondary': 'rgba(var(--text-secondary-rgb), <alpha-value>)',
        'text-muted': 'rgba(var(--text-muted-rgb), <alpha-value>)',
        heading: 'rgba(var(--heading-rgb), <alpha-value>)',
        border: 'rgba(var(--border-rgb), <alpha-value>)',
        primary: 'rgba(var(--primary-rgb), <alpha-value>)',
        'primary-hover': 'rgba(var(--primary-hover-rgb), <alpha-value>)',
        accent: 'rgba(var(--accent-rgb), <alpha-value>)',
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          900: '#14532d',
        }
      }
    }
  },
  plugins: [],
}
