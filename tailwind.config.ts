import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta corporativa Sinagoga Torat Moshe, extraída del logo
        'torat-moshe': {
          navy: '#28598F',   // azul marino — corazón, texto, elementos primarios
          gray: '#A7ACAE',   // gris — libro, elementos secundarios
          'navy-dark': '#1D4270',
          'navy-light': '#3E71AB',
        },
      },
    },
  },
  plugins: [],
};

export default config;
