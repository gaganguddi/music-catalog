import api from "../api/axios";

// Simple in-memory cache for the library
let libraryCache = null;

export const libraryService = {
  getLibrary: async () => {
    if (libraryCache) {
      // Return cached promise
      return Promise.resolve(libraryCache);
    }
    const res = await api.get("/library");
    libraryCache = res;
    return res;
  },
  addAlbum: async (data) => {
    libraryCache = null; // Invalidate cache on mutation
    return api.post("/library", data);
  },
  updateAlbum: async (id, data) => {
    libraryCache = null; // Invalidate cache on mutation
    return api.put(`/library/${id}`, data);
  },
  deleteAlbum: async (id) => {
    libraryCache = null; // Invalidate cache on mutation
    return api.delete(`/library/${id}`);
  },
};
