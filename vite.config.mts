import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    plugins: [react(), tailwindcss()],
    define: {
      "process.env.API_KEY": JSON.stringify(env.GEMINI_API_KEY),
      "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
    publicDir: "public",
    build: {
      target: "esnext",
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom"],
            vendor: ["react-router-dom"],
          },
        },
      },
    },
    optimizeDeps: {
      include: ["react", "react-dom", "react-router-dom"],
    },
  };
});
