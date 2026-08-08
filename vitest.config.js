import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";
var stdin_default = defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      thresholds: {
        statements: 80,
        branches: 70,
        functions: 80,
        lines: 80
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./components"),
      "@pages": path.resolve(__dirname, "./pages"),
      "@lib": path.resolve(__dirname, "./lib"),
      "@data": path.resolve(__dirname, "./data")
    }
  }
});
export {
  stdin_default as default
};
