import { useEffect, useState } from "react";
import { Tag, Product } from "@shared/api";
import { tagsAPI, productsAPI } from "../services/api";
import { searchProducts } from "../utils/search";
import AddProductModal from "../components/AddProductModal";
import TagManagement from "../components/TagManagement";
import ProductCard from "../components/ProductCard";
import { Plus, Settings, Info, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [tags, setTags] = useState<Tag[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isTagManagementOpen, setIsTagManagementOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load tags and products
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      setIsLoadingTags(true);
      setIsLoadingProducts(true);

      const [loadedTags, loadedProducts] = await Promise.all([
        tagsAPI.getAll(),
        productsAPI.getAll(),
      ]);

      setTags(loadedTags);
      setProducts(loadedProducts);
      // Select "All" by default
      setSelectedTagId(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load data"
      );
    } finally {
      setIsLoadingTags(false);
      setIsLoadingProducts(false);
    }
  };

  const handleAddProduct = async (
    name: string,
    tagId: string | null,
    status: string
  ) => {
    try {
      await productsAPI.create(name, tagId === "null" ? null : tagId, status);
      await loadData();
    } catch (err) {
      throw err;
    }
  };

  const handleCreateTag = async (name: string) => {
    try {
      await tagsAPI.create(name);
      await loadData();
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteTag = async (id: string) => {
    try {
      await tagsAPI.delete(id);
      await loadData();
      if (selectedTagId === id) {
        setSelectedTagId(null);
      }
    } catch (err) {
      throw err;
    }
  };

  const handleStatusChange = async (productId: string, status: string) => {
    try {
      setError(null);
      await productsAPI.updateStatus(productId, status);
      await loadData();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to update status";
      console.error("Status change error:", err);
      setError(errorMsg);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      setError(null);
      await productsAPI.delete(productId);
      await loadData();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete product";
      console.error("Delete error:", err);
      setError(errorMsg);
    }
  };

  const handleConfirmDeliver = async (productId: string) => {
    try {
      setError(null);
      await productsAPI.delete(productId);
      await loadData();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to confirm delivery";
      console.error("Delivery confirmation error:", err);
      setError(errorMsg);
    }
  };

  // Filter products based on selected tag and search query
  let displayedProducts = products;
  if (selectedTagId !== null) {
    displayedProducts = products.filter((p) => p.tagId === selectedTagId);
  }

  if (searchQuery.trim()) {
    displayedProducts = searchProducts(displayedProducts, searchQuery);
  }

  // Sort tags by product count (descending)
  const tagCountMap = new Map<string | null, number>();
  products.forEach((product) => {
    const count = (tagCountMap.get(product.tagId) || 0) + 1;
    tagCountMap.set(product.tagId, count);
  });

  const sortedTags = [...tags].sort(
    (a, b) =>
      (tagCountMap.get(b._id) || 0) - (tagCountMap.get(a._id) || 0)
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              JMS Shortage Counter
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTagManagementOpen(true)}
                className="p-2 sm:p-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-muted transition-colors flex items-center gap-2 text-sm sm:text-base"
                title="Manage categories"
              >
                <Settings className="w-5 h-5" />
                <span className="hidden sm:inline">Categories</span>
              </button>
              <button
                onClick={() => navigate("/about")}
                className="p-2 sm:p-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-muted transition-colors flex items-center gap-2 text-sm sm:text-base"
                title="About"
              >
                <Info className="w-5 h-5" />
                <span className="hidden sm:inline">About</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground"
            />
          </div>
        </div>

        {/* Horizontal Tag Bar */}
        <div className="border-t border-border bg-white overflow-x-auto sticky">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 flex gap-2 py-3 min-w-min sm:min-w-fit">
            {/* All tag */}
            <button
              onClick={() => {
                setSelectedTagId(null);
                setSearchQuery("");
              }}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all whitespace-nowrap ${
                selectedTagId === null
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              All ({products.length})
            </button>

            {/* Category tags */}
            {sortedTags.map((tag) => {
              const count = tagCountMap.get(tag._id) || 0;
              return (
                <button
                  key={tag._id}
                  onClick={() => {
                    setSelectedTagId(tag._id);
                    setSearchQuery("");
                  }}
                  className={`px-4 py-2 rounded-full font-medium text-sm transition-all whitespace-nowrap ${
                    selectedTagId === tag._id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-secondary text-secondary-foreground hover:bg-muted"
                  }`}
                >
                  {tag.name} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6">
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive p-4 rounded-lg mb-6">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 text-sm underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {isLoadingProducts && !products.length ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-4">👍</p>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No shortage in this category
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery.trim()
                ? "No products match your search."
                : "All products are stocked!"}
            </p>
            {searchQuery.trim() && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-muted transition-colors text-sm font-medium"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteProduct}
                onConfirmDelete={handleConfirmDeliver}
                isLoading={isLoadingProducts}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Add Product Button (Mobile) */}
      <button
        onClick={() => setIsAddProductOpen(true)}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-16 h-16 sm:w-14 sm:h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all scale-100 hover:scale-110 flex items-center justify-center text-2xl sm:text-xl"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        tags={tags}
        products={products}
        onAdd={handleAddProduct}
        isLoading={isLoadingProducts}
      />

      {/* Tag Management Modal */}
      <TagManagement
        isOpen={isTagManagementOpen}
        onClose={() => setIsTagManagementOpen(false)}
        tags={tags}
        onCreateTag={handleCreateTag}
        onDeleteTag={handleDeleteTag}
        isLoading={isLoadingTags}
      />
    </div>
  );
}
