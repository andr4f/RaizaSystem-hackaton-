import { api } from './client.js'

export const lotApi = {
  getAll:        () => api.get('/lots'),
  getByProducer: (producerId) => api.get(`/lots?producerId=${producerId}`),
  getByStatus:   (status) => api.get(`/lots?status=${status}`),
  getById:       (id) => api.get(`/lots/${id}`),
  getDetail:     (id) => api.get(`/lots/${id}/detail`),
  create:        (data) => api.post('/lots', data),
  // Trazabilidad
  getEvents:     (id) => api.get(`/lots/${id}/events`),
  createEvent:   (id, data) => api.post(`/lots/${id}/events`, data),
}
