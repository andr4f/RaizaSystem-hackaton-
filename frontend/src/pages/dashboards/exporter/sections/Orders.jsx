import { Truck } from 'lucide-react'
import { useExporterData } from '../useExporterData'
import './sections.css'

const REVIEW_STATUS = {
  PENDING_REVIEW: ['Pendiente', 'amber'],
  UNDER_REVIEW: ['En revisión', 'blue'],
  APPROVED: ['Aprobada', 'green'],
  REJECTED: ['Rechazada', 'gray'],
}

function fmt(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch { return iso }
}

function fmtDate(d) {
  if (!d) return '—'
  try { return new Date(d).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) }
  catch { return d }
}

const Orders = () => {
  const { orders, loading, error } = useExporterData()

  return (
    <div className="esec">
      <div className="esec-head">
        <div>
          <h1>Órdenes y envíos</h1>
          <p>Seguimiento de revisiones de exportación y logística asociada a tus leads.</p>
        </div>
      </div>

      {loading && <div className="esec-loading">Cargando órdenes…</div>}
      {error && !loading && <div className="esec-error">{error}</div>}

      {!loading && !error && orders.length === 0 && (
        <div className="esec-empty">
          <Truck size={32} className="esec-empty-icon" />
          <p>No tienes órdenes en proceso. Crea una revisión desde tus oportunidades.</p>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div className="esec-card">
          <table className="esec-table">
            <thead>
              <tr>
                <th>Comprador</th>
                <th>Lote</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Destino</th>
                <th>Incoterm</th>
                <th>Entrega est.</th>
                <th>Estado</th>
                <th>Creada</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => {
                const [label, tone] = REVIEW_STATUS[o.reviewStatus] || [o.reviewStatus, 'gray']
                return (
                  <tr key={o.reviewId}>
                    <td>{o.buyerName}</td>
                    <td className="esec-mono">{o.lotCode}</td>
                    <td>{o.productName || '—'}</td>
                    <td>{o.quantity ? `${o.quantity} ${o.unitOfMeasure || ''}` : '—'}</td>
                    <td>{o.destinationCountry || '—'}</td>
                    <td>{o.incoterm || '—'}</td>
                    <td>{fmtDate(o.estimatedDeliveryDate)}</td>
                    <td><span className={`esec-badge esec-badge--${tone}`}>{label}</span></td>
                    <td>{fmt(o.createdAt)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Orders
