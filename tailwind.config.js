export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      colors: {
        football: {
          accent: '#FF4422', // Bright Orange-Red matching football
          orange: '#FF6B35', // Lighter orange variant
          dark: '#0A0A0A', // Deeper dark background
          card: '#1A1A1A', // Card background
          subtle: '#2A2A2A', // Subtle borders
          success: '#22C55E', // Green for positive
          danger: '#EF4444', // Red for negative
          white: '#FFFFFF', // Pure white
        }
      }
    },
  },
  plugins: [],
}

