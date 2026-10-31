/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vault: {
          black: '#0a0a0c',
          panel: '#121216',
          'panel-light': '#1c1c22',
          yellow: '#facc15',
          'yellow-light': '#fde047',
          gold: '#eab308',
          'gold-dark': '#ca8a04',
          amber: '#f59e0b',
        },
        cyber: {
          bg: '#080d1a',
          panel: '#0f172a',
          'panel-light': '#1e293b',
          cyan: '#00f0ff',
          'cyan-dark': '#0891b2',
          neon: '#00ffcc',
          purple: '#a855f7',
          pink: '#f43f5e',
          amber: '#f59e0b',
        },
      },
      boxShadow: {
        'neon-gold': '0 0 18px rgba(250, 204, 21, 0.45)',
        'neon-gold-lg': '0 0 35px rgba(250, 204, 21, 0.35), 0 0 15px rgba(234, 179, 8, 0.2)',
        'vault-panel': '0 10px 40px -10px rgba(0, 0, 0, 0.85), 0 0 25px rgba(245, 158, 11, 0.25)',
        'neon-cyan': '0 0 15px rgba(0, 240, 255, 0.4)',
        'neon-cyan-lg': '0 0 30px rgba(0, 240, 255, 0.3), inset 0 0 15px rgba(0, 240, 255, 0.1)',
        'neon-panel': '0 0 25px rgba(0, 240, 255, 0.15)',
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
