import api from "@/lib/api";

export const roadmapService = {
  generateRoadmap: async (data) => {
    const response = await api.post("/generate-roadmap", data);
    return response.data;
  },
  
  saveRoadmap: async (title, data) => {
    const response = await api.post("/roadmap", { title, data });
    return response.data;
  },

  getRoadmaps: async () => {
    const response = await api.get("/roadmap");
    return response.data;
  },

  getRoadmap: async (id) => {
    const response = await api.get(`/roadmap/${id}`);
    return response.data;
  },

  updateRoadmap: async (id, data) => {
    const response = await api.put(`/roadmap/${id}`, { data });
    return response.data;
  }
};
