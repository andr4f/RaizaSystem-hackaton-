import { api } from './client.js'

export const certificationApi = {
  // Catálogo de certificaciones disponibles
  getCatalog: () => api.get('/certifications'),
  // Solicitudes de certificación del productor
  getApplications: (producerId) =>
    api.get(`/certification-applications?producerId=${producerId}`),
  submitApplication: (data) => api.post('/certification-applications', data),
  pdfUrl: (id) => `/api/v1/certification-applications/${id}/pdf`,
  // Certificaciones adjuntas a un lote
  getByLot: (lotId) => api.get(`/lots/${lotId}/certifications`),
  attachToLot: (lotId, data) => api.post(`/lots/${lotId}/certifications`, data),
}
