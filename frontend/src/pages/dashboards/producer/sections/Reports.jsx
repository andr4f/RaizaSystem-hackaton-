import { useMemo } from 'react'
import { AlertTriangle } from 'lucide-react'
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts'
import { useProducerData } from '../useProducerData'
import './sections.css'
import './Reports.css'

const COLORS = ['#16a34a', '#d97706', '#1d4ed8', '#9333ea', '#6b7280']

const Reports = () => {
  const { lots, leads } = useProducerData()

  // Lotes por estado (dato real)
  const byStatus = useMemo(() => {
    const map = {}
    lots.forEach(l => { map[l.status] = (map[l.status] || 0) + 1 })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [lots])

  // Lotes por producto (dato real)
  const byProduct = useMemo(() => {
    const map = {}
    lots.forEach(l => { const k = l.productName || 'Otro'; map[k] = (map[k] || 0) + 1 })
    return Object.entries(map).map(([name, lotes]) => ({ name, lotes }))
  }, [lots])

  return (
    <div className="sec">
      <div className="sec-head">
        <div>
          <h1>Reportes</h1>
          <p>Indicadores derivados de tus lotes y oportunidades.</p>
        </div>
      </div>

      <div className="sec-notice">
        <AlertTriangle size={16} />
        <span>
          Estos reportes se calculan en el cliente a partir de tus lotes y leads. Métricas como escaneos
          QR en el tiempo o ingresos requieren endpoints agregados que aún no existen en el backend.
        </span>
      </div>

      <div className="rp-summary">
        <div className="rp-kpi"><strong>{lots.length}</strong><span>Lotes totales</span></div>
        <div className="rp-kpi"><strong>{leads.length}</strong><span>Leads recibidos</span></div>
        <div className="rp-kpi"><strong>{byProduct.length}</strong><span>Productos distintos</span></div>
      </div>

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
