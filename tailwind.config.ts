import type { Config } from "tailwindcss";

/**
 * Tailwind v4: design tokens live in `app/globals.css` (@theme).
 * This file anchors content scanning and keeps the path in `components.json`.
 */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
} satisfies Config;

export default config;
