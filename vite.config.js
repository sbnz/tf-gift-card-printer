import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/tf-gift-card-printer",
  plugins: [react()],
});
