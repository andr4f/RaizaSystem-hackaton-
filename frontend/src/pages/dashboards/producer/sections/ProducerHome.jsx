import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Package, QrCode, BadgeCheck, Users, ArrowRight, Check,
  PlusCircle, Award, UserPlus, Leaf, Sparkles,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { useProducerData } from '../useProducerData'
import './ProducerHome.css'

// La serie de escaneos QR aún no tiene endpoint agregado en el back.
// Placeholder visual hasta que exista GET /producers/{id}/scan-activity.
const SCAN_SERIES = [
  { d: '1 May', v: 120 }, { d: '7 May', v: 180 }, { d: '13 May', v: 90 },
  { d: '19 May', v: 210 }, { d: '25 May', v: 160 }, { d: '31 May', v: 248 },
]

const STATUS_LABEL = {
  ACTIVE: 'Activo', AVAILABLE: 'Activo', IN_REVIEW: 'En proceso',
  RESERVED: 'Reservado', SOLD: 'Vendido', DRAFT: 'Borrador',
}

function fmtDate(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch { return iso }
}

const ProducerHome = () => {
  const navigate = useNavigate()
  const { producer, lots, leads, applications, loading } = useProducerData()

  const firstName = (producer?.name || 'Productor').split(' ')[0]

  const stats = useMemo(() => {
    const activeLots = lots.filter(l => ['ACTIVE', 'AVAILABLE', 'IN_REVIEW'].includes(l.status)).length
    const validatedCerts = applications.filter(a => a.status === 'APPROVED' || a.status === 'VALIDATED').length
    const openLeads = leads.filter(l => l.leadStatus === 'NEW' || l.leadStatus === 'CONTACTED').length
    return {
      activeLots: activeLots || lots.length,
      qrScans: 248, // placeholder — sin endpoint agregado
      certifications: validatedCerts || applications.length,
      opportunities: openLeads || leads.length,
    }
  }, [lots, leads, applications])

  const recentLots = useMemo(
    () => [...lots].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3),
    [lots],
  )

  // % de perfil completo — calculado desde campos del ProducerResponse
  const profile = useMemo(() => {
    const checks = [
      { label: 'Información personal', done: !!(producer?.name && producer?.phone) },
      { label: 'Información de la finca', done: !!(producer?.municipality && producer?.municipality !== 'Sin definir') },
      { label: 'Certificaciones', done: applications.length > 0 },
      { label: 'Medios de pago', done: false },
    ]
    const pct = Math.round((checks.filter(c => c.done).length / checks.length) * 100)
    return { checks, pct }
  }, [producer, applications])

  const STAT_CARDS = [
    { key: 'activeLots',     label: 'Lotes activos',  value: stats.activeLots,     icon: Package,    foot: 'Ver mis lotes',       to: '/dashboard/producer/lotes' },
    { key: 'qrScans',        label: 'Escaneos QR',    value: stats.qrScans,        icon: QrCode,     foot: 'Ver escaneos',        to: '/dashboard/producer/qr', up: '+18% vs. mes anterior' },
    { key: 'certifications', label: 'Certificaciones',value: stats.certifications, icon: BadgeCheck, foot: 'Ver certificaciones', to: '/dashboard/producer/certificaciones' },
    { key: 'opportunities',  label: 'Oportunidades',  value: stats.opportunities,  icon: Users,      foot: 'Ver oportunidades',   to: '/dashboard/producer/leads' },
  ]

  const QUICK = [
    { label: 'Registrar nuevo lote', icon: PlusCircle, to: '/dashboard/producer/lotes' },
    { label: 'Generar QR',           icon: QrCode,     to: '/dashboard/producer/qr' },
    { label: 'Agregar certificación',icon: Award,      to: '/dashboard/producer/certificaciones' },
    { label: 'Invitar comprador',    icon: UserPlus,   to: '/dashboard/producer/leads' },
  ]

  const RECS = [
    { title: 'Genera QR para tus lotes', text: 'Comparte la trazabilidad de tus productos con compradores y visitantes.', cta: 'Generar QR', to: '/dashboard/producer/qr', icon: QrCode },
    { title: 'Certifica tus procesos', text: 'Obtén certificaciones que aumentan el valor de tus productos.', cta: 'Ver certificaciones', to: '/dashboard/producer/certificaciones', icon: Award },
    { title: 'Conecta con compradores', text: 'Hay compradores buscando productos como los tuyos.', cta: 'Ver oportunidades', to: '/dashboard/producer/leads', icon: Users },
  ]

  return (
    <div className="ph">
      {/* ── Encabezado ── */}
      <div className="ph-header">
        <h1 className="ph-greeting">¡Bienvenido, {firstName}! <span>👋</span></h1>
        <p className="ph-sub">Aquí tienes un resumen de tu actividad y próximos pasos.</p>
      </div>

      {/* ── Stat cards ── */}
      <div className="ph-stats">
        {STAT_CARDS.map(({ key, label, value, icon: Icon, foot, to, up }) => (
          <div key={key} className="ph-stat">
            <div className="ph-stat-top">
              <span className="ph-stat-label">{label}</span>
              <div className="ph-stat-icon"><Icon size={16} strokeWidth={1.8} /></div>
            </div>
            <div className="ph-stat-value">{loading ? '—' : value}</div>
            {up && <span className="ph-stat-trend">{up}</span>}
            <button className="ph-stat-foot" onClick={() => navigate(to)}>
              {foot} <ArrowRight size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* ── Grid principal ── */}
      <div className="ph-grid">

        {/* Columna izquierda */}
        <div className="ph-col-main">

          {/* Lotes recientes */}
          <section className="ph-card">
            <div className="ph-card-head">
              <h2>Lotes recientes</h2>
              <button className="ph-link" onClick={() => navigate('/dashboard/producer/lotes')}>Ver todos</button>
            </div>
            {recentLots.length === 0 ? (
              <p className="ph-empty">Aún no tienes lotes registrados.</p>
            ) : (
              <ul className="ph-lots">
                {recentLots.map(lot => (
                  <li key={lot.id} className="ph-lot" onClick={() => navigate(`/dashboard/producer/lotes/${lot.id}`)}>
                    <div className="ph-lot-thumb"><Leaf size={18} /></div>
                    <div className="ph-lot-info">
                      <div className="ph-lot-name">
                        {lot.productName || lot.lotCode}
                        <span className={`ph-badge ph-badge--${(lot.status || '').toLowerCase()}`}>
                          {STATUS_LABEL[lot.status] || lot.status}
                        </span>
                      </div>
                      <span className="ph-lot-meta">{lot.farmName || 'Finca'} · {lot.availableQuantity} {lot.unitOfMeasure}</span>
                    </div>
                    <span className="ph-lot-date">Creado: {fmtDate(lot.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Actividad de escaneos */}
          <section className="ph-card">
            <div className="ph-card-head">
              <div>
                <h2>Actividad de escaneos</h2>
                <span className="ph-chart-note">Datos de muestra · sin endpoint agregado aún</span>
              </div>
              <span className="ph-chart-period">Este mes</span>
            </div>
            <div className="ph-chart-value">248 <span className="ph-chart-up">↑18%</span></div>
            <div className="ph-chart">
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={SCAN_SERIES} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="phScan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#16a34a" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="d" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 12 }} />
                  <Area type="monotone" dataKey="v" stroke="#16a34a" strokeWidth={2.5} fill="url(#phScan)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

        </div>

        {/* Columna derecha */}
        <div className="ph-col-side">

          {/* Completa tu perfil */}
          <section className="ph-card ph-profile">
            <h2>Completa tu perfil</h2>
            <div className="ph-profile-pct">
              <span className="ph-profile-num">{profile.pct}%</span>
              <span className="ph-profile-tag">¡Vas muy bien!</span>
            </div>
            <div className="ph-progress-bar"><div className="ph-progress-fill" style={{ width: `${profile.pct}%` }} /></div>
            <ul className="ph-checks">
              {profile.checks.map(c => (
                <li key={c.label} className={c.done ? 'done' : ''}>
                  <span className="ph-check-icon">{c.done ? <Check size={12} strokeWidth={3} /> : null}</span>
                  {c.label}
                </li>
              ))}
            </ul>
            <button className="ph-btn-dark">Completar perfil</button>
          </section>

          {/* Acciones rápidas */}
          <section className="ph-card">
            <h2 className="ph-card-title">Acciones rápidas</h2>
            <ul className="ph-quick">
              {QUICK.map(({ label, icon: Icon, to }) => (
                <li key={label} onClick={() => navigate(to)}>
                  <div className="ph-quick-icon"><Icon size={16} strokeWidth={1.8} /></div>
                  <span>{label}</span>
                  <ArrowRight size={14} className="ph-quick-arrow" />
                </li>
              ))}
            </ul>
          </section>

        </div>
      </div>

      {/* ── Recomendaciones ── */}
      <div className="ph-recs-head"><h2>Recomendaciones para ti</h2></div>
      <div className="ph-recs">
        {RECS.map(({ title, text, cta, to, icon: Icon }) => (
          <div key={title} className="ph-rec">
            <div className="ph-rec-icon"><Icon size={18} strokeWidth={1.7} /></div>
            <h3>{title}</h3>
            <p>{text}</p>
            <button className="ph-link" onClick={() => navigate(to)}>{cta} <ArrowRight size={12} /></button>
          </div>
        ))}
        <div className="ph-rec ph-rec--feature">
          <Sparkles size={20} className="ph-rec-feat-icon" />
          <h3>Conecta tu historia</h3>
          <p>Cuenta tu relato y destaca tus productos.</p>
          <button className="ph-rec-feat-btn">Crear mi historia →</button>
        </div>
      </div>
    </div>
  )
}

export default ProducerHome
