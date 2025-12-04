import api from '@/lib/api';

export const interviewService = {
  createInterview: async (data) => {
    const response = await api.post('/generateInterview', data);
    return response.data;
  },
  
  getInterview: async (id) => {
    const response = await api.get(`/interview/${id}`);
    return response.data;
  },

  submitFeedback: async (id, feedbackData) => {
    const response = await api.post(`/interview/${id}/feedback`, feedbackData);
    return response.data;
  }
};
