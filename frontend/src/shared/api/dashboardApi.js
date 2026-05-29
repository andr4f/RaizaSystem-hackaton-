import { api } from './client.js'

export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
}

export function formatTrendPct(pct) {
  if (pct == null || Number.isNaN(pct)) return null
  const sign = pct > 0 ? '+' : ''
  return `${sign}${pct}% vs. mes anterior`
}
