import { defineConfig } from "vite";
import wasmPack from "vite-plugin-wasm-pack";

export default defineConfig({
    base: "/water_melon_game/",
    plugins: [wasmPack("./wasm-lib")],
});
