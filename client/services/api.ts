import {
  Tag,
  Product,
  CreateTagRequest,
  CreateProductRequest,
  UpdateProductRequest,
  TagsResponse,
  TagResponse,
  ProductsResponse,
  ProductResponse,
  DeleteResponse,
} from "@shared/api";

const API_BASE = "/api";

/**
 * Helper function to handle fetch errors
 */
async function handleFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const data = await response.json();
        errorMessage = data.error || data.message || errorMessage;
      } catch {
        // If response body isn't JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    if (error instanceof TypeError) {
      if (error.message.includes("Failed to fetch")) {
        throw new Error(
          "Network error: Unable to reach server. Please check your connection."
        );
      }
    }
    throw error;
  }
}

/**
 * Tags API
 */
export const tagsAPI = {
  async getAll(): Promise<Tag[]> {
    const data = await handleFetch<TagsResponse>(`${API_BASE}/tags`);
    return data.tags;
  },

  async create(name: string): Promise<Tag> {
    const data = await handleFetch<TagResponse>(`${API_BASE}/tags`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name } as CreateTagRequest),
    });
    return data.tag;
  },

  async delete(id: string): Promise<void> {
    await handleFetch<DeleteResponse>(`${API_BASE}/tags/${id}`, {
      method: "DELETE",
    });
  },
};

/**
 * Products API
 */
export const productsAPI = {
  async getAll(): Promise<Product[]> {
    const data = await handleFetch<ProductsResponse>(`${API_BASE}/products`);
    return data.products;
  },

  async create(
    name: string,
    tagId?: string | null,
    status?: string
  ): Promise<Product> {
    const data = await handleFetch<ProductResponse>(`${API_BASE}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        tagId: tagId || null,
        status: status || "pending",
      } as CreateProductRequest),
    });
    return data.product;
  },

  async getById(id: string): Promise<Product> {
    const data = await handleFetch<ProductResponse>(
      `${API_BASE}/products/${id}`
    );
    return data.product;
  },

  async updateStatus(id: string, status: string): Promise<Product> {
    const data = await handleFetch<ProductResponse>(
      `${API_BASE}/products/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status } as UpdateProductRequest),
      }
    );
    return data.product;
  },

  async delete(id: string): Promise<void> {
    await handleFetch<DeleteResponse>(`${API_BASE}/products/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
  },
};
