/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // TheYearOfHandicrafts فقط - لا خطوط أخرى
        sans: ['TheYearOfHandicrafts'],
        'handicraft': ['TheYearOfHandicrafts'],
      },
      colors: {
        'dark-bg': '#080911',
        'glass': 'rgba(255, 255, 255, 0.1)',
        'glass-border': 'rgba(255, 255, 255, 0.2)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
        'shake': 'shake 0.4s cubic-bezier(.36,.07,.19,.97) both',
        'crack-fade': 'crack-fade 1s forwards ease-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        orbit: {
          'from': { 
            transform: 'translate(-50%, -50%) rotate(0deg) translateX(400px) rotate(0deg)' 
          },
          'to': { 
            transform: 'translate(-50%, -50%) rotate(360deg) translateX(430px) rotate(-360deg)' 
          },
        },
        shake: {
          '0%': { transform: 'translate(1px, 1px) rotate(0deg)' },
          '10%': { transform: 'translate(-2px, -1px) rotate(-0.5deg)' },
          '20%': { transform: 'translate(-3px, 0px) rotate(1deg)' },
          '30%': { transform: 'translate(3px, 2px) rotate(0deg)' },
          '40%': { transform: 'translate(1px, -1px) rotate(1deg)' },
          '50%': { transform: 'translate(-1px, 2px) rotate(-0.5deg)' },
          '60%': { transform: 'translate(-3px, 1px) rotate(0deg)' },
          '70%': { transform: 'translate(3px, 1px) rotate(-0.5deg)' },
          '80%': { transform: 'translate(-1px, -1px) rotate(1deg)' },
          '90%': { transform: 'translate(1px, 2px) rotate(0deg)' },
          '100%': { transform: 'translate(0, 0) rotate(0deg)' },
        },
        'crack-fade': {
          '0%': { opacity: '0', transform: 'scale(0.5)' },
          '5%': { opacity: '1', transform: 'scale(1)' },
          '70%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(1.1)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7', filter: 'brightness(1.2)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-inner': 'inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
        'glow': '0 0 20px rgba(255, 255, 255, 0.3)',
        'glow-strong': '0 0 40px rgba(255, 255, 255, 0.5)',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      },
      borderColor: {
        'glass': 'rgba(255, 255, 255, 0.2)',
      },
    },
  },
  plugins: [],
}