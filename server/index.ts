import "dotenv/config";
import express, { ErrorRequestHandler } from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import * as tagsRoutes from "./routes/tags";
import * as productsRoutes from "./routes/products";
import { initializeDB } from "./db";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize database with demo data (async - starts in background)
  initializeDB().catch(err => console.error("Failed to initialize DB:", err));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Tags routes
  app.get("/api/tags", tagsRoutes.getTags);
  app.post("/api/tags", tagsRoutes.createTag);
  app.delete("/api/tags/:id", tagsRoutes.deleteTag);

  // Products routes
  app.get("/api/products", productsRoutes.getProducts);
  app.post("/api/products", productsRoutes.createProduct);
  app.get("/api/products/tag/:tagId", productsRoutes.getProductsByTag);
  app.get("/api/products/:id", productsRoutes.getProduct);
  app.patch("/api/products/:id", productsRoutes.updateProductStatus);
  app.delete("/api/products/:id", productsRoutes.deleteProduct);

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok", message: "Server is running" });
  });

  // 404 handler for API routes only
  // Don't return 404 for non-API routes - let Vite/other servers handle them
  app.use((req, res, next) => {
    // If it's an API request, it's a real 404
    if (req.path.startsWith("/api")) {
      res.status(404).json({ error: "API endpoint not found" });
    } else {
      // Let other middleware handle non-API requests
      next();
    }
  });

  // Error handler
  const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    console.error("🔴 Server error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: err instanceof Error ? err.message : "Unknown error",
    });
  };

  app.use(errorHandler);

  return app;
}
