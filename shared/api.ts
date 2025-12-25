/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Tag model - groups products by supplier
 */
export interface Tag {
  _id: string;
  name: string;
  createdAt: string;
}

export type CreateTagRequest = Pick<Tag, 'name'>;

/**
 * Product status - Pending, Ordered, or Delivered
 */
export type ProductStatus = 'pending' | 'ordered' | 'delivered';

/**
 * Product model
 */
export interface Product {
  _id: string;
  name: string;
  tagId: string | null;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  tagId?: string | null;
  status?: ProductStatus;
}

export interface UpdateProductRequest {
  status: ProductStatus;
}

/**
 * API Response types
 */
export interface TagsResponse {
  tags: Tag[];
}

export interface TagResponse {
  tag: Tag;
}

export interface ProductsResponse {
  products: Product[];
}

export interface ProductResponse {
  product: Product;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}
