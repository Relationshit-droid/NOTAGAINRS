/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Button Gradient: #db147c → #f05d68 (Horizontal, 16px rounded)
        'primary-gradient-start': '#db147c',
        'primary-gradient-end': '#f05d68',
        
        // Avatar Outer Ring: #fcc738 → #ea031f → #c60ab3 (Circular, 60s rotation)
        'profile-ring-start': '#fcc738',
        'profile-ring-mid': '#ea031f',
        'profile-ring-end': '#c60ab3',
        
        // Progress/XP Bars: #ef1b6e → #c41e77 → #a22ac4 → #9056ef
        'progress-gradient-start': '#ef1b6e',
        'progress-gradient-mid1': '#c41e77',
        'progress-gradient-mid2': '#a22ac4',
        'progress-gradient-end': '#9056ef',
        
        // Arena Background: #1A0D2E to #3D1B5A (Vertical cosmic gradient)
        'arena-bg-start': '#1A0D2E',
        'arena-bg-end': '#3D1B5A',
        
        // Accent colors for cosmic retro arcade
        'accent-pink': '#FC0C84',
        'accent-orange': '#ff7600',
        'accent-yellow': '#ffef1f',
        'accent-teal': '#37cf97',
        'accent-violet': '#b37dec',
        'accent-rose': '#e16ba9',
        
        // UI colors with cosmic theme
        'background': '#0f0a0c',
        'surface': '#1a0a1f',
        'dark-surface': '#1a0a1f',
        'card': 'rgba(45, 25, 80, 0.7)', // Updated for cosmic retro arcade
        'text-primary': '#ffffff',
        'text-secondary': 'rgba(255, 255, 255, 0.6)',
        'text-hint': 'rgba(255, 255, 255, 0.4)',
        'border': 'rgba(255, 255, 255, 0.1)',
        'focus-outline': '#fc0c84',
        
        // Status colors
        'success': '#33DEA5',
        'warning': '#E11637',
        'error': '#E11637',
        'info': '#22d3ee',
        
        // Game category colors
        'emotional-connection': '#FA1F63',
        'conflict-resolution': '#33DEA5',
        'creative-chaos': '#E4E831',
        'romance-hub': '#BE1980',
        'healing-hospital': '#5C1459',
        'game-show': '#22d3ee',
        'love-arcade': '#FF6B6B',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      fontSize: {
        'mobile-header': '1.5rem',
        'mobile-body': '1rem',
      },
      minHeight: {
        'screen-dynamic': 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
      },
      screens: {
        'sm-mobile': {'raw': '(max-height: 667px)'},  // iPhone SE
        'md-mobile': {'raw': '(min-height: 668px) and (max-height: 896px)'},  // iPhone 8 to iPhone 11 Pro Max
        'lg-mobile': {'raw': '(min-height: 897px)'},  // iPhone 12 Pro Max and larger
      },
      // Cosmic Retro Arcade specific extensions
      backgroundImage: {
        'primary-button': 'linear-gradient(90deg, #db147c 0%, #f05d68 100%)',
        'avatar-ring': 'conic-gradient(from 0deg, #fcc738, #ea031f, #c60ab3, #fcc738)',
        'progress-bar': 'linear-gradient(90deg, #ef1b6e 0%, #c41e77 33%, #a22ac4 66%, #9056ef 100%)',
        'arena-bg': 'linear-gradient(180deg, #1A0D2E 0%, #3D1B5A 100%)',
        'cosmic-splash': 'linear-gradient(135deg, #1A0D2E 0%, #3D1B5A 50%, #db147c 100%)',
      },
      borderRadius: {
        'button': '16px',
        'card': '16px',
        'avatar': '9999px',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(219, 20, 124, 0.5), 0 0 40px rgba(240, 93, 104, 0.3)',
        'neon-soft': '0 0 15px rgba(219, 20, 124, 0.3), 0 0 30px rgba(240, 93, 104, 0.2)',
        'neon-strong': '0 0 30px rgba(219, 20, 124, 0.7), 0 0 60px rgba(240, 93, 104, 0.5)',
        'cosmic-glow': '0 0 25px rgba(252, 199, 56, 0.4), 0 0 50px rgba(234, 3, 31, 0.3)',
      },
      animation: {
        'spin-slow': 'spin 60s linear infinite',
        'pulse-neon': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'liquid-fill': 'liquidFill 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        liquidFill: {
          '0%': { transform: 'scaleY(0)' },
          '50%': { transform: 'scaleY(0.5)' },
          '100%': { transform: 'scaleY(1)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
      },
      zIndex: {
        'marcie': '9999',
        'floating': '1000',
        'header': '100',
        'modal': '50',
      },
    },
  },
  plugins: [],
}