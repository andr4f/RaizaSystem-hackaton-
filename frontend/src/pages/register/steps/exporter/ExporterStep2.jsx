import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Package, Star } from 'lucide-react'
import sideImg   from '../../../../assets/image-modulo-segundo-exportador.png'
import cafeImg   from '../../../../assets/imagen-cafe-tabi.png'
import cacaoImg  from '../../../../assets/imagen-cacao-fino.jpg'
import bananoImg from '../../../../assets/banano-harton.webp'
import './ExporterStep2.css'

const PRODUCTS = [
  { value: 'cafe',   label: 'Café',          img: cafeImg   },
  { value: 'cacao',  label: 'Cacao',          img: cacaoImg  },
  { value: 'banano', label: 'Banano',         img: bananoImg },
  { value: 'otro',   label: 'Otra producto',  subtitle: 'Especifica cuál', img: null },
]

const TOTAL_STEPS = 3

const ExporterStep2 = ({ onNext, onBack, currentStep = 2 }) => {
  const [selected, setSelected] = useState(new Set())
  const navigate = useNavigate()

  const toggle = (value) =>
    setSelected(prev => {
      const next = new Set(prev)
      next.has(value) ? next.delete(value) : next.add(value)
      return next
    })

  return (
    <div className="es2-page">

      {/* ── Navbar ── */}
      <nav className="es2-nav">
        <img src="/logo-nombre.svg" alt="Raíza" className="es2-nav-logo" />
        <div className="es2-nav-actions">
          <span className="es2-nav-text">¿Ya tienes cuenta?</span>
          <button className="es2-nav-btn" onClick={() => navigate('/login')}>Iniciar sesión</button>
        </div>
      </nav>

      {/* ── Cuerpo ── */}
      <div className="es2-body">

        <div className="es2-left">

          {/* Top bar: Volver + progress inline */}
          <div className="es2-top-bar">
            <button className="es2-back-top" onClick={onBack}>← Volver</button>
            <div className="es2-progress">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => {
                const n      = i + 1
                const done   = n < currentStep
                const active = n === currentStep
                return (
                  <div key={n} className="es2-progress-item">
                    {i > 0 && <div className={`es2-progress-line${done ? ' done' : ''}`} />}
                    <div className={`es2-progress-circle${active ? ' active' : done ? ' done' : ''}`}>{n}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Pregunta */}
          <div className="es2-question">
            <span className="es2-step-tag">PASO {currentStep} DE {TOTAL_STEPS}</span>
            <h1 className="es2-title">¿Qué productos manejas?</h1>
            <p className="es2-subtitle">Selecciona los productos que sueles exportar.</p>
          </div>

          {/* Grid 2×2 de productos */}
          <div className="es2-grid">
            {PRODUCTS.map(({ value, label, subtitle, img }) => {
              const isSelected = selected.has(value)
              return (
                <button
                  key={value}
                  className={`es2-card${isSelected ? ' selected' : ''}`}
                  onClick={() => toggle(value)}
                >
                  <div className="es2-card-img-wrap">
                    {img
                      ? <img src={img} alt={label} className="es2-card-img" />
                      : <div className="es2-card-other">
                          <Package size={22} strokeWidth={1.5} />
                        </div>
                    }
                    {isSelected && (
                      <div className="es2-card-check"><Check size={11} strokeWidth={2.5} /></div>
                    )}
                  </div>
                  <div className="es2-card-body">
                    <span className="es2-card-label">{label}</span>
                    {subtitle && <span className="es2-card-sub">{subtitle}</span>}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Info box ámbar */}
          <div className="es2-info-box">
            <Star size={14} className="es2-info-icon" />
            <p className="es2-info-text">
              Podrás encontrar lotes certificados y productores verificados en Raíza.
            </p>
          </div>

          <div className="es2-footer">
            <button
              className="es2-btn"
              disabled={selected.size === 0}
              onClick={() => onNext({ exportProducts: Array.from(selected) })}
            >
              Continuar →
            </button>
          </div>

        </div>

        {/* ── Imagen flotante ── */}
        <div className="es2-right">
          <div className="es2-img-card">
            <img src={sideImg} alt="Exportación" className="es2-img" />
            <div className="es2-img-overlay">
              <p className="es2-overlay-title">Conectando el origen con el mundo.</p>
              <span className="es2-overlay-sub">
                Descubre oportunidades de exportación que respetan la tierra.
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ExporterStep2
