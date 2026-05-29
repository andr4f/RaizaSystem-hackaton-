import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Leaf } from 'lucide-react'
import cafeImg   from '../../../../assets/imagen-cafe-tabi.png'
import bananoImg from '../../../../assets/banano-harton.webp'
import cacaoImg  from '../../../../assets/imagen-cacao-fino.jpg'
import sideImg   from '../../../../assets/imagen-prductor-segundo-modulo.png'
import './ProducerStep1.css'

const PRODUCTS = [
  { value: 'cafe',   label: 'Café',   img: cafeImg   },
  { value: 'banano', label: 'Banano', img: bananoImg  },
  { value: 'cacao',  label: 'Cacao',  img: cacaoImg   },
  { value: 'otro',   label: 'Otro',   img: null, subtitle: 'Cuéntanos cuál' },
]

const TOTAL_STEPS = 3

const ProducerStep1 = ({ onNext, onBack, currentStep = 1 }) => {
  const [selected, setSelected] = useState('cafe')
  const navigate = useNavigate()

  return (
    <div className="ps1-page">

      {/* ── Navbar ── */}
      <nav className="ps1-nav">
        <img src="/logo-nombre.svg" alt="Raíza" className="ps1-nav-logo" />
        <div className="ps1-nav-actions">
          <span className="ps1-nav-text">¿Ya tienes cuenta?</span>
          <button className="ps1-nav-btn" onClick={() => navigate('/login')}>
            Iniciar sesión
          </button>
        </div>
      </nav>

      {/* ── Contenido principal ── */}
      <div className="ps1-body">

        <div className="ps1-left">

          {/* Volver */}
          <button className="ps1-back" onClick={onBack}>
            ← Volver
          </button>

          {/* Progress */}
          <div className="ps1-progress">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => {
              const n = i + 1
              const active = n === currentStep
              const done   = n < currentStep
              return (
                <div key={n} className="ps1-progress-item">
                  {i > 0 && <div className={`ps1-progress-line${done ? ' done' : ''}`} />}
                  <div className={`ps1-progress-circle${active ? ' active' : done ? ' done' : ''}`}>
                    {n}
                  </div>
                  <span className={`ps1-progress-label${active ? ' active' : ''}`}>
                    Paso {n}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Pregunta */}
          <div className="ps1-question">
            <span className="ps1-step-tag">PASO {currentStep} DE {TOTAL_STEPS}</span>
            <h1 className="ps1-title">¿Qué produces?</h1>
            <p className="ps1-subtitle">Selecciona el producto que cultivas en tu finca.</p>

            {/* Cards de producto */}
            <div className="ps1-cards">
              {PRODUCTS.map(({ value, label, img, subtitle }) => (
                <button
                  key={value}
                  className={`ps1-card${selected === value ? ' selected' : ''}`}
                  onClick={() => setSelected(value)}
                >
                  {img ? (
                    <img src={img} alt={label} className="ps1-card-img" />
                  ) : (
                    <div className="ps1-card-other">
                      <Leaf size={28} strokeWidth={1.5} />
                    </div>
                  )}
                  <div className="ps1-card-label">
                    <span>{label}</span>
                    {subtitle && <span className="ps1-card-subtitle">{subtitle}</span>}
                  </div>
                  {selected === value && (
                    <div className="ps1-card-check">
                      <Check size={13} strokeWidth={2.5} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Continuar */}
          <div className="ps1-footer">
            <button className="ps1-btn" onClick={() => onNext({ product: selected })}>
              Continuar →
            </button>
          </div>
        </div>

        {/* ── Imagen flotante derecha ── */}
        <div className="ps1-right">
          <div className="ps1-img-card">
            <img src={sideImg} alt="Campo productor" className="ps1-img" />
          </div>
        </div>

      </div>
    </div>
  )
}

export default ProducerStep1
