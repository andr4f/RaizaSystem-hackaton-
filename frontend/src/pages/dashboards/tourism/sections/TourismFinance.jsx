import { Wallet } from 'lucide-react'
import { useTourismData } from '../useTourismData'
import './sections.css'

function fmt(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch { return iso }
}

const TourismFinance = () => {
  const { finance, loading, error } = useTourismData()

  const items = finance?.items ?? []

  return (
    <div className="tsec">
      <div className="tsec-head">
        <div>
          <h1>Finanzas</h1>
          <p>Volumen negociado y estado de reservas en tus experiencias turísticas.</p>
        </div>
      </div>

      {loading && <div className="tsec-loading">Cargando finanzas…</div>}
      {error && !loading && <div className="tsec-error">{error}</div>}

      {!loading && !error && (
        <>
          <div className="tsec-kpis">
            <div className="tsec-kpi">
              <strong>{finance?.negotiatedVolume ?? 0}</strong>
              <span>Volumen negociado (kg/u)</span>
            </div>
            <div className="tsec-kpi">
              <strong>{finance?.activeDeals ?? 0}</strong>
              <span>Reservas activas</span>
            </div>
            <div className="tsec-kpi">
              <strong>{finance?.closedDeals ?? 0}</strong>
              <span>Completadas</span>
            </div>
            <div className="tsec-kpi">
              <strong>{finance?.pendingItems ?? 0}</strong>
              <span>Leads nuevos</span>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="tsec-empty">
              <Wallet size={32} className="tsec-empty-icon" />
              <p>Sin movimientos financieros registrados todavía.</p>
            </div>
          ) : (
            <div className="tsec-card">
              <table className="tsec-table">
                <thead>
                  <tr>
                    <th>Visitante</th>
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
                      <td><span className="tsec-badge tsec-badge--green">{item.status}</span></td>
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

export default TourismFinance
