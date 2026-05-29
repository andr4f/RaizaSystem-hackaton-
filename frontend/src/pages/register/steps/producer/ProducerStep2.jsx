import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin } from 'lucide-react'
import mountainImg from '../../../../assets/imagen-prductor-segundo-modulo.png'
import bananoImg   from '../../../../assets/banano-harton.webp'
import cacaoImg    from '../../../../assets/imagen-cacao-fino.jpg'
import cafeImg     from '../../../../assets/imagen-cafe-tabi.png'
import fundImg     from '../../../../assets/imagen-prductor-modulo-3.jpg'
import sideImg     from '../../../../assets/imagen-prductor-modulo-3.jpg'
import './ProducerStep2.css'

const MUNICIPALITIES = [
  { value: 'santa_marta', label: 'Santa Marta', img: mountainImg },
  { value: 'banano',      label: 'Banano',       img: bananoImg  },
  { value: 'cienaga',     label: 'Ciénaga',      img: cacaoImg   },
  { value: 'aracataca',   label: 'Aracataca',    img: cafeImg    },
  { value: 'fundacion',   label: 'Fundación',    img: fundImg    },
  { value: 'otro',        label: 'Otro municipio', img: null     },
]

const TOTAL_STEPS = 3

const ProducerStep2 = ({ onNext, onBack, currentStep = 2 }) => {
  const [selected, setSelected] = useState('banano')
  const [search, setSearch]     = useState('')
  const navigate = useNavigate()

  const filtered = useMemo(() =>
    MUNICIPALITIES.filter(m =>
      m.label.toLowerCase().includes(search.toLowerCase())
    ), [search])

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
              />
            </div>

            <span className="ps2-list-label">Municipios principales</span>

            {/* Grid municipios */}
            <div className="ps2-grid">
              {filtered.map(({ value, label, img }) => (
                <button
                  key={value}
                  className={`ps2-item${selected === value ? ' selected' : ''}`}
                  onClick={() => setSelected(value)}
                >
                  {/* Thumbnail */}
                  <div className="ps2-item-thumb">
                    {img
                      ? <img src={img} alt={label} className="ps2-item-img" />
                      : <MapPin size={16} className="ps2-item-icon" />
                    }
                  </div>

                  <span className="ps2-item-label">{label}</span>

                  {/* Radio */}
                  <div className={`ps2-radio${selected === value ? ' selected' : ''}`} />
                </button>
              ))}
            </div>
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
        <button className="ps2-btn" onClick={() => onNext({ municipality: selected })}>
          Continuar →
        </button>
      </div>

    </div>
  )
}

export default ProducerStep2
