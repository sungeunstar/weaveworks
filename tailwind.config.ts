import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1694FF",
        black: "#000000",
        white: "#FFFFFF",
        gray: {
          100: "#F5F5F5",
          200: "#DDDDDD",
          300: "#888888",
          400: "#555555",
          500: "#333333",
          600: "#222222",
          700: "#111111",
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'Inter', 'sans-serif'],
      },
      fontSize: {
        'heading-lg': ['24px', { lineHeight: '1.4', fontWeight: '700' }],
        'heading-md': ['20px', { lineHeight: '1.4', fontWeight: '700' }],
        'heading-sm': ['18px', { lineHeight: '1.4', fontWeight: '700' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '500' }],
        'caption': ['13px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      borderRadius: {
        'input': '12px',
      },
    },
  },
  plugins: [],
};

export default config;
