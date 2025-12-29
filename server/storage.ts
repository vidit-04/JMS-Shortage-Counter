import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { Tag, Product } from "../shared/api";

const STORAGE_DIR = join(process.cwd(), ".data");
const TAGS_FILE = join(STORAGE_DIR, "tags.json");
const PRODUCTS_FILE = join(STORAGE_DIR, "products.json");

// Ensure storage directory exists
function ensureStorageDir() {
  try {
    if (!existsSync(STORAGE_DIR)) {
      console.log(`📁 Creating storage directory: ${STORAGE_DIR}`);
      mkdirSync(STORAGE_DIR, { recursive: true });
    }
  } catch (error) {
    // Silently fail if directory already exists or can't be created
  }
}

/**
 * Load tags from storage
 */
export function loadTags(): Map<string, Tag> {
  ensureStorageDir();
  try {
    if (existsSync(TAGS_FILE)) {
      const data = readFileSync(TAGS_FILE, "utf-8");
      const tags = JSON.parse(data) as Tag[];
      const map = new Map<string, Tag>();
      tags.forEach((tag) => map.set(tag._id, tag));
      console.log(`✅ Loaded ${tags.length} tags from storage`);
      return map;
    }
  } catch (error) {
    console.error("❌ Error loading tags:", error);
  }
  return new Map();
}

/**
 * Save tags to storage
 */
export function saveTags(tags: Map<string, Tag>): void {
  ensureStorageDir();
  try {
    const data = Array.from(tags.values());
    writeFileSync(TAGS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("❌ Error saving tags:", error);
  }
}

/**
 * Load products from storage
 */
export function loadProducts(): Map<string, Product> {
  ensureStorageDir();
  try {
    if (existsSync(PRODUCTS_FILE)) {
      const data = readFileSync(PRODUCTS_FILE, "utf-8");
      const products = JSON.parse(data) as Product[];
      const map = new Map<string, Product>();
      products.forEach((product) => map.set(product._id, product));
      console.log(`✅ Loaded ${products.length} products from storage`);
      return map;
    }
  } catch (error) {
    console.error("❌ Error loading products:", error);
  }
  return new Map();
}

/**
 * Save products to storage
 */
export function saveProducts(products: Map<string, Product>): void {
  ensureStorageDir();
  try {
    const data = Array.from(products.values());
    writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("❌ Error saving products:", error);
  }
}
