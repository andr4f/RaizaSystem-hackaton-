import { PackageCheck } from 'lucide-react'
import { useExporterData } from '../useExporterData'
import './sections.css'

const STATUS = {
  AVAILABLE: ['Disponible', 'green'], RESERVED: ['Reservado', 'blue'],
  IN_EXPORT_REVIEW: ['En revisión', 'amber'], SOLD: ['Vendido', 'gray'],
}

function fmt(iso) {
  if (!iso) return '—'
  try { return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) }
  catch { return iso }
}

const VerifiedLots = () => {
  const { verifiedLots, loading, error } = useExporterData()

  return (
    <div className="esec">
      <div className="esec-head">
        <div>
          <h1>Lotes verificados</h1>
          <p>Lotes con trazabilidad validada, listos para negociación y exportación.</p>
        </div>
      </div>

      {loading && <div className="esec-loading">Cargando lotes…</div>}
      {error && !loading && <div className="esec-error">{error}</div>}

      {!loading && !error && verifiedLots.length === 0 && (
        <div className="esec-empty">
          <PackageCheck size={32} className="esec-empty-icon" />
          <p>Aún no hay lotes verificados disponibles.</p>
        </div>
      )}

      {!loading && verifiedLots.length > 0 && (
        <div className="esec-card">
          <table className="esec-table">
            <thead>
              <tr>
                <th>Código</th><th>Producto</th><th>Finca</th>
                <th>Disponible</th><th>Cosecha</th><th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {verifiedLots.map(lot => {
                const [label, tone] = STATUS[lot.status] || [lot.status, 'gray']
                return (
                  <tr key={lot.id}>
                    <td className="esec-mono">{lot.lotCode || '—'}</td>
                    <td>{lot.productName || '—'}</td>
                    <td>{lot.farmName || '—'}</td>
                    <td>{lot.availableQuantity} {lot.unitOfMeasure}</td>
                    <td>{fmt(lot.harvestDate || lot.createdAt)}</td>
                    <td><span className={`esec-badge esec-badge--${tone}`}>{label}</span></td>
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

export default VerifiedLots
