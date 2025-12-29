import { MongoClient, Db, Collection } from "mongodb";
import { Tag, Product } from "../shared/api";

const MONGODB_URI = process.env.MONGODB_URI || "";
const DB_NAME = "jms";

let client: MongoClient | null = null;
let db: Db | null = null;

/**
 * Connect to MongoDB
 */
export async function connectDB(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not set");
    }

    console.log("🔌 Connecting to MongoDB...");
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log("✅ Connected to MongoDB");
    
    // Create indexes
    await db.collection("tags").createIndex({ name: 1 });
    await db.collection("products").createIndex({ name: 1 });
    await db.collection("products").createIndex({ tagId: 1 });
    
    return db;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}

/**
 * Get tags collection
 */
async function getTagsCollection(): Promise<Collection<Tag>> {
  const database = await connectDB();
  return database.collection<Tag>("tags");
}

/**
 * Get products collection
 */
async function getProductsCollection(): Promise<Collection<Product>> {
  const database = await connectDB();
  return database.collection<Product>("products");
}

/**
 * Load tags from MongoDB
 */
export async function loadTags(): Promise<Map<string, Tag>> {
  try {
    const collection = await getTagsCollection();
    const tags = await collection.find({}).toArray();
    const map = new Map<string, Tag>();
    tags.forEach((tag) => map.set(tag._id, tag));
    console.log(`✅ Loaded ${tags.length} tags from MongoDB`);
    return map;
  } catch (error) {
    console.error("❌ Error loading tags from MongoDB:", error);
    return new Map();
  }
}

/**
 * Save tags to MongoDB
 */
export async function saveTags(tags: Map<string, Tag>): Promise<void> {
  try {
    const collection = await getTagsCollection();
    const tagArray = Array.from(tags.values());
    
    // Use bulk operations for efficiency
    if (tagArray.length > 0) {
      await collection.deleteMany({});
      await collection.insertMany(tagArray);
    }
  } catch (error) {
    console.error("❌ Error saving tags to MongoDB:", error);
  }
}

/**
 * Save single tag to MongoDB
 */
export async function saveTag(tag: Tag): Promise<void> {
  try {
    const collection = await getTagsCollection();
    await collection.replaceOne(
      { _id: tag._id },
      tag,
      { upsert: true }
    );
  } catch (error) {
    console.error("❌ Error saving tag to MongoDB:", error);
  }
}

/**
 * Delete tag from MongoDB
 */
export async function deleteTag(id: string): Promise<void> {
  try {
    const collection = await getTagsCollection();
    await collection.deleteOne({ _id: id });
  } catch (error) {
    console.error("❌ Error deleting tag from MongoDB:", error);
  }
}

/**
 * Load products from MongoDB
 */
export async function loadProducts(): Promise<Map<string, Product>> {
  try {
    const collection = await getProductsCollection();
    const products = await collection.find({}).toArray();
    const map = new Map<string, Product>();
    products.forEach((product) => map.set(product._id, product));
    console.log(`✅ Loaded ${products.length} products from MongoDB`);
    return map;
  } catch (error) {
    console.error("❌ Error loading products from MongoDB:", error);
    return new Map();
  }
}

/**
 * Save products to MongoDB
 */
export async function saveProducts(products: Map<string, Product>): Promise<void> {
  try {
    const collection = await getProductsCollection();
    const productArray = Array.from(products.values());
    
    // Use bulk operations for efficiency
    if (productArray.length > 0) {
      await collection.deleteMany({});
      await collection.insertMany(productArray);
    }
  } catch (error) {
    console.error("❌ Error saving products to MongoDB:", error);
  }
}

/**
 * Save single product to MongoDB
 */
export async function saveProduct(product: Product): Promise<void> {
  try {
    const collection = await getProductsCollection();
    await collection.replaceOne(
      { _id: product._id },
      product,
      { upsert: true }
    );
  } catch (error) {
    console.error("❌ Error saving product to MongoDB:", error);
  }
}

/**
 * Delete product from MongoDB
 */
export async function deleteProduct(id: string): Promise<void> {
  try {
    const collection = await getProductsCollection();
    await collection.deleteOne({ _id: id });
  } catch (error) {
    console.error("❌ Error deleting product from MongoDB:", error);
  }
}

/**
 * Close MongoDB connection
 */
export async function closeDB(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log("🔌 MongoDB connection closed");
  }
}
