import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PackageCheck, TrendingUp, Truck, BarChart3, ArrowRight,
  PlusCircle, Search, BadgeCheck, UserPlus, Leaf, Sparkles,
} from 'lucide-react'
import { useExporterData } from '../useExporterData'
import cafeTabiImg from '../../../../assets/imagen-cafe-tabi.png'
import cacaoFinoImg from '../../../../assets/imagen-cacao-fino.jpg'
import './ExporterHome.css'

// Mapa de estados de lead → etiqueta + tono visible en la tabla de oportunidades.
const LEAD_STATUS = {
  NEW: ['Nuevo', 'green'], CONTACTED: ['Negociación', 'amber'],
  QUALIFIED: ['Propuesta', 'green'], IN_EXPORT_REVIEW: ['En revisión', 'amber'],
  CLOSED_WON: ['Cerrado', 'green'], CLOSED_LOST: ['Perdido', 'gray'],
}

// Filas de muestra: se usan solo si aún no hay leads reales en el back.
const SAMPLE_OPPS = [
  { id: 's1', productName: 'Café Orgánico', company: 'Green Valley Imports', cc: 'ALE', qty: 45, unit: 'Ton', leadStatus: 'CONTACTED', when: 'Hoy, 09:30 AM' },
  { id: 's2', productName: 'Cacao Fino de Aroma', company: 'Cacao & Co', cc: 'BEL', qty: 20, unit: 'Ton', leadStatus: 'QUALIFIED', when: 'Ayer' },
]

const ACTIVITY = [
  { dot: 'green', title: 'Nuevo lead de Café', text: 'Green Valley Imports ha solicitado cotización.', when: 'Hace 2 horas' },
  { dot: 'amber', title: 'Lote de Cacao verificado', text: 'Lote #CC-045 completó trazabilidad documental.', when: 'Hace 5 horas' },
  { dot: 'blue',  title: 'Certificación Fair Trade', text: 'Asociación ASOPROKA renovó su sello.', when: 'Ayer' },
]

function fmtWhen(iso) {
  if (!iso) return '—'
  try { return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' }) }
  catch { return iso }
}

const ExporterHome = () => {
  const navigate = useNavigate()
  const { user, lots, verifiedLots, leads, loading } = useExporterData()

  const firstName = (user?.name || 'Exportador').split(' ')[0]

  const stats = useMemo(() => {
    const openOpps = leads.filter(l => ['NEW', 'CONTACTED', 'QUALIFIED', 'IN_EXPORT_REVIEW'].includes(l.leadStatus)).length
    const inProcess = leads.filter(l => l.leadStatus === 'IN_EXPORT_REVIEW').length
    const negVolume = verifiedLots.reduce((sum, l) => sum + (Number(l.availableQuantity) || 0), 0)
    return {
      verified: verifiedLots.length || 128,
      opportunities: openOpps || leads.length || 16,
      orders: inProcess || 7,
      volume: negVolume || 320,
    }
  }, [leads, verifiedLots])

  const opps = useMemo(() => {
    if (leads.length === 0) return SAMPLE_OPPS
    return leads.slice(0, 5).map(l => ({
      id: l.id,
      productName: l.productName || l.lotProductName || 'Producto',
      company: l.buyerCompany || l.companyName || l.buyerName || 'Comprador',
      cc: (l.countryCode || l.country || '').slice(0, 3).toUpperCase() || '—',
      qty: l.quantity ?? l.volume ?? '—',
      unit: l.unitOfMeasure || 'Ton',
      leadStatus: l.leadStatus,
      when: fmtWhen(l.updatedAt || l.createdAt),
    }))
  }, [leads])

  const featured = useMemo(
    () => [...verifiedLots]
      .sort((a, b) => (Number(b.availableQuantity) || 0) - (Number(a.availableQuantity) || 0))
      .slice(0, 2),
    [verifiedLots],
  )

  const STAT_CARDS = [
    { key: 'verified',      label: 'Lotes verificados', value: stats.verified,      icon: PackageCheck, up: '+24%', to: '/dashboard/exporter/lotes' },
    { key: 'opportunities', label: 'Oportunidades',     value: stats.opportunities, icon: TrendingUp,   up: '+33%', to: '/dashboard/exporter/oportunidades' },
    { key: 'orders',        label: 'Órdenes en proceso',value: stats.orders,        icon: Truck,        up: '+12%', to: '/dashboard/exporter/ordenes' },
    { key: 'volume',        label: 'Volumen neg. (Ton)',value: stats.volume,        icon: BarChart3,    up: '+18%', to: '/dashboard/exporter/reportes' },
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
        <p className="eh-sub">Aquí están tus oportunidades de exportación y la actividad reciente.</p>
      </div>

      {/* ── Stat cards ── */}
      <div className="eh-stats">
        {STAT_CARDS.map(({ key, label, value, icon: Icon, up, to }) => (
          <div key={key} className="eh-stat" onClick={() => navigate(to)}>
            <div className="eh-stat-top">
              <div className="eh-stat-icon"><Icon size={16} strokeWidth={1.8} /></div>
              <span className="eh-stat-trend">↑ {up}</span>
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
            <table className="eh-opps">
              <thead>
                <tr>
                  <th>Producto &amp; cliente</th><th>Volumen</th><th>Estado</th><th>Actualización</th>
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
                            <span className="eh-opp-client">{o.company} <em className="eh-opp-cc">{o.cc}</em></span>
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
          </section>

          {/* Lotes destacados */}
          <div className="eh-featured">
            {featured.length === 0 ? (
              <>
                <FeaturedCard img={cafeTabiImg} name="Café Tabi Variedad Colombia" qty="125" unit="Ton" onExplore={() => navigate('/dashboard/exporter/explorar')} />
                <FeaturedCard img={cacaoFinoImg} name="Cacao Fino de Aroma" qty="80" unit="Ton" onExplore={() => navigate('/dashboard/exporter/explorar')} />
              </>
            ) : featured.map((l, i) => (
              <FeaturedCard
                key={l.id}
                img={i === 0 ? cafeTabiImg : cacaoFinoImg}
                name={l.productName || l.lotCode}
                qty={l.availableQuantity}
                unit={l.unitOfMeasure || 'Ton'}
                onExplore={() => navigate('/dashboard/exporter/lotes')}
              />
            ))}
          </div>

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
            <ul className="eh-activity">
              {ACTIVITY.map((a, i) => (
                <li key={i}>
                  <span className={`eh-act-dot eh-act-dot--${a.dot}`} />
                  <div className="eh-act-body">
                    <span className="eh-act-title">{a.title}</span>
                    <span className="eh-act-text">{a.text}</span>
                    <span className="eh-act-when">{a.when}</span>
                  </div>
                </li>
              ))}
            </ul>
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
