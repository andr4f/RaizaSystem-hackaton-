import { api } from './client.js'

export const tourismApi = {
  getExperienceTypes: () => api.get('/tourism/experience-types'),
  getOperators: () => api.get('/tourism/operators'),
  getOperatorExperiences: (operatorId) => api.get(`/tourism/operators/${operatorId}/experiences`),
  getOperatorLeads: (operatorId) => api.get(`/tourism/operators/${operatorId}/leads`),
  getOperatorVisits: (operatorId) => api.get(`/tourism/operators/${operatorId}/visits`),
  getOperatorBookings: (operatorId) => api.get(`/tourism/operators/${operatorId}/bookings`),
  getOperatorFinance: (operatorId) => api.get(`/tourism/operators/${operatorId}/finance`),
  getExperiences: () => api.get('/tourism/experiences'),
  getExperienceById: (id) => api.get(`/tourism/experiences/${id}`),
  getExperienceLots: (id) => api.get(`/tourism/experiences/${id}/lots`),
  createExperience: (data) => api.post('/tourism/experiences', data),
  linkExperienceToLot: (experienceId, lotId) =>
    api.post(`/tourism/experiences/${experienceId}/lots/${lotId}`),
  updateLeadStatus: (operatorId, leadId, leadStatus) =>
    api.patch(`/tourism/operators/${operatorId}/leads/${leadId}/status`, { leadStatus }),
}
