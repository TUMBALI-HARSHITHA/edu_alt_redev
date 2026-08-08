import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
var stdin_default = defineConfig({
  plugins: [react()],
  define: {
    __APP_ENV__: JSON.stringify(process.env.NODE_ENV || "development")
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./components"),
      "@pages": path.resolve(__dirname, "./pages"),
      "@lib": path.resolve(__dirname, "./lib"),
      "@data": path.resolve(__dirname, "./data")
    }
  },
  build: {
    chunkSizeWarningLimit: 1e3,
    target: "esnext",
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react-dom") || id.includes("node_modules/react/") || id.includes("node_modules/react-router")) {
            return "vendor";
          }
          if (id.includes("node_modules/framer-motion")) {
            return "framer";
          }
          if (id.includes("node_modules/lucide-react")) {
            return "icons";
          }
          if (id.includes("node_modules/@supabase")) {
            return "db";
          }
          if (id.includes("lib/ai") || id.includes("AIAssistant") || id.includes("FlashcardDeck")) {
            return "ai";
          }
        }
      }
    }
  },
  server: {
    allowedHosts: ["localhost", ".edualttech.com"],
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false
      }
    }
  }
});
export {
  stdin_default as default
};
