import { Wallet, Clock } from 'lucide-react'
import './sections.css'

const Finance = () => (
  <div className="sec">
    <div className="sec-head">
      <div>
        <h1>Finanzas</h1>
        <p>Ingresos, pagos y liquidaciones de tus ventas.</p>
      </div>
    </div>

    <div className="sec-empty" style={{ padding: '64px 24px' }}>
      <Wallet size={36} className="sec-empty-icon" />
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '8px 0' }}>Próximamente</h3>
      <p style={{ maxWidth: 420, margin: '0 auto' }}>
        El módulo de finanzas aún no tiene endpoints en el backend (no existe un modelo de pagos
        ni ingresos). Cuando se agregue <code>GET /producers/&#123;id&#125;/finance</code> esta sección
        mostrará ingresos, pagos pendientes y liquidaciones.
      </p>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12, fontSize: 12.5, color: '#d97706' }}>
        <Clock size={14} /> Pendiente de backend
      </span>
    </div>
  </div>
)

export default Finance
