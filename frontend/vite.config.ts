import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    optimizeDeps: {
        include: ["react", "react-dom"],
    },
    plugins: [react()],
    css: {
        postcss: "./postcss.config.cjs",
    },
});
