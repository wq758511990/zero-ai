import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import WindiCss from "vite-plugin-windicss";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), WindiCss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@/views": path.resolve(__dirname, "src/views"), // 将 @views 指向 src/views 目录
      "@/components": path.resolve(__dirname, "src/components"), // 其他别名
    },
  },
});
