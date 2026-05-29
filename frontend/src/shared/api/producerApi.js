import { api } from './client.js'

export const producerApi = {
  getById:    (id) => api.get(`/producers/${id}`),
  getFarms:   (id) => api.get(`/producers/${id}/farms`),
  createFarm: (id, data) => api.post(`/producers/${id}/farms`, data),
}
