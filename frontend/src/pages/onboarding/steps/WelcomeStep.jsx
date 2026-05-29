import { User, Compass, Users, Cable } from 'lucide-react'
import { useAuth } from '../../../app/providers/AuthContext'
import welcomeImg from '../../../assets/imagen-bienvenida-modulo.png'
import './WelcomeStep.css'

const ROLE_CONFIG = {
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
  PRODUCER: {
    label: 'Productor',
    description:
      'Registra tus lotes, gestiona la trazabilidad de tus productos y conecta con compradores del mundo.',
    steps: [
      { icon: User,    label: 'Tu rol'        },
      { icon: Compass, label: 'Tus lotes'     },
      { icon: Users,   label: 'Trazabilidad'  },
      { icon: Cable,   label: 'Conexión'      },
    ],
  },
  EXPORTER: {
    label: 'Exportador',
    description:
      'Accede a lotes verificados, realiza evaluaciones de calidad y conecta con productores de confianza.',
    steps: [
      { icon: User,    label: 'Tu rol'   },
      { icon: Compass, label: 'Lotes'    },
      { icon: Users,   label: 'Reviews'  },
      { icon: Cable,   label: 'Conexión' },
    ],
  },
}

const WelcomeStep = ({ onStart }) => {
  const { user } = useAuth()
  const config = ROLE_CONFIG[user?.role] ?? ROLE_CONFIG.TOURISM_OPERATOR

  return (
    <div className="ob-welcome">

      {/* ── Lado imagen ── */}
      <div className="ob-welcome__image-side">
        <img src={welcomeImg} alt="Campo Raíza" className="ob-welcome__img" />
        <div className="ob-welcome__img-overlay">
          <span className="ob-welcome__location">SIERRA NEVADA</span>
          <h2 className="ob-welcome__tagline">
            Traza lo que<br />nos conecta
          </h2>
        </div>
      </div>

      {/* ── Lado contenido ── */}
      <div className="ob-welcome__content-side">

        <div className="ob-welcome__logo-wrap">
          <img src="/logo-nombre.svg" alt="Raíza" className="ob-welcome__logo" />
        </div>

        <div className="ob-welcome__card">
          <h1 className="ob-welcome__title">
            ¡Bienvenido a<br />
            <strong>Raíza!</strong>
          </h1>

          <div className="ob-welcome__role-badge">
            <span>🌿</span>
            <span>{config.label}</span>
          </div>

          <p className="ob-welcome__desc">{config.description}</p>

          <div className="ob-welcome__steps">
            {config.steps.map(({ icon: Icon, label }) => (
              <div key={label} className="ob-welcome__step">
                <div className="ob-welcome__step-icon">
                  <Icon size={17} strokeWidth={1.8} />
                </div>
                <span className="ob-welcome__step-label">{label}</span>
              </div>
            ))}
          </div>

          <button className="ob-welcome__btn" onClick={onStart}>
            Comenzar →
          </button>
        </div>

      </div>
    </div>
  )
}

export default WelcomeStep
