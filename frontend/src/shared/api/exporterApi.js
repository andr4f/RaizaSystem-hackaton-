import { api } from './client.js'

export const exporterApi = {
  getAll: () => api.get('/exporters'),
  getById: (id) => api.get(`/exporters/${id}`),
  // Revisiones de exportación (pipeline del exportador)
  getReviews: (id) => api.get(`/exporters/${id}/reviews`),
  // Crear revisión de exportación a partir de un lead
  createReview: (leadId, data) => api.post(`/leads/${leadId}/export-review`, data),
}
