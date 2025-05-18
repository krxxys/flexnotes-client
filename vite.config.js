import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import tailwindcss from "@tailwindcss/vite";
import typography from "@tailwindcss/typography";

export default defineConfig({
  plugins: [vue(), tailwindcss({ plugin: typography})],
});
