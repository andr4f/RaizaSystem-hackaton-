import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Plus } from 'lucide-react'
import sideImg      from '../../../../assets/imagen-primer-modulo-operadorTuristico.png'
import toursImg     from '../../../../assets/imagen-prductor-segundo-modulo.png'
import catasImg     from '../../../../assets/imagen-cafe-tabi.png'
import hospedajeImg from '../../../../assets/imagen-prductor-modulo-3.jpg'
import culturalImg  from '../../../../assets/imagen-bienvenida-modulo.png'
import './TourismStep1.css'

const EXPERIENCES = [
  { value: 'tours',    label: 'Tours de finca',         subtitle: 'Visitas guiadas en fincas productoras',         img: toursImg     },
  { value: 'catas',    label: 'Catas',                   subtitle: 'Catas de café, cacao y más',                    img: catasImg     },
  { value: 'hospedaje',label: 'Hospedaje rural',         subtitle: 'Alojamiento en entornos rurales',               img: hospedajeImg },
  { value: 'cultural', label: 'Experiencias culturales', subtitle: 'Cultura, tradición y comunidades',              img: culturalImg  },
  { value: 'otro',     label: 'Otro',                    subtitle: 'Cuéntanos qué otro tipo de experiencias ofreces', img: null       },
]

const TOTAL_STEPS = 3

const TourismStep1 = ({ onNext, onBack, currentStep = 1 }) => {
  const [selected, setSelected] = useState(new Set())
  const navigate = useNavigate()

  const toggle = (value) =>
    setSelected(prev => {
      const next = new Set(prev)
      next.has(value) ? next.delete(value) : next.add(value)
      return next
    })

  return (
    <div className="ts1-page">

      {/* ── Navbar ── */}
      <nav className="ts1-nav">
        <img src="/logo-nombre.svg" alt="Raíza" className="ts1-nav-logo" />
        <div className="ts1-nav-actions">
          <span className="ts1-nav-text">¿Ya tienes cuenta?</span>
          <button className="ts1-nav-btn" onClick={() => navigate('/login')}>Iniciar sesión</button>
        </div>
      </nav>

      {/* ── Cuerpo ── */}
      <div className="ts1-body">

        <div className="ts1-left">

          <button className="ts1-back" onClick={onBack}>← Volver</button>

          {/* Progress */}
          <div className="ts1-progress">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => {
              const n      = i + 1
              const active = n === currentStep
              const done   = n < currentStep
              return (
                <div key={n} className="ts1-progress-item">
                  {i > 0 && <div className={`ts1-progress-line${done ? ' done' : ''}`} />}
                  <div className={`ts1-progress-circle${active ? ' active' : done ? ' done' : ''}`}>{n}</div>
                  <span className={`ts1-progress-label${active ? ' active' : ''}`}>Paso {n}</span>
                </div>
              )
            })}
          </div>

          {/* Pregunta */}
          <div className="ts1-question">
            <span className="ts1-step-tag">PASO {currentStep} DE {TOTAL_STEPS}</span>
            <h1 className="ts1-title">¿Qué tipo de experiencias ofreces?</h1>
            <p className="ts1-subtitle">Selecciona todas las que apliquen a tu negocio</p>
          </div>

          {/* Grid de experiencias — multi-select */}
          <div className="ts1-grid">
            {EXPERIENCES.map(({ value, label, subtitle, img }) => {
              const isSelected = selected.has(value)
              return (
                <button
                  key={value}
                  className={`ts1-exp-card${isSelected ? ' selected' : ''}`}
                  onClick={() => toggle(value)}
                >
                  <div className="ts1-exp-img-wrap">
                    {img
                      ? <img src={img} alt={label} className="ts1-exp-img" />
                      : <div className="ts1-exp-other">
                          <div className="ts1-exp-plus-circle"><Plus size={20} strokeWidth={1.8} /></div>
                        </div>
                    }
                    {isSelected && (
                      <div className="ts1-exp-check"><Check size={12} strokeWidth={2.5} /></div>
                    )}
                  </div>
                  <div className="ts1-exp-body">
                    <span className="ts1-exp-label">{label}</span>
                    <span className="ts1-exp-sub">{subtitle}</span>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="ts1-footer">
            <button
              className="ts1-btn"
              disabled={selected.size === 0}
              onClick={() => onNext({ experiences: Array.from(selected) })}
            >
              Continuar →
            </button>
          </div>

        </div>

        {/* ── Imagen flotante derecha ── */}
        <div className="ts1-right">
          <div className="ts1-img-card">
            <img src={sideImg} alt="Paisaje turismo" className="ts1-img" />
          </div>
        </div>

      </div>
    </div>
  )
}

export default TourismStep1
