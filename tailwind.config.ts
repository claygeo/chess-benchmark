import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        chess: {
          bg: '#1a1a1a',
          surface: '#2a2a2a',
          'surface-light': '#333',
          yellow: '#EAB308',
          trail: '#F1C40F',
          green: '#4CAF50',
          red: '#f44336',
          blue: '#2196F3',
          orange: '#FF9800',
        },
      },
      boxShadow: {
        'chess-card': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'chess-glow': '0 0 20px rgba(234, 179, 8, 0.5)',
      },
    },
  },
  plugins: [],
};
export default config;
