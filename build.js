await Bun.build({
    entrypoints: ["./src/main.ts"],
    outdir: "./out",
    target: "browser",
    format: "esm",
    minify: {
        whitespace: true,
        identifiers: true,
        syntax: true,
    },
    naming: "[dir]/[name]-[hash].[ext]",
});
