import { useMemo } from 'react'
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  AreaChart, Area,
} from 'recharts'
import { useProducerData } from '../useProducerData'
import { formatTrendPct } from '../../../../shared/api/dashboardApi'
import './sections.css'
import './Reports.css'

const COLORS = ['#16a34a', '#d97706', '#1d4ed8', '#9333ea', '#6b7280']

const Reports = () => {
  const { lots, leads, stats: dashboardStats } = useProducerData()

  const byStatus = useMemo(() => {
    const map = {}
    lots.forEach(l => { map[l.status] = (map[l.status] || 0) + 1 })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [lots])

  const byProduct = useMemo(() => {
    const map = {}
    lots.forEach(l => { const k = l.productName || 'Otro'; map[k] = (map[k] || 0) + 1 })
    return Object.entries(map).map(([name, lotes]) => ({ name, lotes }))
  }, [lots])

  const scanSeries = useMemo(
    () => (dashboardStats?.series ?? []).map(p => ({ d: p.label, v: p.value })),
    [dashboardStats],
  )

  const qrTrend = formatTrendPct(dashboardStats?.qrScansTrendPct)

  return (
    <div className="sec">
      <div className="sec-head">
        <div>
          <h1>Reportes</h1>
          <p>Indicadores de tus lotes, escaneos QR y oportunidades.</p>
        </div>
      </div>

      <div className="sec-kpis">
        <div className="sec-kpi"><strong>{dashboardStats?.activeLots ?? lots.length}</strong><span>Lotes activos</span></div>
        <div className="sec-kpi"><strong>{dashboardStats?.qrScansThisMonth ?? 0}</strong><span>Escaneos este mes</span></div>
        <div className="sec-kpi"><strong>{dashboardStats?.certifications ?? 0}</strong><span>Certificaciones</span></div>
        <div className="sec-kpi"><strong>{leads.length}</strong><span>Leads recibidos</span></div>
      </div>

      {scanSeries.length > 0 && (
        <div className="sec-tile" style={{ padding: 20 }}>
          <h3 className="rp-h3">Escaneos QR mensuales</h3>
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>
            {dashboardStats?.qrScansThisMonth ?? 0} este mes
            {qrTrend && <span style={{ color: '#16a34a' }}> · {qrTrend}</span>}
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={scanSeries} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="rpQr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16a34a" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="d" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 12 }} />
              <Area type="monotone" dataKey="v" stroke="#16a34a" strokeWidth={2.5} fill="url(#rpQr)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="rp-charts">
        <div className="sec-tile">
          <h3 className="rp-h3">Lotes por producto</h3>
          {byProduct.length === 0 ? <p className="sec-empty" style={{ padding: 16 }}>Sin datos.</p> : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={byProduct} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 12 }} />
                <Bar dataKey="lotes" fill="#16a34a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="sec-tile">
          <h3 className="rp-h3">Lotes por estado</h3>
          {byStatus.length === 0 ? <p className="sec-empty" style={{ padding: 16 }}>Sin datos.</p> : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={byStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {byStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}

export default Reports
