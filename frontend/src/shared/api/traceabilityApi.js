import { api } from './client.js'

export const traceabilityApi = {
  getEventsByLot: (lotId) => api.get(`/traceability/lots/${lotId}/events`),
  createEvent: (data) => api.post('/traceability/events', data),
  getPublicTrace: (qrSlug) => api.get(`/public/trace/${qrSlug}`),
}
