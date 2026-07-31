import api from "../api/axios";

export const aiService = {
  generateInsights: (albumId) => api.post("/ai/insights", { albumId }),
};
