import { Tag, Product, ProductStatus } from "@shared/api";
import { 
  loadTags, 
  loadProducts, 
  saveTag, 
  deleteTag as deleteTagDB,
  saveProduct,
  deleteProduct as deleteProductDB,
  connectDB 
} from "./storage-mongodb";

/**
 * Database for JMS Shortage Counter with MongoDB persistence
 */

let tags: Map<string, Tag> = new Map();
let products: Map<string, Product> = new Map();
let tagIdCounter = 1;
let productIdCounter = 1;
let isLoaded = false;

/**
 * Load data from MongoDB on first use
 */
async function ensureLoaded() {
  if (isLoaded) return;
  isLoaded = true;

  try {
    // Ensure MongoDB connection
    await connectDB();
    
    tags = await loadTags();
    products = await loadProducts();

    // Calculate highest existing ID to avoid conflicts
    if (tags.size > 0) {
      tagIdCounter = Math.max(
        1,
        ...Array.from(tags.values()).map((t) => {
          const match = t._id.match(/\d+/);
          return match ? parseInt(match[0]) : 0;
        })
      ) + 1;
    }

    if (products.size > 0) {
      productIdCounter = Math.max(
        1,
        ...Array.from(products.values()).map((p) => {
          const match = p._id.match(/\d+/);
          return match ? parseInt(match[0]) : 0;
        })
      ) + 1;
    }
  } catch (error) {
    console.error("❌ Error loading data from MongoDB:", error);
  }
}

/**
 * Generate unique IDs
 */
function generateTagId(): string {
  return `tag_${tagIdCounter++}`;
}

function generateProductId(): string {
  return `product_${productIdCounter++}`;
}

/**
 * Tags operations
 */
export const tagsDB = {
  async getAll(): Promise<Tag[]> {
    await ensureLoaded();
    return Array.from(tags.values());
  },

  async getById(id: string): Promise<Tag | undefined> {
    await ensureLoaded();
    return tags.get(id);
  },

  async create(name: string): Promise<Tag> {
    await ensureLoaded();
    const id = generateTagId();
    const tag: Tag = {
      _id: id,
      name,
      createdAt: new Date().toISOString(),
    };
    tags.set(id, tag);
    await saveTag(tag); // Persist immediately to MongoDB
    return tag;
  },

  async delete(id: string): Promise<boolean> {
    await ensureLoaded();
    const deleted = tags.delete(id);
    if (deleted) {
      await deleteTagDB(id); // Delete from MongoDB
    }
    return deleted;
  },

  async update(id: string, name: string): Promise<Tag | undefined> {
    await ensureLoaded();
    const tag = tags.get(id);
    if (tag) {
      tag.name = name;
      tags.set(id, tag);
      await saveTag(tag); // Persist immediately to MongoDB
      return tag;
    }
    return undefined;
  },
};

/**
 * Products operations
 */
export const productsDB = {
  async getAll(): Promise<Product[]> {
    await ensureLoaded();
    return Array.from(products.values());
  },

  async getByTag(tagId: string | null): Promise<Product[]> {
    await ensureLoaded();
    return Array.from(products.values()).filter((p) => p.tagId === tagId);
  },

  async getById(id: string): Promise<Product | undefined> {
    await ensureLoaded();
    return products.get(id);
  },

  async getByName(name: string): Promise<Product | undefined> {
    await ensureLoaded();
    return Array.from(products.values()).find(
      (p) => p.name.toLowerCase() === name.toLowerCase()
    );
  },

  async create(name: string, tagId: string | null = null, status: ProductStatus = "pending"): Promise<Product> {
    await ensureLoaded();
    const id = generateProductId();
    const product: Product = {
      _id: id,
      name,
      tagId,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    products.set(id, product);
    await saveProduct(product); // Persist immediately to MongoDB
    return product;
  },

  async delete(id: string): Promise<boolean> {
    await ensureLoaded();
    const deleted = products.delete(id);
    if (deleted) {
      await deleteProductDB(id); // Delete from MongoDB
    }
    return deleted;
  },

  async updateStatus(id: string, status: ProductStatus): Promise<Product | undefined> {
    await ensureLoaded();
    const product = products.get(id);
    if (product) {
      product.status = status;
      product.updatedAt = new Date().toISOString();
      products.set(id, product);
      await saveProduct(product); // Persist immediately to MongoDB
      return product;
    }
    return undefined;
  },

  async updateTag(id: string, tagId: string | null): Promise<Product | undefined> {
    await ensureLoaded();
    const product = products.get(id);
    if (product) {
      product.tagId = tagId;
      product.updatedAt = new Date().toISOString();
      products.set(id, product);
      await saveProduct(product); // Persist immediately to MongoDB
      return product;
    }
    return undefined;
  },

  // When a tag is deleted, move all its products to All (tagId = null)
  async moveProductsFromTag(tagId: string): Promise<void> {
    await ensureLoaded();
    const productsToUpdate = Array.from(products.values()).filter((p) => p.tagId === tagId);
    
    for (const product of productsToUpdate) {
      product.tagId = null;
      product.updatedAt = new Date().toISOString();
      products.set(product._id, product);
      await saveProduct(product); // Persist each updated product
    }
  },
};

let isInitialized = false;

/**
 * Initialize database with demo data if empty
 * Only adds demo data on first run, not on restarts
 */
export async function initializeDB(): Promise<void> {
  if (isInitialized) return;
  isInitialized = true;

  try {
    // Ensure data is loaded from MongoDB first
    await ensureLoaded();
    console.log(`📊 Database loaded: ${tags.size} tags, ${products.size} products`);
  } catch (error) {
    console.error("❌ Error initializing database:", error);
  }
}
