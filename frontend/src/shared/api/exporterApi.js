import { api } from './client.js'

export const exporterApi = {
  getReviews: () => api.get('/exporters/reviews'),
  getReviewById: (id) => api.get(`/exporters/reviews/${id}`),
  createReview: (data) => api.post('/exporters/reviews', data),
  updateReview: (id, data) => api.put(`/exporters/reviews/${id}`, data),
}
