import { Tag, Product } from "@shared/api";
import { X } from "lucide-react";
import { useState } from "react";
import TagGrid from "./TagGrid";
import { productNameExists } from "../utils/search";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  tags: Tag[];
  products: Product[];
  onAdd: (name: string, tagId: string | null, status: string) => Promise<void>;
  isLoading?: boolean;
}

export default function AddProductModal({
  isOpen,
  onClose,
  tags,
  products,
  onAdd,
  isLoading = false,
}: AddProductModalProps) {
  const [name, setName] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("pending");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!name.trim()) {
      setError("Product name is required");
      return;
    }

    if (productNameExists(products, name)) {
      setError("Product already exists");
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd(name, selectedTag, selectedStatus);
      // Reset form
      setName("");
      setSelectedTag(null);
      setSelectedStatus("pending");
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to add product"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const tagOptions = [
    { id: "null", label: "All" },
    ...tags.map((tag) => ({ id: tag._id, label: tag.name })),
  ];

  const statusOptions = [
    { id: "pending", label: "Pending" },
    { id: "ordered", label: "Ordered" },
    { id: "delivered", label: "Delivered" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4 sm:p-0">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:w-full sm:max-w-md max-h-[90vh] overflow-y-auto sm:shadow-lg">
        <div className="sticky top-0 bg-white border-b border-border p-4 sm:p-6 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Add Product
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting || isLoading}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Product Name Input */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Product Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting || isLoading}
              placeholder="e.g., Rice, Milk, Bread..."
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 text-foreground placeholder-muted-foreground"
              autoFocus
            />
          </div>

          {/* Tag Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Category / Supplier
            </label>
            <TagGrid
              options={tagOptions}
              selected={selectedTag}
              onSelect={setSelectedTag}
              columns={2}
            />
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Initial Status
            </label>
            <TagGrid
              options={statusOptions}
              selected={selectedStatus}
              onSelect={setSelectedStatus}
              columns={3}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isLoading || !name.trim()}
            className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting || isLoading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
