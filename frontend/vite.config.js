import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite is the build tool that runs our React app in development
// and bundles it into optimized files for production.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
