import { Users } from 'lucide-react'
import { useProducerData } from '../useProducerData'
import './sections.css'

const STATUS = {
  NEW: ['Nuevo', 'green'], CONTACTED: ['Contactado', 'blue'],
  NEGOTIATING: ['Negociando', 'amber'], CLOSED: ['Cerrado', 'gray'],
  REJECTED: ['Rechazado', 'red'],
}

function fmt(iso) {
  if (!iso) return '—'
  try { return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) }
  catch { return iso }
}

const LeadsInbox = () => {
  const { leads, loading, error } = useProducerData()

  return (
    <div className="sec">
      <div className="sec-head">
        <div>
          <h1>Leads y oportunidades</h1>
          <p>Intenciones de compra recibidas por tus lotes y QR.</p>
        </div>
      </div>

      {loading && <div className="sec-loading">Cargando oportunidades…</div>}
      {error && !loading && <div className="sec-error">{error}</div>}

      {!loading && !error && leads.length === 0 && (
        <div className="sec-empty">
          <Users size={32} className="sec-empty-icon" />
          <p>Aún no tienes leads. Comparte tus QR para recibir intenciones de compra.</p>
        </div>
      )}

      {!loading && leads.length > 0 && (
        <div className="sec-card">
          <table className="sec-table">
            <thead>
              <tr>
                <th>Comprador</th><th>Lote</th><th>Cantidad</th>
                <th>Destino</th><th>Fecha</th><th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => {
                const [label, color] = STATUS[lead.leadStatus] || [lead.leadStatus, 'gray']
                return (
                  <tr key={lead.id}>
                    <td>{lead.buyerName || 'Anónimo'}</td>
                    <td className="sec-mono">{lead.lotCode}</td>
                    <td>{lead.requestedQuantity ? `${lead.requestedQuantity} ${lead.unitOfMeasure || ''}` : '—'}</td>
                    <td>{lead.destinationCountry || '—'}</td>
                    <td>{fmt(lead.createdAt)}</td>
                    <td><span className={`sec-badge sec-badge--${color}`}>{label}</span></td>
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

export default LeadsInbox
