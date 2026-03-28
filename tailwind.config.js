export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
      },
      colors: {
        football: {
          accent: 'var(--color-accent)',
          'accent-hover': 'var(--color-accent-hover)',
          primary: 'var(--bg-primary)',
          card: 'var(--bg-card)',
          input: 'var(--bg-input)',
          subtle: 'var(--border-color)',
          text: 'var(--text-primary)',
          'text-secondary': 'var(--text-secondary)',
          'text-input': 'var(--text-input)',
          
          // Legacy mappings to keep existing code working where possible, 
          // though refactoring to semantic names is better.
          orange: '#FF6B35', 
          dark: '#0A0A0A',
          success: '#22C55E',
          danger: '#EF4444', 
          white: '#FFFFFF',
        }
      }
    },
  },
  plugins: [],
}

