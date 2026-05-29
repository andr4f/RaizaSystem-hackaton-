import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Scale, Truck, Building2, Globe, Sparkles, MapPin } from 'lucide-react'
import sideImg from '../../../../assets/module-tres-image-exportador.png'
import './ExporterStep3.css'

const VOLUMES = [
  { value: 'small',        label: '1 - 10 toneladas',    sub: 'Operación pequeña',        Icon: Scale     },
  { value: 'growing',      label: '10 - 50 toneladas',   sub: 'Operación en crecimiento', Icon: Truck     },
  { value: 'consolidated', label: '50 - 100 toneladas',  sub: 'Operación consolidada',    Icon: Building2 },
  { value: 'large',        label: 'Más de 100 toneladas', sub: 'Gran escala',              Icon: Globe     },
]

const TOTAL_STEPS = 3

const ExporterStep3 = ({ onNext, onBack, currentStep = 3 }) => {
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()

  return (
    <div className="es3-page">

      {/* ── Navbar ── */}
      <nav className="es3-nav">
        <img src="/logo-nombre.svg" alt="Raíza" className="es3-nav-logo" />
        <div className="es3-nav-actions">
          <span className="es3-nav-text">¿Ya tienes cuenta?</span>
          <button className="es3-nav-btn" onClick={() => navigate('/login')}>Iniciar sesión</button>
        </div>
      </nav>

      {/* ── Cuerpo ── */}
      <div className="es3-body">

        <div className="es3-left">

          {/* Top bar: Volver + progress inline */}
          <div className="es3-top-bar">
            <button className="es3-back-top" onClick={onBack}>← Volver</button>
            <div className="es3-progress">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => {
                const n      = i + 1
                const done   = n < currentStep
                const active = n === currentStep
                return (
                  <div key={n} className="es3-progress-item">
                    {i > 0 && <div className={`es3-progress-line${done ? ' done' : ''}`} />}
                    <div className={`es3-progress-circle${active ? ' active' : done ? ' done' : ''}`}>{n}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Pregunta */}
          <div className="es3-question">
            <span className="es3-step-tag">PASO {currentStep} DE {TOTAL_STEPS}</span>
            <h1 className="es3-title">¿Qué volumen operas por mes?</h1>
            <p className="es3-subtitle">Esto nos ayuda a mostrarte oportunidades alineadas a tu operación.</p>
          </div>

          {/* Opciones de volumen */}
          <div className="es3-options">
            {VOLUMES.map(({ value, label, sub, Icon }) => (
              <button
                key={value}
                className={`es3-option${selected === value ? ' selected' : ''}`}
                onClick={() => setSelected(value)}
              >
                <div className="es3-option-icon">
                  <Icon size={18} strokeWidth={1.6} />
                </div>
                <div className="es3-option-text">
                  <span className="es3-option-label">{label}</span>
                  <span className="es3-option-sub">{sub}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Caja Recomendación IA */}
          <div className="es3-info-box">
            <Sparkles size={14} className="es3-info-icon" />
            <div className="es3-info-content">
              <span className="es3-info-title">Recomendación IA</span>
              <p className="es3-info-text">
                Mostraremos oportunidades y productores verificados en Raíza que se ajusten a tu capacidad operativa.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="es3-footer">
            <button
              className="es3-btn"
              disabled={!selected}
              onClick={() => onNext({ exportVolume: selected })}
            >
              Ver mi guía personalizada →
            </button>
          </div>

        </div>

        {/* ── Imagen flotante ── */}
        <div className="es3-right">
          <div className="es3-img-card">
            <img src={sideImg} alt="Puerto de exportación" className="es3-img" />
            <div className="es3-img-overlay">
              <div className="es3-overlay-badge">
                <MapPin size={10} strokeWidth={2} />
                <span>Logística Conectada</span>
              </div>
              <p className="es3-overlay-title">Traza lo que nos conecta.</p>
              <span className="es3-overlay-sub">
                Conectamos productores con el mundo a través de rutas eficientes y transparentes.
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ExporterStep3
