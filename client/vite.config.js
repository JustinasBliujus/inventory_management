import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  ssr: {
    external: ["pg-hstore"],
    preview: {
    host: true,
    allowedHosts: [
      'abundant-exploration-production.up.railway.app',
      'localhost'
    ]
  },
  },
});
