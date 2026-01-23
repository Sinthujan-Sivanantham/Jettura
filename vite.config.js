import path from "path"
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api-gds": {
        target: "https://test.api.amadeus.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-gds/, ""),
        secure: false,      // Ignoriert SSL-Warnungen (hilft manchmal bei Proxy-Fehlern)
        timeout: 20000,     // 20 Sekunden Timeout, da Amadeus Test API langsam sein kann
      },
      "/api-travel": {
        target: "https://api.travelpayouts.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-travel/, ""),
      },
      "/api-duffel": {
        target: "https://api.duffel.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-duffel/, ""),
      },
      "/api-aviasales": {
        target: "https://tickets-api.travelpayouts.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-aviasales/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    // Erzwingt die korrekte Auflösung der Mapbox-Module
    include: ["react-map-gl/mapbox", "mapbox-gl"],
  },
  build: {
    chunkSizeWarningLimit: 1000, // Erhöht Warnlimit auf 1000 kB (Default 500)
    rollupOptions: {
      output: {
        manualChunks: {
          mapbox: ["mapbox-gl"],
          framer: ["framer-motion"],
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
})