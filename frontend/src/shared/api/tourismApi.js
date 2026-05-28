import { api } from './client.js'

export const tourismApi = {
  getOperators: () => api.get('/tourism/operators'),
  getExperiences: () => api.get('/tourism/experiences'),
  getExperienceById: (id) => api.get(`/tourism/experiences/${id}`),
  createExperience: (data) => api.post('/tourism/experiences', data),
  linkExperienceToLot: (experienceId, lotId) =>
    api.post(`/tourism/experiences/${experienceId}/lots/${lotId}`),
}
