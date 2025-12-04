import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useInterviewStore = create(
  persist(
    (set) => ({
      currentInterview: null,
      setCurrentInterview: (interview) => set({ currentInterview: interview }),
      clearInterview: () => set({ currentInterview: null }),
    }),
    {
      name: 'interview-storage',
    }
  )
);
