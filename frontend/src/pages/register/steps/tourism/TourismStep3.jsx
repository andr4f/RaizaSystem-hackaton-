import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Bird } from 'lucide-react'
import sideImg   from '../../../../assets/imagen-modulo-tres-agenciaTursimo.png'
import card1Img  from '../../../../assets/imagen-cafe-tabi.png'
import card2Img  from '../../../../assets/imagen-prductor-segundo-modulo.png'
import card3Img  from '../../../../assets/imagen-cacao-fino.jpg'
import './TourismStep3.css'

const VOLUMES = [
  {
    value: '1-50',
    label: '1 – 50 visitantes',
    subtitle: 'Operación inicial, enfocado en grupos pequeños',
    img: card1Img,
  },
  {
    value: '50-200',
    label: '50 – 200 visitantes',
    subtitle: 'Operación en crecimiento y expansión',
    img: card2Img,
  },
  {
    value: '200+',
    label: 'Más de 200 visitantes',
    subtitle: 'Operación a gran escala y múltiples flujos',
    img: card3Img,
  },
]

const TOTAL_STEPS = 3

const TourismStep3 = ({ onNext, onBack, currentStep = 3 }) => {
  const [selected, setSelected] = useState('1-50')
  const navigate = useNavigate()

  return (
    <div className="ts3-page">

      {/* ── Navbar ── */}
      <nav className="ts3-nav">
        <img src="/logo-nombre.svg" alt="Raíza" className="ts3-nav-logo" />
        <div className="ts3-nav-actions">
          <span className="ts3-nav-text">¿Ya tienes cuenta?</span>
          <button className="ts3-nav-btn" onClick={() => navigate('/login')}>Iniciar sesión</button>
        </div>
      </nav>

      {/* ── Cuerpo ── */}
      <div className="ts3-body">

        <div className="ts3-left">

          {/* Top bar: Volver + progress en la misma fila */}
          <div className="ts3-top-bar">
            <button className="ts3-back-top" onClick={onBack}>← Volver</button>
            <div className="ts3-progress">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => {
                const n    = i + 1
                const done = n < currentStep
                const active = n === currentStep
                return (
                  <div key={n} className="ts3-progress-item">
                    {i > 0 && <div className={`ts3-progress-line${done ? ' done' : ''}`} />}
                    <div className={`ts3-progress-circle${active ? ' active' : done ? ' done' : ''}`}>{n}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Pregunta */}
          <div className="ts3-question">
            <span className="ts3-step-tag">PASO {currentStep} DE {TOTAL_STEPS}</span>
            <h1 className="ts3-title">¿Cuál es tu volumen estimado de visitantes al mes?</h1>
            <p className="ts3-subtitle">Según el volumen que manejes, adaptaremos tu experiencia.</p>
          </div>

          {/* Cards de volumen */}
          <div className="ts3-cards">
            {VOLUMES.map(({ value, label, subtitle, img }) => {
              const isSelected = selected === value
              return (
                <button
                  key={value}
                  className={`ts3-card${isSelected ? ' selected' : ''}`}
                  onClick={() => setSelected(value)}
                >
                  <div className="ts3-card-img-wrap">
                    <img src={img} alt={label} className="ts3-card-img" />
                    {isSelected && (
                      <div className="ts3-card-check"><Check size={12} strokeWidth={2.5} /></div>
                    )}
                  </div>
                  <div className="ts3-card-body">
                    <span className="ts3-card-label">{label}</span>
                    <span className="ts3-card-sub">{subtitle}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Footer: Volver + Finalizar */}
          <div className="ts3-footer">
            <button className="ts3-back-bottom" onClick={onBack}>← Volver</button>
            <button
              className="ts3-btn"
              disabled={!selected}
              onClick={() => onNext({ visitorVolume: selected })}
            >
              Finalizar registro →
            </button>
          </div>

        </div>

        {/* ── Imagen con recomendación ── */}
        <div className="ts3-right">
          <div className="ts3-img-card">
            <img src={sideImg} alt="Paisaje agencia turismo" className="ts3-img" />
          </div>

          {/* Tarjeta de recomendación flotante */}
          <div className="ts3-recommendation">
            <div className="ts3-rec-icon">
              <Bird size={18} strokeWidth={1.6} />
            </div>
            <div className="ts3-rec-text">
              <span className="ts3-rec-title">Recomendación para ti</span>
              <p className="ts3-rec-desc">
                Comenzar con un volumen manejable te permite enfocar la calidad en cada
                experiencia y construir una reputación sólida.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default TourismStep3
