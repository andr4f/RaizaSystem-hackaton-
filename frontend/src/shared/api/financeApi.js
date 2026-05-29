import { api } from './client.js'

export const financeApi = {
  getProducerFinance: (producerId) => api.get(`/producers/${producerId}/finance`),
  getExporterFinance: (exporterId) => api.get(`/exporters/${exporterId}/finance`),
  getTourismFinance: (operatorId) => api.get(`/tourism/operators/${operatorId}/finance`),
}
