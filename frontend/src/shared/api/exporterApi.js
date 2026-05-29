import { api } from './client.js'

export const exporterApi = {
  getAll: () => api.get('/exporters'),
  getById: (id) => api.get(`/exporters/${id}`),
  getReviews: (id) => api.get(`/exporters/${id}/reviews`),
  getOrders: (id) => api.get(`/exporters/${id}/orders`),
  getFinance: (id) => api.get(`/exporters/${id}/finance`),
  createReview: (leadId, data) => api.post(`/leads/${leadId}/export-review`, data),
}
