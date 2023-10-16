/// <reference types="vitest" />
import { defineConfig } from "vite";
import wasmPack from "vite-plugin-wasm-pack";

export default defineConfig({
    base: "/water_melon_game/",
    plugins: [wasmPack("./wasm-lib")],
    test: {
        coverage: {
            all: true,
            reporter: ["json"],
        },
        include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    },
});
