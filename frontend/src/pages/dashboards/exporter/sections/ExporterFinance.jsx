import { Wallet } from 'lucide-react'
import { useExporterData } from '../useExporterData'
import './sections.css'

function fmt(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch { return iso }
}

const ExporterFinance = () => {
  const { finance, loading, error } = useExporterData()
  const items = finance?.items ?? []

  return (
    <div className="esec">
      <div className="esec-head">
        <div>
          <h1>Finanzas</h1>
          <p>Volumen negociado y estado de tus operaciones de exportación.</p>
        </div>
      </div>

      {loading && <div className="esec-loading">Cargando finanzas…</div>}
      {error && !loading && <div className="esec-error">{error}</div>}

      {!loading && !error && (
        <>
          <div className="esec-kpis">
            <div className="esec-kpi">
              <strong>{finance?.negotiatedVolume ?? 0}</strong>
              <span>Volumen negociado</span>
            </div>
            <div className="esec-kpi">
              <strong>{finance?.activeDeals ?? 0}</strong>
              <span>Órdenes activas</span>
            </div>
            <div className="esec-kpi">
              <strong>{finance?.closedDeals ?? 0}</strong>
              <span>Cerradas (ganadas)</span>
            </div>
            <div className="esec-kpi">
              <strong>{finance?.pendingItems ?? 0}</strong>
              <span>Leads nuevos</span>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="esec-empty">
              <Wallet size={32} className="esec-empty-icon" />
              <p>Sin movimientos financieros registrados todavía.</p>
            </div>
          ) : (
            <div className="esec-card">
              <table className="esec-table">
                <thead>
                  <tr>
                    <th>Comprador</th>
                    <th>Detalle</th>
                    <th>Volumen</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={`${item.label}-${i}`}>
                      <td>{item.label}</td>
                      <td>{item.detail}</td>
                      <td>{item.volume}</td>
                      <td><span className="esec-badge esec-badge--green">{item.status}</span></td>
                      <td>{fmt(item.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ExporterFinance
