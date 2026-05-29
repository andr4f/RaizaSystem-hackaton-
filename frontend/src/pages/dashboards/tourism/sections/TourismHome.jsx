import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Compass, Users, CalendarCheck, MapPin, ArrowRight, Check,
  PlusCircle, QrCode, UserPlus,
} from 'lucide-react'
import { useTourismData } from '../useTourismData'
import { formatTrendPct } from '../../../../shared/api/dashboardApi'
import cafeImg from '../../../../assets/imagen-cafe-tabi.png'
import cacaoImg from '../../../../assets/imagen-cacao-fino.jpg'
import expImg from '../../../../assets/imagen-modulo-segundo-operadorTuristico.png'
import './TourismHome.css'

export function experienceImage(title) {
  const t = (title || '').toLowerCase()
  if (t.includes('cacao') || t.includes('chocolate')) return cacaoImg
  if (t.includes('café') || t.includes('cafe') || t.includes('cata')) return cafeImg
  return expImg
}

const TourismHome = () => {
  const navigate = useNavigate()
  const {
    operator, experiences, alliedProducers, linkedLotCount, stats: dashboardStats, loading,
  } = useTourismData()

  const firstName = (operator?.contactName || 'Operador').split(' ')[0]

  const stats = useMemo(() => ({
    experiences: dashboardStats?.experiences ?? experiences.length,
    visits: dashboardStats?.visitsThisMonth ?? dashboardStats?.visits ?? 0,
    bookings: dashboardStats?.bookings ?? 0,
    allies: dashboardStats?.allies ?? alliedProducers.length,
    visitsTrend: formatTrendPct(dashboardStats?.visitsTrendPct),
  }), [dashboardStats, experiences, alliedProducers])

  // Perfil completo derivado de los campos del operador + actividad.
  const profile = useMemo(() => {
    const checks = [
      { label: 'Información personal', done: !!(operator?.contactName && operator?.phone) },
      { label: 'Información del negocio', done: !!(operator?.name && operator?.municipality) },
      { label: 'Experiencias y servicios', done: experiences.length > 0 },
      { label: 'Certificaciones', done: linkedLotCount > 0 },
    ]
    const pct = Math.round((checks.filter(c => c.done).length / checks.length) * 100)
    return { checks, pct }
  }, [operator, experiences, linkedLotCount])

  const STAT_CARDS = [
    { key: 'experiences', label: 'Experiencias activas', value: stats.experiences, icon: Compass,       trend: null, foot: 'Ver experiencias', to: '/dashboard/tourism/experiencias' },
    { key: 'visits',      label: 'Visitas este mes',     value: stats.visits,      icon: MapPin,        trend: stats.visitsTrend || '—', foot: 'Ver visitas',      to: '/dashboard/tourism/reportes' },
    { key: 'bookings',    label: 'Reservas confirmadas', value: stats.bookings,    icon: CalendarCheck, trend: null, foot: 'Ver reservas',     to: '/dashboard/tourism/reservas' },
    { key: 'allies',      label: 'Productores aliados',  value: stats.allies,      icon: Users,         trend: null, foot: 'Ver aliados',      to: '/dashboard/tourism/aliados' },
  ]

  const QUICK = [
    { label: 'Crear nueva experiencia', icon: PlusCircle, to: '/dashboard/tourism/experiencias/nueva', primary: true },
    { label: 'Generar QR turístico',    icon: QrCode,     to: '/dashboard/tourism/qr' },
    { label: 'Conectar productor',      icon: UserPlus,   to: '/dashboard/tourism/aliados' },
  ]

  return (
    <div className="th">
      {/* ── Encabezado ── */}
      <div className="th-header">
        <h1 className="th-greeting">¡Bienvenido, {firstName}! <span>👋</span></h1>
        <p className="th-sub">
          {operator?.name
            ? `${operator.name} · resumen de tus experiencias y actividad reciente.`
            : 'Aquí tienes un resumen de tus experiencias y actividad reciente.'}
        </p>
      </div>

      {/* ── Stat cards ── */}
      <div className="th-stats">
        {STAT_CARDS.map(({ key, label, value, icon: Icon, trend, foot, to }) => (
          <div key={key} className="th-stat">
            <div className="th-stat-top">
              <span className="th-stat-label">{label}</span>
              <div className="th-stat-icon"><Icon size={16} strokeWidth={1.8} /></div>
            </div>
            <div className="th-stat-value">{loading ? '—' : value}</div>
            <span className="th-stat-trend">{trend || ''}</span>
            <button className="th-stat-foot" onClick={() => navigate(to)}>
              {foot} <ArrowRight size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* ── Grid principal ── */}
      <div className="th-grid">

        {/* Columna izquierda */}
        <div className="th-col-main">
          <section className="th-card">
            <div className="th-card-head">
              <h2>Experiencias activas</h2>
              <button className="th-link" onClick={() => navigate('/dashboard/tourism/experiencias')}>
                Ver todas <ArrowRight size={12} />
              </button>
            </div>
            {experiences.length === 0 ? (
              <p className="th-empty">{loading ? 'Cargando…' : 'Aún no tienes experiencias publicadas.'}</p>
            ) : (
              <div className="th-exps">
                {experiences.slice(0, 5).map(e => (
                  <div
                    key={e.id}
                    className="th-exp"
                    onClick={() => navigate(`/dashboard/tourism/experiencias/${e.id}`)}
                  >
                    <div className="th-exp-thumb">
                      <img src={experienceImage(e.title)} alt={e.title} />
                    </div>
                    <div className="th-exp-body">
                      <span className="th-exp-name">{e.title}</span>
                      <span className="th-exp-meta">{e.locationName || 'Magdalena'}</span>
                    </div>
                    <div className="th-exp-side">
                      <span className="th-badge th-badge--green">Activa</span>
                      <span className="th-exp-when">Actualizada: Hoy</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Columna derecha */}
        <div className="th-col-side">

          {/* Completa tu perfil */}
          <section className="th-card">
            <h2 className="th-card-title">Completa tu perfil</h2>
            <div className="th-profile-pct">
              <span className="th-profile-num">{profile.pct}%</span>
              <span className="th-profile-tag">¡Vas muy bien!</span>
            </div>
            <div className="th-progress-bar">
              <div className="th-progress-fill" style={{ width: `${profile.pct}%` }} />
            </div>
            <ul className="th-checks">
              {profile.checks.map(c => (
                <li key={c.label} className={c.done ? 'done' : ''}>
                  <span className="th-check-icon">{c.done ? <Check size={12} strokeWidth={3} /> : null}</span>
                  {c.label}
                </li>
              ))}
            </ul>
            <button className="th-btn-dark">Completar perfil</button>
          </section>

          {/* Acciones rápidas */}
          <section className="th-card">
            <h2 className="th-card-title">Acciones rápidas</h2>
            <div className="th-quick">
              {QUICK.map(({ label, icon: Icon, to, primary }) => (
                <button
                  key={label}
                  className={`th-quick-item${primary ? ' th-quick-item--primary' : ''}`}
                  onClick={() => navigate(to)}
                >
                  <Icon size={16} strokeWidth={1.9} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}

export default TourismHome
