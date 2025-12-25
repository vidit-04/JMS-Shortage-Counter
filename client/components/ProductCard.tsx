import { Product, ProductStatus } from "@shared/api";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  onStatusChange: (productId: string, status: ProductStatus) => Promise<void>;
  onDelete: (productId: string) => Promise<void>;
  onConfirmDelete: (productId: string) => Promise<void>;
  isLoading?: boolean;
}

const statusConfigs: Record<ProductStatus, { color: string; label: string; dotColor: string }> = {
  pending: {
    color: "bg-status-pending text-status-pending-fg",
    label: "Pending",
    dotColor: "bg-status-pending",
  },
  ordered: {
    color: "bg-status-ordered text-status-ordered-fg",
    label: "Ordered",
    dotColor: "bg-status-ordered",
  },
  delivered: {
    color: "bg-status-delivered text-status-delivered-fg",
    label: "Delivered",
    dotColor: "bg-status-delivered",
  },
};

export default function ProductCard({
  product,
  onStatusChange,
  onDelete,
  onConfirmDelete,
  isLoading = false,
}: ProductCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusClick = async (status: ProductStatus) => {
    if (status === "delivered") {
      setShowDeleteConfirm(true);
    } else {
      setIsUpdating(true);
      try {
        await onStatusChange(product._id, status);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleConfirmDelete = async () => {
    setIsUpdating(true);
    try {
      await onConfirmDelete(product._id);
      setShowDeleteConfirm(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const currentStatus = statusConfigs[product.status];

  return (
    <div className="bg-white rounded-lg border border-border p-4 mb-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground break-words">{product.name}</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(product.createdAt).toLocaleDateString()}
          </p>
        </div>
        {product.status === "delivered" ? null : (
          <button
            onClick={() => onDelete(product._id)}
            disabled={isLoading || isUpdating}
            className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            title="Delete product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {showDeleteConfirm ? (
        <div className="bg-background border border-border rounded-lg p-4 mb-3">
          <p className="text-sm font-medium text-foreground mb-3">
            Confirm delivery? This will remove the product.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleConfirmDelete}
              disabled={isUpdating}
              className="flex-1 px-3 py-2 bg-status-delivered text-status-delivered-fg rounded-lg font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isUpdating ? "..." : "Yes, Delivered"}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isUpdating}
              className="flex-1 px-3 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(statusConfigs).map(([status, config]) => (
            <button
              key={status}
              onClick={() => handleStatusClick(status as ProductStatus)}
              disabled={isLoading || isUpdating}
              className={`py-3 px-2 rounded-lg font-medium transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                product.status === status
                  ? `${config.color} shadow-md scale-105`
                  : `bg-secondary text-secondary-foreground hover:opacity-90`
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className={`w-4 h-4 rounded-full ${config.dotColor}`} />
              <span className="text-xs font-semibold">{config.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
