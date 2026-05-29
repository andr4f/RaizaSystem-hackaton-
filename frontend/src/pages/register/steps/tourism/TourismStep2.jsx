import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Handshake, Search, Sprout } from 'lucide-react'
import sideImg from '../../../../assets/imagen-modulo-segundo-operadorTuristico.png'
import './TourismStep2.css'

const OPTIONS = [
  {
    value: 'allied',
    icon: Handshake,
    label: 'Sí, ya tengo aliados',
    subtitle: 'Trabajo actualmente con productores locales en mis experiencias.',
  },
  {
    value: 'looking',
    icon: Search,
    label: 'No, quiero encontrarlos',
    subtitle: 'Aún no tengo alianzas, quiero que Raíza me conecte.',
  },
  {
    value: 'starting',
    icon: Sprout,
    label: 'Estoy comenzando',
    subtitle: 'Necesito ayuda general de Raíza para iniciar mis operaciones.',
  },
]

const TOTAL_STEPS = 3

const TourismStep2 = ({ onNext, onBack, currentStep = 2 }) => {
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()

  return (
    <div className="ts2-page">

      {/* ── Navbar ── */}
      <nav className="ts2-nav">
        <img src="/logo-nombre.svg" alt="Raíza" className="ts2-nav-logo" />
        <div className="ts2-nav-actions">
          <span className="ts2-nav-text">¿Ya tienes cuenta?</span>
          <button className="ts2-nav-btn" onClick={() => navigate('/login')}>Iniciar sesión</button>
        </div>
      </nav>

      {/* ── Cuerpo ── */}
      <div className="ts2-body">

        <div className="ts2-left">

          <button className="ts2-back" onClick={onBack}>← Volver</button>

          {/* Progress */}
          <div className="ts2-progress">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => {
              const n      = i + 1
              const active = n === currentStep
              const done   = n < currentStep
              return (
                <div key={n} className="ts2-progress-item">
                  {i > 0 && <div className={`ts2-progress-line${done ? ' done' : ''}`} />}
                  <div className={`ts2-progress-circle${active ? ' active' : done ? ' done' : ''}`}>{n}</div>
                  <span className={`ts2-progress-label${active ? ' active' : ''}`}>Paso {n}</span>
                </div>
              )
            })}
          </div>

          {/* Pregunta */}
          <div className="ts2-question">
            <span className="ts2-step-tag">PASO {currentStep} DE {TOTAL_STEPS}</span>
            <h1 className="ts2-title">¿Ya trabajas con productores locales?</h1>
            <p className="ts2-subtitle">
              Esto nos ayudará a conectarte mejor y personalizar tu ruta en Raíza.
            </p>
          </div>

          {/* Opciones horizontales */}
          <div className="ts2-options">
            {OPTIONS.map(({ value, icon: Icon, label, subtitle }) => (
              <button
                key={value}
                className={`ts2-option${selected === value ? ' selected' : ''}`}
                onClick={() => setSelected(value)}
              >
                <div className="ts2-option-icon">
                  <Icon size={20} strokeWidth={1.7} />
                </div>
                <div className="ts2-option-text">
                  <span className="ts2-option-label">{label}</span>
                  <span className="ts2-option-sub">{subtitle}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="ts2-footer">
            <button
              className="ts2-btn"
              disabled={!selected}
              onClick={() => onNext({ producerRelation: selected })}
            >
              Continuar →
            </button>
          </div>

        </div>

        {/* ── Imagen con cita ── */}
        <div className="ts2-right">
          <div className="ts2-blur-glow" />
          <div className="ts2-img-card">
            <img src={sideImg} alt="Productores locales" className="ts2-img" />
            <div className="ts2-quote-overlay">
              <p className="ts2-quote">
                "Conectar con operadores nos permitió llevar el sabor de nuestra tierra al mundo."
              </p>
              <span className="ts2-quote-author">— Familia Rodríguez, Productores Locales</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default TourismStep2
