import { api } from './client.js'

export const leadApi = {
  getAll: () => api.get('/leads'),
  getById: (id) => api.get(`/leads/${id}`),
  createPublic: (data) => api.post('/public/leads', data),
  updateStatus: (id, leadStatus) => api.patch(`/leads/${id}/status`, { leadStatus }),
}
