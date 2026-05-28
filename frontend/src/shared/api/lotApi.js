import { api } from './client.js'

export const lotApi = {
  getAll: () => api.get('/lots'),
  getById: (id) => api.get(`/lots/${id}`),
  create: (data) => api.post('/lots', data),
  updateStatus: (id, status) => api.patch(`/lots/${id}/status`, { status }),
  getAiSummary: (id) => api.get(`/lots/${id}/ai-summary`),
}
