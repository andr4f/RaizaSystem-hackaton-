import { useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { Info } from 'lucide-react'
import { useExporterData } from '../useExporterData'
import './sections.css'

// Serie de muestra: sin endpoint de métricas de exportación todavía.
const VOLUME_SERIES = [
  { d: 'Dic', v: 180 }, { d: 'Ene', v: 220 }, { d: 'Feb', v: 195 },
  { d: 'Mar', v: 260 }, { d: 'Abr', v: 290 }, { d: 'May', v: 320 },
]

const ExporterReports = () => {
  const { verifiedLots } = useExporterData()

  const totalVolume = useMemo(
    () => verifiedLots.reduce((s, l) => s + (Number(l.availableQuantity) || 0), 0),
    [verifiedLots],
  )

  return (
    <div className="esec">
      <div className="esec-head">
        <div>
          <h1>Reportes</h1>
          <p>Volumen negociado y desempeño de tu actividad exportadora.</p>
        </div>
      </div>

      <div className="esec-notice">
        <Info size={16} />
        <span>La serie histórica es de muestra: el back aún no expone métricas agregadas de exportación.</span>
      </div>

      <div className="esec-card" style={{ padding: 20 }}>
        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 2 }}>Volumen negociado (Ton)</div>
        <div style={{ fontSize: 30, fontWeight: 700, marginBottom: 8 }}>
          {totalVolume || 320} <span style={{ fontSize: 13, color: '#16a34a' }}>↑18%</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={VOLUME_SERIES} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="ehVol" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#16a34a" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="d" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 12 }} />
            <Area type="monotone" dataKey="v" stroke="#16a34a" strokeWidth={2.5} fill="url(#ehVol)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ExporterReports
