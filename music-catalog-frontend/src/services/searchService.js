import api from "../api/axios";

// Simple in-memory cache for search requests
const searchCache = new Map();

export const searchService = {
  searchAlbums: async (term) => {
    const key = term.trim().toLowerCase();
    if (searchCache.has(key)) {
      // Simulate network delay for cached responses so spinner shows briefly
      return new Promise((resolve) => {
        setTimeout(() => resolve(searchCache.get(key)), 200);
      });
    }
    const res = await api.get(`/search/albums?term=${encodeURIComponent(term)}`);
    // Store only up to 50 items in cache to prevent memory leak
    if (searchCache.size > 50) {
      const firstKey = searchCache.keys().next().value;
      searchCache.delete(firstKey);
    }
    searchCache.set(key, res);
    return res;
  },
};
