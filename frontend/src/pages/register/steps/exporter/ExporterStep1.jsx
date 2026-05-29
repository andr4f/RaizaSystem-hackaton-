import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Globe, Truck } from 'lucide-react'
import sideImg   from '../../../../assets/image-primer-modulo-exportador-refactor.png'
import europaImg from '../../../../assets/imagen-prductor-modulo-3.jpg'
import usaImg    from '../../../../assets/imagen-prductor-segundo-modulo.png'
import asiaImg   from '../../../../assets/imagen-cacao-fino.jpg'
import latamImg  from '../../../../assets/imagen-bienvenida-modulo.png'
import './ExporterStep1.css'

const MARKETS = [
  { value: 'europa',  label: 'Europa',         flag: '🇪🇺', img: europaImg },
  { value: 'usa',     label: 'Estados Unidos',  flag: '🇺🇸', img: usaImg   },
  { value: 'asia',    label: 'Asia',            flag: '🌏',  img: asiaImg  },
  { value: 'latam',   label: 'Latinoamérica',   flag: '🌎',  img: latamImg },
]

const TOTAL_STEPS = 3

const ExporterStep1 = ({ onNext, onBack, currentStep = 1 }) => {
  const [selected, setSelected] = useState(new Set())
  const navigate = useNavigate()

  const toggle = (value) =>
    setSelected(prev => {
      const next = new Set(prev)
      next.has(value) ? next.delete(value) : next.add(value)
      return next
    })

  const canContinue = selected.size > 0

  return (
    <div className="es1-page">

      {/* ── Navbar ── */}
      <nav className="es1-nav">
        <img src="/logo-nombre.svg" alt="Raíza" className="es1-nav-logo" />
        <div className="es1-nav-actions">
          <span className="es1-nav-text">¿Ya tienes cuenta?</span>
          <button className="es1-nav-btn" onClick={() => navigate('/login')}>Iniciar sesión</button>
        </div>
      </nav>

      {/* ── Cuerpo ── */}
      <div className="es1-body">

        <div className="es1-left">

          {/* Top bar: Volver + progress inline */}
          <div className="es1-top-bar">
            <button className="es1-back-top" onClick={onBack}>← Volver</button>
            <div className="es1-progress">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => {
                const n      = i + 1
                const done   = n < currentStep
                const active = n === currentStep
                return (
                  <div key={n} className="es1-progress-item">
                    {i > 0 && <div className={`es1-progress-line${done ? ' done' : ''}`} />}
                    <div className={`es1-progress-circle${active ? ' active' : done ? ' done' : ''}`}>{n}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Pregunta */}
          <div className="es1-question">
            <span className="es1-step-tag">PASO {currentStep} DE {TOTAL_STEPS}</span>
            <h1 className="es1-title">¿A qué mercados exportas?</h1>
            <p className="es1-subtitle">Selecciona los mercados principales a los que envías tus productos.</p>
          </div>

          {/* Grid 2×2 de mercados */}
          <div className="es1-grid">
            {MARKETS.map(({ value, label, flag, img }) => {
              const isSelected = selected.has(value)
              return (
                <button
                  key={value}
                  className={`es1-card${isSelected ? ' selected' : ''}`}
                  onClick={() => toggle(value)}
                >
                  <div className="es1-card-img-wrap">
                    <img src={img} alt={label} className="es1-card-img" />
                    {isSelected && (
                      <div className="es1-card-check"><Check size={12} strokeWidth={2.5} /></div>
                    )}
                  </div>
                  <div className="es1-card-label">
                    <span className="es1-card-flag">{flag}</span>
                    <span>{label}</span>
                  </div>
                </button>
              )
            })}

            {/* Card full-width "Otros mercados" */}
            <button
              className={`es1-card es1-card--otros${selected.has('otros') ? ' selected' : ''}`}
              onClick={() => toggle('otros')}
            >
              <div className="es1-otros-inner">
                <div className="es1-otros-icon">
                  <Globe size={18} strokeWidth={1.6} />
                </div>
                <div className="es1-otros-text">
                  <span className="es1-otros-label">Otros mercados</span>
                  <span className="es1-otros-sub">Cuéntanos tus mercados de interés</span>
                </div>
              </div>
              {selected.has('otros') && (
                <div className="es1-card-check es1-card-check--otros"><Check size={12} strokeWidth={2.5} /></div>
              )}
            </button>
          </div>

          <div className="es1-footer">
            <button
              className="es1-btn"
              disabled={!canContinue}
              onClick={() => onNext({ markets: Array.from(selected) })}
            >
              Continuar →
            </button>
          </div>

        </div>

        {/* ── Imagen con tarjeta ── */}
        <div className="es1-right">
          <div className="es1-img-card">
            <img src={sideImg} alt="Puerto exportación" className="es1-img" />
          </div>

          {/* Tarjeta flotante "Logística Integrada" */}
          <div className="es1-info-card">
            <div className="es1-info-icon">
              <Truck size={18} strokeWidth={1.6} />
            </div>
            <div className="es1-info-text">
              <span className="es1-info-title">Logística Integrada</span>
              <p className="es1-info-desc">
                Conecta tu origen directamente con los destinos más exigentes del mundo.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ExporterStep1
