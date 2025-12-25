import { RequestHandler } from "express";
import { productsDB } from "../db";
import {
  CreateProductRequest,
  UpdateProductRequest,
  ProductsResponse,
  ProductResponse,
  DeleteResponse,
} from "@shared/api";

export const getProducts: RequestHandler = async (_req, res) => {
  try {
    const products = await productsDB.getAll();
    const response: ProductsResponse = { products };
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const getProductsByTag: RequestHandler = async (req, res) => {
  try {
    const { tagId } = req.params;

    // Handle "all" products
    if (tagId === "all") {
      const products = await productsDB.getAll();
      const response: ProductsResponse = { products };
      res.status(200).json(response);
      return;
    }

    const products = await productsDB.getByTag(tagId === "null" ? null : tagId);
    const response: ProductsResponse = { products };
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching products by tag:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const createProduct: RequestHandler = async (req, res) => {
  try {
    const { name, tagId, status } = req.body as CreateProductRequest;

    if (!name || name.trim() === "") {
      res.status(400).json({ error: "Product name is required" });
      return;
    }

    // Check for duplicate product name
    const existing = await productsDB.getByName(name);
    if (existing) {
      res.status(409).json({ error: "Product already exists" });
      return;
    }

    const product = await productsDB.create(
      name.trim(),
      tagId || null,
      status || "pending"
    );
    const response: ProductResponse = { product };
    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

export const getProduct: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productsDB.getById(id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const response: ProductResponse = { product };
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

export const updateProductStatus: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body as UpdateProductRequest;

    if (!status || !["pending", "ordered", "delivered"].includes(status)) {
      res.status(400).json({ error: "Invalid status" });
      return;
    }

    const product = await productsDB.updateStatus(id, status);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const response: ProductResponse = { product };
    res.status(200).json(response);
  } catch (error) {
    console.error("Error updating product status:", error);
    res.status(500).json({ error: "Failed to update product status" });
  }
};

export const deleteProduct: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id.trim() === "") {
      res.status(400).json({ error: "Product ID is required" });
      return;
    }

    const product = await productsDB.getById(id);
    if (!product) {
      console.warn(`Product not found: ${id}`);
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const deleted = await productsDB.delete(id);
    if (!deleted) {
      res.status(500).json({ error: "Failed to delete product from database" });
      return;
    }

    const response: DeleteResponse = {
      success: true,
      message: "Product deleted successfully",
    };
    res.status(200).json(response);
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      error: "Failed to delete product",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
