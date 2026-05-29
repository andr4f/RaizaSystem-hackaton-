/**
 * API pública para QR de EXPERIENCIAS TURÍSTICAS.
 * Ruta frontend: /experiencia/{slug}  →  GET /public/experiences/{slug}
 */
async function publicGet(path) {
  const res = await fetch(path)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: `HTTP ${res.status}` }))
    throw new Error(err.message || `HTTP ${res.status}`)
  }
  return res.json()
}

export const publicExperienceApi = {
  getExperience: (slug) => publicGet(`/public/experiences/${slug}`),
  /** URL impresa en el QR de la experiencia turística. */
  experiencePublicUrl: (slug) => `${window.location.origin}/experiencia/${slug}`,
}
