import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Compass, PlusCircle, MapPin, Package } from 'lucide-react'
import { useTourismData } from '../useTourismData'
import { experienceImage } from './TourismHome'
import './sections.css'

const Experiences = () => {
  const navigate = useNavigate()
  const { experiences, lotsByExp, loading, error } = useTourismData()
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    if (!q.trim()) return experiences
    const t = q.toLowerCase()
    return experiences.filter(e =>
      (e.title || '').toLowerCase().includes(t) ||
      (e.locationName || '').toLowerCase().includes(t),
    )
  }, [experiences, q])

  return (
    <div className="tsec">
      <div className="tsec-head">
        <div>
          <h1>Experiencias</h1>
          <p>Gestiona tus experiencias turísticas y los lotes que las hacen únicas.</p>
        </div>
        <button className="tsec-btn" onClick={() => navigate('/dashboard/tourism/experiencias/nueva')}>
          <PlusCircle size={16} /> Nueva experiencia
        </button>
      </div>

      <div className="tsec-search">
        <Search size={16} />
        <input
          placeholder="Buscar por título o ubicación…"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </div>

      {loading && <div className="tsec-loading">Cargando experiencias…</div>}
      {error && !loading && <div className="tsec-error">{error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <div className="tsec-empty">
          <Compass size={32} className="tsec-empty-icon" />
          <p>No hay experiencias con ese criterio. Crea la primera con “Nueva experiencia”.</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="tsec-grid">
          {filtered.map(e => {
            const lotCount = (lotsByExp[e.id] || []).length
            return (
              <div key={e.id} className="tsec-tile">
                <div className="tsec-tile-img">
                  <img src={experienceImage(e.title)} alt={e.title} />
                  <span className="tsec-tile-tag">Activa</span>
                </div>
                <div className="tsec-tile-body">
                  <span className="tsec-tile-name">{e.title}</span>
                  <span className="tsec-tile-meta"><MapPin size={13} /> {e.locationName || 'Magdalena'}</span>
                  <span className="tsec-tile-meta"><Package size={13} /> <strong>{lotCount}</strong> lote(s) vinculado(s)</span>
                  {e.description && <p className="tsec-tile-desc">{e.description}</p>}
                  <div className="tsec-tile-foot">
                    <button
                      className="tsec-tile-btn"
                      onClick={() => navigate(`/dashboard/tourism/experiencias/${e.id}`)}
                    >
                      Ver detalle →
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Experiences
