import { Tag } from "@shared/api";
import { Trash2, Plus, X } from "lucide-react";
import { useState } from "react";

interface TagManagementProps {
  isOpen: boolean;
  onClose: () => void;
  tags: Tag[];
  onCreateTag: (name: string) => Promise<void>;
  onDeleteTag: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export default function TagManagement({
  isOpen,
  onClose,
  tags,
  onCreateTag,
  onDeleteTag,
  isLoading = false,
}: TagManagementProps) {
  const [newTagName, setNewTagName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!newTagName.trim()) {
      setError("Tag name is required");
      return;
    }

    if (tags.some((t) => t.name.toLowerCase() === newTagName.toLowerCase())) {
      setError("Tag already exists");
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreateTag(newTagName);
      setNewTagName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create tag");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTag = async (id: string) => {
    setDeletingId(id);
    try {
      await onDeleteTag(id);
      setShowDeleteConfirm(null);
    } finally {
      setDeletingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4 sm:p-0">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:w-full sm:max-w-md max-h-[90vh] overflow-y-auto sm:shadow-lg">
        <div className="sticky top-0 bg-white border-b border-border p-4 sm:p-6 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Manage Categories
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting || isLoading || deletingId !== null}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Create Tag Form */}
          <form onSubmit={handleCreateTag} className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              Create New Category
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                disabled={isSubmitting || isLoading}
                placeholder="e.g., Groceries"
                className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 text-foreground placeholder-muted-foreground"
              />
              <button
                type="submit"
                disabled={isSubmitting || isLoading || !newTagName.trim()}
                className="px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </button>
            </div>
          </form>

          {/* Existing Tags */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Existing Categories ({tags.length})
            </label>
            {tags.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No categories yet. Create one above!
              </p>
            ) : (
              <div className="space-y-2">
                {tags.map((tag) => (
                  <div key={tag._id}>
                    {showDeleteConfirm === tag._id ? (
                      <div className="bg-background border border-border rounded-lg p-3 mb-2">
                        <p className="text-xs sm:text-sm font-medium text-foreground mb-3">
                          Delete "{tag.name}"?
                        </p>
                        <p className="text-xs text-muted-foreground mb-3">
                          This will remove the category. All products under it will move to
                          "All". No products will be deleted.
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDeleteTag(tag._id)}
                            disabled={deletingId !== null}
                            className="flex-1 px-3 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                          >
                            {deletingId === tag._id ? "..." : "Delete"}
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            disabled={deletingId !== null}
                            className="flex-1 px-3 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-secondary p-3 rounded-lg hover:bg-muted transition-colors">
                        <span className="font-medium text-foreground">{tag.name}</span>
                        <button
                          onClick={() => setShowDeleteConfirm(tag._id)}
                          disabled={isLoading || deletingId !== null}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
