import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Brand colors for direct use in className
        brand: {
          // Main brand colors
          teal: "#0EA5E9", // Primary teal from Acumant logo
          blue: "#2563EB", // Secondary blue
          purple: "#8B5CF6", // Accent purple
          indigo: "#4F46E5", // Deep indigo

          // Supporting colors
          cyan: "#06B6D4", // Bright cyan
          emerald: "#10B981", // Success green
          amber: "#F59E0B", // Warning amber
          rose: "#F43F5E", // Error/destructive rose
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        soft: "0 2px 10px rgba(0, 0, 0, 0.05)",
        medium: "0 4px 20px rgba(0, 0, 0, 0.08)",
        glow: "0 0 15px rgba(14, 165, 233, 0.5)",
        "glow-purple": "0 0 15px rgba(139, 92, 246, 0.5)",
        "glow-blue": "0 0 15px rgba(37, 99, 235, 0.5)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in": {
          from: { transform: "translateY(10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-500px 0" },
          "100%": { backgroundPosition: "500px 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-in": "slide-in 0.3s ease-out",
        "pulse-slow": "pulse 3s infinite",
        shimmer: "shimmer 2s infinite linear",
        float: "float 3s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-mesh": "linear-gradient(to right bottom, #0EA5E9, #2563EB, #4F46E5, #8B5CF6)",
        "gradient-mesh-soft":
          "linear-gradient(to right bottom, rgba(14, 165, 233, 0.8), rgba(37, 99, 235, 0.8), rgba(79, 70, 229, 0.8), rgba(139, 92, 246, 0.8))",
        "gradient-teal-blue": "linear-gradient(to right, #0EA5E9, #2563EB)",
        "gradient-blue-purple": "linear-gradient(to right, #2563EB, #8B5CF6)",
        "gradient-teal-purple": "linear-gradient(to right, #0EA5E9, #8B5CF6)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config

