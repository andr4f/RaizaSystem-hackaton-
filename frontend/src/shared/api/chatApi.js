import { api } from './client.js'

export const chatApi = {
  ask: (message) => api.post('/chat', { message }),
}
