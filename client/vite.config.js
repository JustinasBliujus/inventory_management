import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import process from "process";

export default defineConfig({
  plugins: [react()],
  ssr: {
    external: ["pg-hstore"], 
  },
  server: {
    port: parseInt(process.env.VITE_PORT),
  },
});