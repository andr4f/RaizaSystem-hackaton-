/**
 * API pública para QR de LOTES DE PRODUCTO.
 * Ruta frontend: /trace/{qrSlug}  →  GET /public/trace/{qrSlug}
 * No usar para experiencias turísticas (ver publicExperienceApi.js).
 */
async function publicGet(path) {
  const res = await fetch(path)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: `HTTP ${res.status}` }))
    throw new Error(err.message || `HTTP ${res.status}`)
  }
  return res.json()
}

async function publicPost(path, body) {
  const res = await fetch(path, {
    method: 'POST',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: `HTTP ${res.status}` }))
    throw new Error(err.message || `HTTP ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

export const publicTraceApi = {
  getTrace: (qrSlug) => publicGet(`/public/trace/${qrSlug}`),
  getProducer: (producerId) => publicGet(`/public/producers/${producerId}`),
  scan: (qrSlug) => publicPost(`/public/trace/${qrSlug}/scan`),
  createLead: (qrSlug, data) => publicPost(`/public/trace/${qrSlug}/lead`, data),
  /** URL impresa en el QR del lote (trazabilidad del producto). */
  productPublicUrl: (qrSlug) => `${window.location.origin}/trace/${qrSlug}`,
}
