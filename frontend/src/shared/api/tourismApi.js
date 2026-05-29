import { api } from './client.js'

export const tourismApi = {
  getExperienceTypes: () => api.get('/tourism/experience-types'),
  getOperators: () => api.get('/tourism/operators'),
  getOperatorExperiences: (operatorId) => api.get(`/tourism/operators/${operatorId}/experiences`),
  getExperiences: () => api.get('/tourism/experiences'),
  getExperienceById: (id) => api.get(`/tourism/experiences/${id}`),
  getExperienceLots: (id) => api.get(`/tourism/experiences/${id}/lots`),
  createExperience: (data) => api.post('/tourism/experiences', data),
  linkExperienceToLot: (experienceId, lotId) =>
    api.post(`/tourism/experiences/${experienceId}/lots/${lotId}`),
}
