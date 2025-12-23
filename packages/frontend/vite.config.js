import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        outDir: "dist",
        minify: true,
        sourcemap: false,
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                blog: resolve(__dirname, "blog.html"),
                blogDetail: resolve(__dirname, "blog-detail.html"),
                about: resolve(__dirname, "about.html"),
                newsletter: resolve(__dirname, "newsletter.html"),
            },
        },
    },
});
