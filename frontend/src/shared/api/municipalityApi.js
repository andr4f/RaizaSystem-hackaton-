import { api } from './client.js'

export const municipalityApi = {
  list: ({ department, search } = {}) => {
    const params = new URLSearchParams()
    if (department) params.set('department', department)
    if (search) params.set('search', search)
    const qs = params.toString()
    return api.get(`/municipalities${qs ? `?${qs}` : ''}`)
  },
}
