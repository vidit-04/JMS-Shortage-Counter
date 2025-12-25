import { Product } from "@shared/api";

/**
 * Calculate Levenshtein distance between two strings
 * Used for fuzzy/error-tolerant search
 */
function levenshteinDistance(str1: string, str2: string): number {
  const track = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(0));

  for (let i = 0; i <= str1.length; i += 1) {
    track[0][i] = i;
  }
  for (let j = 0; j <= str2.length; j += 1) {
    track[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator
      );
    }
  }

  return track[str2.length][str1.length];
}

/**
 * Calculate similarity score between two strings (0 to 1, where 1 is perfect match)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 1;
  return 1 - distance / maxLength;
}

/**
 * Search products with error tolerance
 * Returns exact matches first, then fuzzy matches sorted by similarity
 */
export function searchProducts(
  products: Product[],
  query: string
): Product[] {
  if (!query.trim()) {
    return products;
  }

  const normalizedQuery = query.toLowerCase();

  const exactMatches: Product[] = [];
  const fuzzyMatches: Array<[Product, number]> = [];

  products.forEach((product) => {
    const normalizedName = product.name.toLowerCase();

    // Check for exact match or substring match (high priority)
    if (normalizedName === normalizedQuery || normalizedName.includes(normalizedQuery)) {
      exactMatches.push(product);
    } else {
      // Calculate fuzzy match score
      const similarity = calculateSimilarity(query, product.name);
      // Only include matches above 60% similarity threshold
      if (similarity > 0.6) {
        fuzzyMatches.push([product, similarity]);
      }
    }
  });

  // Sort fuzzy matches by similarity (highest first)
  fuzzyMatches.sort((a, b) => b[1] - a[1]);

  // Combine exact matches first, then fuzzy matches
  return [...exactMatches, ...fuzzyMatches.map(([product]) => product)];
}

/**
 * Check if a product name already exists (case-insensitive)
 */
export function productNameExists(
  products: Product[],
  name: string
): boolean {
  const normalizedName = name.toLowerCase();
  return products.some((p) => p.name.toLowerCase() === normalizedName);
}
