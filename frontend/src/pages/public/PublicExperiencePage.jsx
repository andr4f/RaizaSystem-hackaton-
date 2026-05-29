import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Compass, MapPin, Package } from 'lucide-react'
import { publicExperienceApi } from '../../shared/api/publicExperienceApi'
import './PublicExperiencePage.css'

/** Vista pública para QR de experiencias turísticas (no confundir con /trace/ de producto). */
const PublicExperiencePage = () => {
  const { slug } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    publicExperienceApi.getExperience(slug)
      .then(res => { if (!cancelled) setData(res.data) })
      .catch(err => { if (!cancelled) setError(err.message || 'Experiencia no encontrada') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [slug])

  if (loading) return <div className="pexp pexp-loading">Cargando experiencia…</div>
  if (error || !data) {
    return (
      <div className="pexp pexp-error">
        <h1>Experiencia no encontrada</h1>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="pexp">
      <header className="pexp-hero">
        <img src="/logo-nombre.svg" alt="Raíza" className="pexp-logo" />
        <div className="pexp-badge"><Compass size={14} /> Experiencia turística</div>
        <h1>{data.title}</h1>
        <p className="pexp-loc"><MapPin size={14} /> {data.locationName || 'Magdalena'}</p>
        {data.operatorName && <p className="pexp-op">Por {data.operatorName}</p>}
        {data.description && <p className="pexp-desc">{data.description}</p>}
      </header>

      <main className="pexp-main">
        <h2>Lotes y productos de esta experiencia</h2>
        <p className="pexp-hint">
          Cada producto tiene su propia trazabilidad. Escanea o abre el enlace del lote para ver origen y cadena productiva.
        </p>
        {data.lots?.length === 0 ? (
          <p className="pexp-empty">Esta experiencia aún no tiene lotes vinculados.</p>
        ) : (
          <ul className="pexp-lots">
            {data.lots.map(lot => (
              <li key={lot.lotCode}>
                <div>
                  <strong>{lot.productName}</strong>
                  <span>{lot.farmName} · {lot.farmMunicipality}</span>
                  <span className="pexp-code">{lot.lotCode}</span>
                </div>
                {lot.qrCodeValue && (
                  <Link
                    to={`/trace/${lot.qrCodeValue}`}
                    className="pexp-link"
                  >
                    <Package size={14} /> Ver trazabilidad del producto
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}

export default PublicExperiencePage
