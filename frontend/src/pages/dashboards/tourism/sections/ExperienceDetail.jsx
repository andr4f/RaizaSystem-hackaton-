import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, MapPin, QrCode, Link2, Package } from 'lucide-react'
import { useTourismData } from '../useTourismData'
import { tourismApi } from '../../../../shared/api/tourismApi'
import { publicExperienceApi } from '../../../../shared/api/publicExperienceApi'
import './sections.css'

const ExperienceDetail = () => {
  const { experienceId } = useParams()
  const navigate = useNavigate()
  const { experiences, lotsByExp, lots, lotsById, loading, refresh } = useTourismData()

  const id = Number(experienceId)
  const experience = experiences.find(e => e.id === id)
  const linked = lotsByExp[id] || []

  const [lotToLink, setLotToLink] = useState('')
  const [linking, setLinking] = useState(false)
  const [error, setError] = useState(null)

  // Lotes disponibles que aún no están vinculados a esta experiencia.
  const linkable = useMemo(() => {
    const linkedIds = new Set(linked.map(l => l.lotId))
    return lots.filter(l => !linkedIds.has(l.id))
  }, [lots, linked])

  const link = async () => {
    if (!lotToLink) return
    setLinking(true)
    setError(null)
    try {
      await tourismApi.linkExperienceToLot(id, Number(lotToLink))
      setLotToLink('')
      await refresh()
    } catch (err) {
      setError(err.message || 'No se pudo vincular el lote.')
    } finally {
      setLinking(false)
    }
  }

  if (loading) return <div className="tsec"><div className="tsec-loading">Cargando experiencia…</div></div>
  if (!experience) {
    return (
      <div className="tsec">
        <button className="tsec-back" onClick={() => navigate('/dashboard/tourism/experiencias')}>
          <ChevronLeft size={16} /> Volver a experiencias
        </button>
        <div className="tsec-empty"><p>No se encontró la experiencia.</p></div>
      </div>
    )
  }

  const qrUrl = experience.qrSlug ? publicExperienceApi.experiencePublicUrl(experience.qrSlug) : null

  return (
    <div className="tsec">
      <button className="tsec-back" onClick={() => navigate('/dashboard/tourism/experiencias')}>
        <ChevronLeft size={16} /> Volver a experiencias
      </button>

      <div className="tsec-head">
        <div>
          <h1>{experience.title}</h1>
          <p>{experience.locationName || 'Magdalena'}</p>
        </div>
        <button className="tsec-btn tsec-btn--ghost" onClick={() => navigate('/dashboard/tourism/qr')}>
          <QrCode size={16} /> Ver QR
        </button>
      </div>

      {/* Datos de la experiencia */}
      <div className="tsec-card" style={{ padding: 20 }}>
        <div className="tsec-tile-meta" style={{ marginBottom: 8 }}>
          <MapPin size={14} /> {experience.locationName || 'Sin ubicación'}
        </div>
        {experience.description && (
          <p className="tsec-tile-desc" style={{ marginBottom: 8 }}>{experience.description}</p>
        )}
        {qrUrl && (
          <a className="th-link" href={qrUrl} target="_blank" rel="noreferrer" style={{ color: '#16a34a', fontWeight: 600, fontSize: 12.5 }}>
            <Link2 size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            {qrUrl}
          </a>
        )}
      </div>

      {/* Vincular lote */}
      <div className="tsec-card" style={{ padding: 20 }}>
        <h2 className="th-card-title" style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Vincular un lote</h2>
        <div className="tsec-link-row">
          <select
            className="tsec-select"
            value={lotToLink}
            onChange={e => setLotToLink(e.target.value)}
            disabled={linking || linkable.length === 0}
          >
            <option value="">{linkable.length ? 'Selecciona un lote…' : 'No hay lotes disponibles'}</option>
            {linkable.map(l => (
              <option key={l.id} value={l.id}>
                {l.lotCode} · {l.productName || 'Producto'} {l.farmName ? `(${l.farmName})` : ''}
              </option>
            ))}
          </select>
          <button className="tsec-btn" onClick={link} disabled={!lotToLink || linking}>
            {linking ? 'Vinculando…' : 'Vincular'}
          </button>
        </div>
        {error && <div className="tsec-form-error" style={{ marginTop: 10 }}>{error}</div>}
      </div>

      {/* Lotes vinculados */}
      <div>
        <h2 className="th-card-title" style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
          Lotes vinculados ({linked.length})
        </h2>
        {linked.length === 0 ? (
          <div className="tsec-empty">
            <Package size={32} className="tsec-empty-icon" />
            <p>Esta experiencia aún no tiene lotes vinculados.</p>
          </div>
        ) : (
          <div className="tsec-card">
            <table className="tsec-table">
              <thead>
                <tr><th>Código</th><th>Producto</th><th>Finca</th><th>Prioridad</th><th>Notas</th></tr>
              </thead>
              <tbody>
                {linked.map(link => {
                  const lot = lotsById.get(link.lotId)
                  return (
                    <tr key={link.id}>
                      <td className="tsec-mono">{link.lotCode || lot?.lotCode || '—'}</td>
                      <td>{lot?.productName || '—'}</td>
                      <td>{lot?.farmName || '—'}</td>
                      <td>{link.displayPriority ?? '—'}</td>
                      <td>{link.notes || '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExperienceDetail
