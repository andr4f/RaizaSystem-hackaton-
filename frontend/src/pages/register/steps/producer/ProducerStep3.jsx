import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Award, UserX, HelpCircle } from 'lucide-react'
import sideImg from '../../../../assets/imagen-modulo-cuatro.png'
import './ProducerStep3.css'

const OPTIONS = [
  { value: 'yes',     icon: Award,      label: 'Sí, tengo\ncertificaciones' },
  { value: 'no',      icon: UserX,      label: 'No'                         },
  { value: 'unknown', icon: HelpCircle, label: 'No sé qué\nes eso'          },
]

const TOTAL_STEPS = 3

const ProducerStep3 = ({ onNext, onBack, currentStep = 3 }) => {
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()

  return (
    <div className="ps3-page">

      {/* ── Navbar ── */}
      <nav className="ps3-nav">
        <img src="/logo-nombre.svg" alt="Raíza" className="ps3-nav-logo" />
        <div className="ps3-nav-actions">
          <span className="ps3-nav-text">¿Ya tienes cuenta?</span>
          <button className="ps3-nav-btn" onClick={() => navigate('/login')}>
            Iniciar sesión
          </button>
        </div>
      </nav>

      {/* ── Cuerpo ── */}
      <div className="ps3-body">

        <div className="ps3-left">

          <button className="ps3-back" onClick={onBack}>← Volver</button>

          {/* Progress — los 3 rellenos */}
          <div className="ps3-progress">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => {
              const n      = i + 1
              const active = n === currentStep
              const done   = n < currentStep
              return (
                <div key={n} className="ps3-progress-item">
                  {i > 0 && <div className="ps3-progress-line done" />}
                  <div className={`ps3-progress-circle${active || done ? ' filled' : ''}`}>
                    {n}
                  </div>
                  <span className={`ps3-progress-label${active ? ' active' : ''}`}>Paso {n}</span>
                </div>
              )
            })}
          </div>

          {/* Pregunta */}
          <div className="ps3-question">
            <span className="ps3-step-tag">PASO {currentStep} DE {TOTAL_STEPS}</span>
            <h1 className="ps3-title">¿Tienes certificaciones?</h1>
            <p className="ps3-subtitle">
              Esto nos ayuda a mostrar la calidad y<br />sostenibilidad de tu producto.
            </p>

            {/* Opciones */}
            <div className="ps3-options">
              {OPTIONS.map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  className={`ps3-option${selected === value ? ' selected' : ''}`}
                  onClick={() => setSelected(value)}
                >
                  <div className="ps3-option-icon">
                    <Icon size={26} strokeWidth={1.6} />
                  </div>
                  <span className="ps3-option-label">
                    {label.split('\n').map((line, i) => (
                      <span key={i}>{line}<br /></span>
                    ))}
                  </span>
                  <div className={`ps3-radio${selected === value ? ' selected' : ''}`} />
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* ── Imagen flotante ── */}
        <div className="ps3-right">
          <div className="ps3-img-card">
            <img src={sideImg} alt="Productor" className="ps3-img" />
          </div>
        </div>

      </div>

      {/* ── Botón final ── */}
      <div className="ps3-footer">
        <button
          className="ps3-btn"
          disabled={!selected}
          onClick={() => onNext({ certifications: selected })}
        >
          Ver mi guía personalizada →
        </button>
      </div>

    </div>
  )
}

export default ProducerStep3
