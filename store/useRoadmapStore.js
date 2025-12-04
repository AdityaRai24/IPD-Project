import { create } from 'zustand';
import { roadmapService } from '@/services/roadmapService';

export const useRoadmapStore = create((set, get) => ({
  roadmap: [],
  selectedSkills: {},
  currentRoadmapId: null,
  isLoading: false,
  error: null,

  setRoadmap: (roadmap) => set({ roadmap }),
  setSelectedSkills: (skills) => set({ selectedSkills: skills }),
  setCurrentRoadmapId: (id) => set({ currentRoadmapId: id }),

  fetchRoadmap: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await roadmapService.getRoadmap(id);
      set({ roadmap: data.data, currentRoadmapId: data.id, isLoading: false });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  saveRoadmap: async (title, data) => {
    set({ isLoading: true, error: null });
    try {
      const savedRoadmap = await roadmapService.saveRoadmap(title, data);
      set({ currentRoadmapId: savedRoadmap.id, isLoading: false });
      return savedRoadmap;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateRoadmapProgress: async (updatedRoadmap) => {
    const { currentRoadmapId } = get();
    if (!currentRoadmapId) return;

    // Optimistic update
    set({ roadmap: updatedRoadmap });

    try {
      await roadmapService.updateRoadmap(currentRoadmapId, updatedRoadmap);
    } catch (error) {
      console.error("Failed to sync progress", error);
      // Optionally revert state here
    }
  }
}));
