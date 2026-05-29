import { useState } from 'react'
import { Inbox } from 'lucide-react'
import { useTourismData } from '../useTourismData'
import { tourismApi } from '../../../../shared/api/tourismApi'
import './sections.css'

const STATUS = {
  NEW: ['Nuevo', 'green'],
  CONTACTED: ['Contactado', 'blue'],
  QUALIFIED: ['Calificado', 'amber'],
  IN_EXPORT_REVIEW: ['En revisión', 'amber'],
  CLOSED_WON: ['Cerrado (ganado)', 'green'],
  CLOSED_LOST: ['Cerrado (perdido)', 'gray'],
}
const STATUS_OPTIONS = Object.keys(STATUS)

function fmt(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch { return iso }
}

const TourismLeads = () => {
  const { operatorId, leads, loading, error, refresh } = useTourismData()
  const [updatingId, setUpdatingId] = useState(null)

  const changeStatus = async (lead, newStatus) => {
    if (newStatus === lead.leadStatus || !operatorId) return
    setUpdatingId(lead.id)
    try {
      await tourismApi.updateLeadStatus(operatorId, lead.id, newStatus)
      await refresh()
    } catch {
      /* refresh revertirá si falló */
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="tsec">
      <div className="tsec-head">
        <div>
          <h1>Leads y solicitudes</h1>
          <p>Solicitudes de información y leads de visitantes interesados en tus experiencias.</p>
        </div>
      </div>

      {loading && <div className="tsec-loading">Cargando solicitudes…</div>}
      {error && !loading && <div className="tsec-error">{error}</div>}

      {!loading && !error && leads.length === 0 && (
        <div className="tsec-empty">
          <Inbox size={32} className="tsec-empty-icon" />
          <p>Aún no tienes solicitudes. Comparte el QR de tus experiencias para recibir leads.</p>
        </div>
      )}

      {!loading && leads.length > 0 && (
        <div className="tsec-card">
          <table className="tsec-table">
            <thead>
              <tr>
                <th>Visitante</th>
                <th>Experiencia</th>
                <th>Lote</th>
                <th>Mensaje</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead.id}>
                  <td>
                    <div>{lead.buyerName || 'Anónimo'}</div>
                    <div className="tsec-mono">{lead.buyerType}</div>
                  </td>
                  <td>{lead.experienceTitle || '—'}</td>
                  <td className="tsec-mono">{lead.lotCode}</td>
                  <td style={{ maxWidth: 260 }}>{lead.message || '—'}</td>
                  <td>{fmt(lead.createdAt)}</td>
                  <td>
                    <select
                      className="tsec-status-select"
                      value={lead.leadStatus}
                      disabled={updatingId === lead.id}
                      onChange={(e) => changeStatus(lead, e.target.value)}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{STATUS[s][0]}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default TourismLeads
