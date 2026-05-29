import { useState } from 'react'
import { User, Compass, Users, Cable, Package, Star } from 'lucide-react'
import welcomeImg from '../../../assets/imagen-bienvenida-modulo.png'
import './RoleSelectStep.css'

const ROLES = [
  { value: 'PRODUCER',         label: 'Productor' },
  { value: 'TOURISM_OPERATOR', label: 'Op. Turístico' },
  { value: 'EXPORTER',         label: 'Exportador' },
]

const ROLE_CONFIG = {
  PRODUCER: {
    label: 'Productor',
    description:
      'Registra tus lotes, gestiona la trazabilidad de tus productos y conecta con compradores del mundo.',
    steps: [
      { icon: User,    label: 'Tu rol'       },
      { icon: Package, label: 'Tus lotes'    },
      { icon: Compass, label: 'Trazabilidad' },
      { icon: Cable,   label: 'Conexión'     },
    ],
  },
  TOURISM_OPERATOR: {
    label: 'Operador Turístico',
    description:
      'Conecta experiencias rurales con productos locales trazables y crea experiencias inolvidables.',
    steps: [
      { icon: User,    label: 'Tu rol'       },
      { icon: Compass, label: 'Experiencias' },
      { icon: Users,   label: 'Productores'  },
      { icon: Cable,   label: 'Conexión'     },
    ],
  },
  EXPORTER: {
    label: 'Exportador',
    description:
      'Accede a lotes verificados, realiza evaluaciones de calidad y conecta con productores de confianza.',
    steps: [
      { icon: User,    label: 'Tu rol'   },
      { icon: Package, label: 'Lotes'    },
      { icon: Star,    label: 'Reviews'  },
      { icon: Cable,   label: 'Conexión' },
    ],
  },
}

const RoleSelectStep = ({ onNext }) => {
  const [selectedRole, setSelectedRole] = useState('TOURISM_OPERATOR')
  const config = ROLE_CONFIG[selectedRole]

  return (
    <div className="rss-page">

      {/* ── Lado imagen ── */}
      <div className="rss-image-side">
        <img src={welcomeImg} alt="Campo Raíza" className="rss-img" />
        <div className="rss-img-overlay">
          <span className="rss-location">SIERRA NEVADA</span>
          <h2 className="rss-tagline">Traza lo que<br />nos conecta</h2>
        </div>
      </div>

      {/* ── Lado contenido ── */}
      <div className="rss-content-side">

        <div className="rss-logo-wrap">
          <img src="/logo-nombre.svg" alt="Raíza" className="rss-logo" />
        </div>

        <div className="rss-card">

          <h1 className="rss-title">
            ¡Bienvenido a<br />
            <strong>Raíza!</strong>
          </h1>

          {/* Badge rol activo */}
          <div className="rss-role-badge">
            <span>🌿</span>
            <span>{config.label}</span>
          </div>

          {/* Selector de roles */}
          <span className="rss-role-hint">¿Cuál es tu rol?</span>
          <div className="rss-role-selector">
            {ROLES.map(({ value, label }) => (
              <button
                key={value}
                className={`rss-role-chip${selectedRole === value ? ' active' : ''}`}
                onClick={() => setSelectedRole(value)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Descripción dinámica */}
          <p className="rss-desc">{config.description}</p>

          {/* Pasos dinámicos */}
          <div className="rss-steps">
            {config.steps.map(({ icon: Icon, label }) => (
              <div key={label} className="rss-step">
                <div className="rss-step-icon">
                  <Icon size={17} strokeWidth={1.8} />
                </div>
                <span className="rss-step-label">{label}</span>
              </div>
            ))}
          </div>

          <button className="rss-btn" onClick={() => onNext(selectedRole)}>
            Comenzar →
          </button>

        </div>
      </div>
    </div>
  )
}

export default RoleSelectStep
