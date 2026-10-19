import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2E7D32",
          dark: "#1B5E20",
          light: "#388E3C",
          hover: "#256628",
        },
        accent: {
          DEFAULT: "#66BB6A",
          light: "#81C784",
          dark: "#4CAF50",
        },
        surface: {
          DEFAULT: "#E8F5E9",
          tint: "#C8E6C9",
          dark: "#1A2E1C",
        },
        sky: {
          DEFAULT: "#4FC3F7",
          light: "#B3E5FC",
          dark: "#0288D1",
        },
        sand: {
          DEFAULT: "#F5EBD7",
          light: "#FAF4E9",
          dark: "#E8DAC2",
        },
        alert: {
          DEFAULT: "#E53935",
          light: "#FFEBEE",
          dark: "#C62828",
        },
        progress: {
          DEFAULT: "#FB8C00",
          light: "#FFF3E0",
          dark: "#EF6C00",
        },
        cleaned: {
          DEFAULT: "#2E7D32",
          light: "#E8F5E9",
          dark: "#1B5E20",
        },
      },
      fontFamily: {
        sans: ["var(--font-nunito)", "Nunito", "sans-serif"],
        heading: ["var(--font-poppins)", "Poppins", "sans-serif"],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(46, 125, 50, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'float': '0 12px 32px -4px rgba(46, 125, 50, 0.16), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(3deg)' },
        },
        drift: {
          '0%': { transform: 'translateX(-5%)' },
          '50%': { transform: 'translateX(5%)' },
          '100%': { transform: 'translateX(-5%)' },
        },
        sparkle: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '50%': { transform: 'scale(1.25) rotate(180deg)', opacity: '0.8' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(102, 187, 106, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(102, 187, 106, 0.8)' },
        }
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        drift: 'drift 20s ease-in-out infinite',
        sparkle: 'sparkle 2s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};
export default config;
