import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { Info } from 'lucide-react'
import { useTourismData } from '../useTourismData'
import './sections.css'

// Serie de muestra: sin endpoint de métricas de visitas/escaneos todavía.
const VISITS_SERIES = [
  { d: 'Dic', v: 140 }, { d: 'Ene', v: 175 }, { d: 'Feb', v: 160 },
  { d: 'Mar', v: 205 }, { d: 'Abr', v: 230 }, { d: 'May', v: 248 },
]

const TourismReports = () => {
  const { experiences, alliedProducers, linkedLotCount } = useTourismData()

  const KPIS = [
    { label: 'Visitas este mes', value: 248 },
    { label: 'Experiencias activas', value: experiences.length },
    { label: 'Lotes vinculados', value: linkedLotCount },
    { label: 'Productores aliados', value: alliedProducers.length },
  ]

  return (
    <div className="tsec">
      <div className="tsec-head">
        <div>
          <h1>Reportes</h1>
          <p>Visitas, escaneos de QR y desempeño de tus experiencias turísticas.</p>
        </div>
      </div>

      <div className="tsec-notice">
        <Info size={16} />
        <span>La serie histórica de visitas es de muestra: el back aún no expone métricas agregadas de turismo.</span>
      </div>

      <div className="th-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {KPIS.map(k => (
          <div key={k.label} className="tsec-card" style={{ padding: 18 }}>
            <div style={{ fontSize: 11.5, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="tsec-card" style={{ padding: 20 }}>
        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 2 }}>Visitas mensuales</div>
        <div style={{ fontSize: 30, fontWeight: 700, marginBottom: 8 }}>248 <span style={{ fontSize: 14, color: '#16a34a' }}>↑18%</span></div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={VISITS_SERIES} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
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
      </div>
    </div>
  )
}

export default TourismReports
