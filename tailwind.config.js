/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        surfaceDark: "var(--color-surface-dark)",
        textMain: "var(--color-text)",
        textMuted: "var(--color-muted)",
        accent: "var(--color-accent)",
        accentSoft: "var(--color-accent-soft)",
        accentGold: "var(--color-accent-gold)",
        borderLight: "var(--color-border)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "var(--font-heading)", "Be Vietnam Pro", "Plus Jakarta Sans", "sans-serif"],
        heading: ["var(--font-heading)", "var(--font-sans)", "Plus Jakarta Sans", "Be Vietnam Pro", "sans-serif"],
        couple: ["var(--font-couple)", "var(--font-cursive)", "Alex Brush", "Great Vibes", "cursive"],
        serif: ["var(--font-heading)", "var(--font-sans)", "Plus Jakarta Sans", "Be Vietnam Pro", "sans-serif"],
        playfair: ["var(--font-heading)", "var(--font-sans)", "Plus Jakarta Sans", "sans-serif"],
        cormorant: ["var(--font-heading)", "var(--font-sans)", "Plus Jakarta Sans", "sans-serif"],
        cursive: ["var(--font-cursive)", "var(--font-couple)", "Great Vibes", "Alex Brush", "cursive"],
      },
      animation: {
        "fade-in": "fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-up": "fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-slow": "pulseSlow 3s ease-in-out infinite",
        "spin-slow": "spin 12s linear infinite",
        "float": "float 4s ease-in-out infinite",
        "shimmer": "shimmer 2.5s infinite linear",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.03)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
