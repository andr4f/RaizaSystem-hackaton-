import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { useTourismData } from '../useTourismData'
import { formatTrendPct } from '../../../../shared/api/dashboardApi'
import './sections.css'

const TourismReports = () => {
  const { stats: dashboardStats, loading } = useTourismData()

  const visitsSeries = (dashboardStats?.series ?? []).map(p => ({ d: p.label, v: p.value }))
  const visitsThisMonth = dashboardStats?.visitsThisMonth ?? dashboardStats?.visits ?? 0
  const visitsTrend = formatTrendPct(dashboardStats?.visitsTrendPct)

  const KPIS = [
    { label: 'Visitas este mes', value: visitsThisMonth },
    { label: 'Experiencias activas', value: dashboardStats?.experiences ?? 0 },
    { label: 'Lotes vinculados', value: dashboardStats?.linkedLots ?? 0 },
    { label: 'Productores aliados', value: dashboardStats?.allies ?? 0 },
    { label: 'Reservas confirmadas', value: dashboardStats?.bookings ?? 0 },
  ]

  return (
    <div className="tsec">
      <div className="tsec-head">
        <div>
          <h1>Reportes</h1>
          <p>Visitas, escaneos de QR y desempeño de tus experiencias turísticas.</p>
        </div>
      </div>

      <div className="th-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {KPIS.map(k => (
          <div key={k.label} className="tsec-card" style={{ padding: 18 }}>
            <div style={{ fontSize: 11.5, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>{loading ? '—' : k.value}</div>
          </div>
        ))}
      </div>

      <div className="tsec-card" style={{ padding: 20 }}>
        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 2 }}>Visitas mensuales (escaneos QR)</div>
        <div style={{ fontSize: 30, fontWeight: 700, marginBottom: 8 }}>
          {loading ? '—' : visitsThisMonth}
          {visitsTrend && <span style={{ fontSize: 14, color: '#16a34a' }}> ↑{visitsTrend.replace(' vs. mes anterior', '')}</span>}
        </div>
        {visitsSeries.length === 0 ? (
          <p className="tsec-empty">Sin visitas registradas en tus experiencias.</p>
        ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={visitsSeries} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="thVisits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#16a34a" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="d" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 12 }} />
            <Area type="monotone" dataKey="v" stroke="#16a34a" strokeWidth={2.5} fill="url(#thVisits)" />
          </AreaChart>
        </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

export default TourismReports
