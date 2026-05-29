import { api } from './client.js'

export const productApi = {
  getAll:   () => api.get('/products'),
  getById:  (id) => api.get(`/products/${id}`),
}
