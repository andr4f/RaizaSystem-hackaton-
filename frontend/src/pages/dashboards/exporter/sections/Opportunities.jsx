import { useState } from 'react'
import { TrendingUp } from 'lucide-react'
import { useExporterData } from '../useExporterData'
import { leadApi } from '../../../../shared/api/leadApi'
import './sections.css'

const STATUS = {
  NEW: ['Nuevo', 'green'], CONTACTED: ['Negociación', 'amber'],
  QUALIFIED: ['Propuesta', 'green'], IN_EXPORT_REVIEW: ['En revisión', 'amber'],
  CLOSED_WON: ['Cerrado (ganado)', 'green'], CLOSED_LOST: ['Cerrado (perdido)', 'gray'],
}
const STATUS_OPTIONS = Object.keys(STATUS)

function fmt(iso) {
  if (!iso) return '—'
  try { return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) }
  catch { return iso }
}

const Opportunities = () => {
  const { leads, loading, error, refresh } = useExporterData()
  const [updatingId, setUpdatingId] = useState(null)

  const changeStatus = async (lead, newStatus) => {
    if (newStatus === lead.leadStatus) return
    setUpdatingId(lead.id)
    try {
      await leadApi.updateStatus(lead.id, newStatus)
      await refresh()
    } catch {
      /* el refresh revertirá visualmente si falló */
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="esec">
      <div className="esec-head">
        <div>
          <h1>Oportunidades</h1>
          <p>Intenciones de compra y negociaciones en curso con compradores internacionales.</p>
        </div>
      </div>

      {loading && <div className="esec-loading">Cargando oportunidades…</div>}
      {error && !loading && <div className="esec-error">{error}</div>}

      {!loading && !error && leads.length === 0 && (
        <div className="esec-empty">
          <TrendingUp size={32} className="esec-empty-icon" />
          <p>Aún no hay oportunidades registradas.</p>
        </div>
      )}

      {!loading && leads.length > 0 && (
        <div className="esec-card">
          <table className="esec-table">
            <thead>
              <tr>
                <th>Producto</th><th>Comprador</th><th>Volumen</th>
                <th>Actualización</th><th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => {
                const [, tone] = STATUS[lead.leadStatus] || ['', 'gray']
                return (
                  <tr key={lead.id}>
                    <td>{lead.productName || lead.lotProductName || '—'}</td>
                    <td>{lead.buyerCompany || lead.companyName || lead.buyerName || '—'}</td>
                    <td>{lead.quantity ?? lead.volume ?? '—'} {lead.unitOfMeasure || ''}</td>
                    <td>{fmt(lead.updatedAt || lead.createdAt)}</td>
                    <td>
                      <select
                        className="esec-status-select"
                        value={lead.leadStatus}
                        disabled={updatingId === lead.id}
                        onChange={e => changeStatus(lead, e.target.value)}
                        style={{ borderColor: tone === 'green' ? '#16a34a' : undefined }}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{STATUS[s][0]}</option>
                        ))}
                      </select>
                    </td>
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

export default Opportunities
