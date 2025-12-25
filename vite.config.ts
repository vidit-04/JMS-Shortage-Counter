import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: ["."],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**"],
    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve",
    configureServer(server) {
      const app = createServer();

      // Add Express middleware to handle API routes
      // This must be added BEFORE Vite's default middleware to intercept API requests
      server.middlewares.use((req, res, next) => {
        // Only handle API and health check requests
        if (req.url?.startsWith("/api") || req.url === "/api/health") {
          app(req as any, res as any, next);
        } else {
          // Let Vite handle everything else (HTML, assets, etc)
          next();
        }
      });
    },
  };
}
