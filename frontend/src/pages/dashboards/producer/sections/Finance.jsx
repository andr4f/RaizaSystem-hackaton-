import { Wallet } from 'lucide-react'
import { useProducerData } from '../useProducerData'
import './sections.css'

function fmt(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch { return iso }
}

const Finance = () => {
  const { finance, loading, error } = useProducerData()
  const items = finance?.items ?? []

  return (
    <div className="sec">
      <div className="sec-head">
        <div>
          <h1>Finanzas</h1>
          <p>Volumen negociado e intenciones de compra recibidas por tus lotes.</p>
        </div>
      </div>

      {loading && <div className="sec-loading">Cargando finanzas…</div>}
      {error && !loading && <div className="sec-error">{error}</div>}

      {!loading && !error && (
        <>
          <div className="sec-kpis">
            <div className="sec-kpi">
              <strong>{finance?.negotiatedVolume ?? 0}</strong>
              <span>Volumen solicitado</span>
            </div>
            <div className="sec-kpi">
              <strong>{finance?.activeDeals ?? 0}</strong>
              <span>Leads activos</span>
            </div>
            <div className="sec-kpi">
              <strong>{finance?.closedDeals ?? 0}</strong>
              <span>Cerrados (ganados)</span>
            </div>
            <div className="sec-kpi">
              <strong>{finance?.pendingItems ?? 0}</strong>
              <span>Nuevos sin contactar</span>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="sec-empty" style={{ padding: '48px 24px' }}>
              <Wallet size={32} className="sec-empty-icon" />
              <p>Sin movimientos financieros registrados todavía.</p>
            </div>
          ) : (
            <div className="sec-card">
              <table className="sec-table">
                <thead>
                  <tr>
                    <th>Comprador</th>
                    <th>Lote</th>
                    <th>Volumen</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={`${item.label}-${i}`}>
                      <td>{item.label}</td>
                      <td className="sec-mono">{item.detail}</td>
                      <td>{item.volume}</td>
                      <td><span className="sec-badge sec-badge--green">{item.status}</span></td>
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

export default Finance
