import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Loader2 } from 'lucide-react'
import { municipalityApi } from '../../../../shared/api/municipalityApi'
import sideImg from '../../../../assets/imagen-prductor-modulo-3.jpg'
import './ProducerStep2.css'

const TOTAL_STEPS = 3
const DEPARTMENT = 'Magdalena'

const ProducerStep2 = ({ onNext, onBack, currentStep = 2 }) => {
  const [municipalities, setMunicipalities] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false

    municipalityApi
      .list({ department: DEPARTMENT })
      .then(res => {
        if (cancelled) return
        const list = res?.data ?? []
        setMunicipalities(list)
        if (list.length > 0) setSelectedId(list[0].id)
      })
      .catch(err => {
        if (!cancelled) setError(err.message || 'No se pudieron cargar los municipios')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return municipalities
    return municipalities.filter(m =>
      m.name.toLowerCase().includes(q) ||
      (m.subregion && m.subregion.toLowerCase().includes(q))
    )
  }, [municipalities, search])

  const selected = municipalities.find(m => m.id === selectedId)

  const handleContinue = () => {
    if (!selected) return
    onNext({
      municipality: selected.name,
      department: selected.department,
      municipalityId: selected.id,
    })
  }

  return (
    <div className="ps2-page">

      {/* ── Navbar ── */}
      <nav className="ps2-nav">
        <img src="/logo-nombre.svg" alt="Raíza" className="ps2-nav-logo" />
        <div className="ps2-nav-actions">
          <span className="ps2-nav-text">¿Ya tienes cuenta?</span>
          <button className="ps2-nav-btn" onClick={() => navigate('/login')}>
            Iniciar sesión
          </button>
        </div>
      </nav>

      {/* ── Cuerpo ── */}
      <div className="ps2-body">

        <div className="ps2-left">

          {/* Volver */}
          <button className="ps2-back" onClick={onBack}>← Volver</button>

          {/* Progress */}
          <div className="ps2-progress">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => {
              const n      = i + 1
              const active = n === currentStep
              const done   = n < currentStep
              return (
                <div key={n} className="ps2-progress-item">
                  {i > 0 && <div className={`ps2-progress-line${done ? ' done' : ''}`} />}
                  <div className={`ps2-progress-circle${active ? ' active' : done ? ' done' : ''}`}>
                    {n}
                  </div>
                  <span className={`ps2-progress-label${active ? ' active' : ''}`}>Paso {n}</span>
                </div>
              )
            })}
          </div>

          {/* Pregunta */}
          <div className="ps2-question">
            <span className="ps2-step-tag">PASO {currentStep} DE {TOTAL_STEPS}</span>
            <h1 className="ps2-title">¿En qué municipio está tu finca?</h1>
            <p className="ps2-subtitle">Selecciona el municipio donde se encuentra tu finca.</p>

            {/* Buscador */}
            <div className="ps2-search-wrap">
              <Search size={15} className="ps2-search-icon" />
              <input
                type="text"
                className="ps2-search"
                placeholder="Buscar municipio..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                disabled={loading}
              />
            </div>

            <span className="ps2-list-label">
              Municipios habilitados en {DEPARTMENT}
              {!loading && municipalities.length > 0 && ` (${filtered.length})`}
            </span>

            {loading && (
              <p className="ps2-status">
                <Loader2 size={16} className="ps2-spin" /> Cargando municipios…
              </p>
            )}

            {error && <p className="ps2-status ps2-status--error">{error}</p>}

            {!loading && !error && filtered.length === 0 && (
              <p className="ps2-status">No se encontraron municipios para tu búsqueda.</p>
            )}

            {/* Grid municipios */}
            {!loading && !error && (
              <div className="ps2-grid">
                {filtered.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    className={`ps2-item${selectedId === m.id ? ' selected' : ''}`}
                    onClick={() => setSelectedId(m.id)}
                  >
                    <div className="ps2-item-thumb">
                      <MapPin size={16} className="ps2-item-icon" />
                    </div>

                    <div className="ps2-item-text">
                      <span className="ps2-item-label">{m.name}</span>
                      {m.subregion && (
                        <span className="ps2-item-meta">{m.subregion}</span>
                      )}
                    </div>

                    <div className={`ps2-radio${selectedId === m.id ? ' selected' : ''}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* ── Imagen flotante ── */}
        <div className="ps2-right">
          <div className="ps2-img-card">
            <img src={sideImg} alt="Paisaje productor" className="ps2-img" />
          </div>
        </div>

      </div>

      {/* ── Continuar (centrado abajo) ── */}
      <div className="ps2-footer">
        <button
          className="ps2-btn"
          onClick={handleContinue}
          disabled={!selected || loading}
        >
          Continuar →
        </button>
      </div>

    </div>
  )
}

export default ProducerStep2
