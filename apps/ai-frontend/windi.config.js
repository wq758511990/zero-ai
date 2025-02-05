import { defineConfig } from "windicss/helpers";

export default defineConfig({
  extract: {
    include: ["src/**/*.{jsx,tsx,html,vue}"],
    exclude: ["node_modules", ".git", "dist"],
  },
  // 你可以在这里添加更多的 WindiCSS 配置
});
