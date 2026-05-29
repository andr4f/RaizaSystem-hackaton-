// Los endpoints públicos viven en /public (no bajo /api/v1), por eso usamos
// fetch directo en vez del cliente `api` que antepone /api/v1.
async function publicGet(path) {
  const res = await fetch(path)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
async function publicPost(path) {
  const res = await fetch(path, { method: 'POST' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export const publicTraceApi = {
  getTrace: (qrSlug) => publicGet(`/public/trace/${qrSlug}`),
  scan:     (qrSlug) => publicPost(`/public/trace/${qrSlug}/scan`),
  // URL pública a la que apunta el QR impreso (ruta del frontend, se implementa luego)
  publicUrl: (qrSlug) => `${window.location.origin}/trace/${qrSlug}`,
}
