/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
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
        'neon-cyan': '0 0 15px rgba(0, 240, 255, 0.4)',
        'neon-cyan-lg': '0 0 30px rgba(0, 240, 255, 0.3), inset 0 0 15px rgba(0, 240, 255, 0.1)',
        'neon-panel': '0 0 25px rgba(0, 240, 255, 0.15)',
        'neon-purple': '0 0 20px rgba(168, 85, 247, 0.3)',
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};

