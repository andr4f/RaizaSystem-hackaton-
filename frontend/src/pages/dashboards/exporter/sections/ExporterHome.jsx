import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PackageCheck, TrendingUp, Truck, BarChart3, ArrowRight,
  PlusCircle, Search, BadgeCheck, UserPlus, Leaf, Sparkles,
} from 'lucide-react'
import { useExporterData } from '../useExporterData'
import cafeTabiImg from '../../../../assets/imagen-cafe-tabi.png'
import cacaoFinoImg from '../../../../assets/imagen-cacao-fino.jpg'
import bananoImg from '../../../../assets/banano-harton.webp'
import './ExporterHome.css'

// Estado de lead → etiqueta + tono visible en la tabla de oportunidades.
const LEAD_STATUS = {
  NEW: ['Nuevo', 'green'], CONTACTED: ['Negociación', 'amber'],
  QUALIFIED: ['Propuesta', 'green'], IN_EXPORT_REVIEW: ['En revisión', 'amber'],
  CLOSED_WON: ['Cerrado', 'green'], CLOSED_LOST: ['Perdido', 'gray'],
}
const REVIEW_LABEL = {
  PENDING_REVIEW: 'Pendiente de revisión', UNDER_REVIEW: 'En revisión',
  APPROVED: 'Aprobada', REJECTED: 'Rechazada',
}

function lotImage(productName) {
  const p = (productName || '').toLowerCase()
  if (p.includes('cacao')) return cacaoFinoImg
  if (p.includes('café') || p.includes('cafe')) return cafeTabiImg
  if (p.includes('banano')) return bananoImg
  return null
}

function fmtWhen(iso) {
  if (!iso) return '—'
  try { return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' }) }
  catch { return iso }
}

const ExporterHome = () => {
  const navigate = useNavigate()
  const { user, exporter, reviews, verifiedLots, leads, lotsById, stats: dashboardStats, loading } = useExporterData()

  const firstName = (exporter?.contactName || user?.name || 'Exportador').split(' ')[0]

  const myLeadIds = useMemo(() => new Set(reviews.map(r => r.leadId)), [reviews])
  const myLeads = useMemo(() => leads.filter(l => myLeadIds.has(l.id)), [leads, myLeadIds])

  const stats = useMemo(() => ({
    verified: dashboardStats?.verifiedLots ?? 0,
    opportunities: dashboardStats?.opportunities ?? 0,
    orders: dashboardStats?.orders ?? 0,
    volume: dashboardStats?.volume ?? 0,
  }), [dashboardStats])

  const opps = useMemo(
    () => myLeads.slice(0, 5).map(l => {
      const lot = lotsById.get(l.lotId)
      return {
        id: l.id,
        productName: lot?.productName || l.lotCode || 'Producto',
        buyer: l.buyerName || 'Comprador',
        cc: (l.destinationCountry || '').slice(0, 3).toUpperCase() || '—',
        qty: l.requestedQuantity ?? '—',
        unit: l.unitOfMeasure || '',
        leadStatus: l.leadStatus,
        when: fmtWhen(l.createdAt),
      }
    }),
    [myLeads, lotsById],
  )

  const activity = useMemo(() => {
    const items = []
    reviews.forEach(r => items.push({
      dot: r.reviewStatus === 'PENDING_REVIEW' ? 'amber' : 'blue',
      title: 'Revisión de exportación',
      text: `${REVIEW_LABEL[r.reviewStatus] || r.reviewStatus}${r.incoterm ? ' · ' + r.incoterm : ''}`,
      ts: r.createdAt,
    }))
    myLeads.forEach(l => {
      const lot = lotsById.get(l.lotId)
      items.push({
        dot: 'green',
        title: `Nuevo lead de ${lot?.productName || l.lotCode || 'producto'}`,
        text: `${l.buyerName || 'Comprador'}${l.destinationCountry ? ' · ' + l.destinationCountry : ''}`,
        ts: l.createdAt,
      })
    })
    const myLotIds = new Set(myLeads.map(l => l.lotId))
    verifiedLots.filter(l => myLotIds.has(l.id)).forEach(l => items.push({
      dot: 'blue',
      title: `Lote ${l.lotCode} verificado`,
      text: `${l.productName} · ${l.availableQuantity} ${l.unitOfMeasure}`,
      ts: l.createdAt,
    }))
    return items
      .sort((a, b) => new Date(b.ts) - new Date(a.ts))
      .slice(0, 4)
  }, [reviews, myLeads, verifiedLots, lotsById])

  const featured = useMemo(
    () => [...verifiedLots]
      .sort((a, b) => (Number(b.availableQuantity) || 0) - (Number(a.availableQuantity) || 0))
      .slice(0, 2),
    [verifiedLots],
  )

  const STAT_CARDS = [
    { key: 'verified',      label: 'Lotes verificados',  value: stats.verified,      icon: PackageCheck, to: '/dashboard/exporter/lotes' },
    { key: 'opportunities', label: 'Oportunidades',      value: stats.opportunities, icon: TrendingUp,   to: '/dashboard/exporter/oportunidades' },
    { key: 'orders',        label: 'Órdenes en proceso', value: stats.orders,        icon: Truck,        to: '/dashboard/exporter/ordenes' },
    { key: 'volume',        label: 'Volumen negociado',  value: stats.volume,        icon: BarChart3,    to: '/dashboard/exporter/reportes' },
  ]

  const QUICK = [
    { label: 'Crear nueva oportunidad', icon: PlusCircle, to: '/dashboard/exporter/oportunidades', primary: true },
    { label: 'Buscar productos y lotes', icon: Search,    to: '/dashboard/exporter/explorar' },
    { label: 'Ver certificaciones',     icon: BadgeCheck, to: '/dashboard/exporter/certificaciones' },
    { label: 'Contactar productor',     icon: UserPlus,   to: '/dashboard/exporter/contactos' },
  ]

  return (
    <div className="eh">
      {/* ── Encabezado ── */}
      <div className="eh-header">
        <h1 className="eh-greeting">¡Bienvenido, {firstName}! <span>👋</span></h1>
        <p className="eh-sub">
          {exporter?.companyName
            ? `${exporter.companyName} · oportunidades de exportación y actividad reciente.`
            : 'Aquí están tus oportunidades de exportación y la actividad reciente.'}
        </p>
      </div>

      {/* ── Stat cards ── */}
      <div className="eh-stats">
        {STAT_CARDS.map(({ key, label, value, icon: Icon, to }) => (
          <div key={key} className="eh-stat" onClick={() => navigate(to)}>
            <div className="eh-stat-top">
              <div className="eh-stat-icon"><Icon size={16} strokeWidth={1.8} /></div>
            </div>
            <span className="eh-stat-label">{label}</span>
            <div className="eh-stat-value">{loading ? '—' : value}</div>
          </div>
        ))}
      </div>

      {/* ── Grid principal ── */}
      <div className="eh-grid">

        {/* Columna izquierda */}
        <div className="eh-col-main">

          {/* Oportunidades activas */}
          <section className="eh-card">
            <div className="eh-card-head">
              <h2>Oportunidades activas</h2>
              <button className="eh-link" onClick={() => navigate('/dashboard/exporter/oportunidades')}>
                Ver todas <ArrowRight size={12} />
              </button>
            </div>
            {opps.length === 0 ? (
              <p className="eh-empty">{loading ? 'Cargando…' : 'Aún no hay oportunidades activas.'}</p>
            ) : (
              <table className="eh-opps">
                <thead>
                  <tr>
                    <th>Producto &amp; cliente</th><th>Volumen</th><th>Estado</th><th>Registro</th>
                  </tr>
                </thead>
                <tbody>
                  {opps.map(o => {
                    const [label, tone] = LEAD_STATUS[o.leadStatus] || ['Activo', 'gray']
                    return (
                      <tr key={o.id} onClick={() => navigate('/dashboard/exporter/oportunidades')}>
                        <td>
                          <div className="eh-opp-prod">
                            <div className="eh-opp-thumb"><Leaf size={15} /></div>
                            <div>
                              <span className="eh-opp-name">{o.productName}</span>
                              <span className="eh-opp-client">{o.buyer} <em className="eh-opp-cc">{o.cc}</em></span>
                            </div>
                          </div>
                        </td>
                        <td className="eh-opp-vol">{o.qty} {o.unit}</td>
                        <td><span className={`eh-badge eh-badge--${tone}`}>{label}</span></td>
                        <td className="eh-opp-when">{o.when}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </section>

          {/* Lotes destacados */}
          {featured.length > 0 && (
            <div className="eh-featured">
              {featured.map(l => (
                <FeaturedCard
                  key={l.id}
                  img={lotImage(l.productName)}
                  name={l.productName || l.lotCode}
                  qty={l.availableQuantity}
                  unit={l.unitOfMeasure || ''}
                  onExplore={() => navigate('/dashboard/exporter/lotes')}
                />
              ))}
            </div>
          )}

        </div>

        {/* Columna derecha */}
        <div className="eh-col-side">

          {/* Acciones rápidas */}
          <section className="eh-card">
            <h2 className="eh-card-title">Acciones rápidas</h2>
            <div className="eh-quick">
              {QUICK.map(({ label, icon: Icon, to, primary }) => (
                <button
                  key={label}
                  className={`eh-quick-item${primary ? ' eh-quick-item--primary' : ''}`}
                  onClick={() => navigate(to)}
                >
                  <Icon size={16} strokeWidth={1.9} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Actividad reciente */}
          <section className="eh-card">
            <h2 className="eh-card-title">Actividad reciente</h2>
            {activity.length === 0 ? (
              <p className="eh-empty">Sin actividad reciente.</p>
            ) : (
              <ul className="eh-activity">
                {activity.map((a, i) => (
                  <li key={i}>
                    <span className={`eh-act-dot eh-act-dot--${a.dot}`} />
                    <div className="eh-act-body">
                      <span className="eh-act-title">{a.title}</span>
                      <span className="eh-act-text">{a.text}</span>
                      <span className="eh-act-when">{fmtWhen(a.ts)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Expande tus mercados */}
          <section className="eh-feature">
            <Sparkles size={20} className="eh-feature-icon" />
            <h3>Expande tus mercados</h3>
            <p>Descubre lotes listos para exportación a Europa y Norteamérica.</p>
            <button className="eh-feature-btn" onClick={() => navigate('/dashboard/exporter/explorar')}>
              Explorar lotes →
            </button>
          </section>

        </div>
      </div>
    </div>
  )
}

const FeaturedCard = ({ img, name, qty, unit, onExplore }) => (
  <div className="eh-feat-card">
    <div className="eh-feat-img">
      {img ? <img src={img} alt={name} /> : <Leaf size={26} />}
    </div>
    <div className="eh-feat-body">
      <span className="eh-feat-name">{name}</span>
      <span className="eh-feat-stock">Disponible <strong>{qty} {unit}</strong></span>
      <button className="eh-feat-btn-dark" onClick={onExplore}>Explorar lote →</button>
    </div>
  </div>
)

export default ExporterHome
