import { defineConfig } from "vite";

export default defineConfig({
    base: "/water_melon_game/",
    test: {
        include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    },
});
