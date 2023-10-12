/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
    base: "/water_melon_game/",
    test: {
        coverage: {
            all: true,
        },
        include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    },
});
