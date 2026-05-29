import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Plus } from 'lucide-react'
import { useProducerData } from '../useProducerData'
import CreateLotModal from '../components/CreateLotModal'
import './sections.css'

const STATUS = {
  AVAILABLE: ['Disponible', 'green'],
  CERTIFICATION_PENDING: ['Cert. pendiente', 'amber'],
  RESERVED: ['Reservado', 'blue'],
  IN_EXPORT_REVIEW: ['En revisión', 'amber'],
  SOLD: ['Vendido', 'gray'], INACTIVE: ['Inactivo', 'gray'],
}

function fmt(iso) {
  if (!iso) return '—'
  try { return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) }
  catch { return iso }
}

const LotsList = () => {
  const navigate = useNavigate()
  const { lots, loading, error } = useProducerData()
  const [showCreate, setShowCreate] = useState(false)

  return (
    <div className="sec">
      <div className="sec-head">
        <div>
          <h1>Mis lotes</h1>
          <p>Gestiona tus lotes de producción y su trazabilidad.</p>
        </div>
        <button className="sec-btn" onClick={() => setShowCreate(true)}><Plus size={16} /> Registrar lote</button>
      </div>

      {showCreate && <CreateLotModal onClose={() => setShowCreate(false)} />}

      {loading && <div className="sec-loading">Cargando lotes…</div>}
      {error && !loading && <div className="sec-error">{error}</div>}

      {!loading && !error && lots.length === 0 && (
        <div className="sec-empty">
          <Package size={32} className="sec-empty-icon" />
          <p>Aún no tienes lotes registrados.</p>
        </div>
      )}

      {!loading && lots.length > 0 && (
        <div className="sec-card">
          <table className="sec-table">
            <thead>
              <tr>
                <th>Código</th><th>Producto</th><th>Finca</th>
                <th>Cantidad</th><th>Cosecha</th><th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {lots.map(lot => {
                const [label, color] = STATUS[lot.status] || [lot.status, 'gray']
                return (
                  <tr key={lot.id} onClick={() => navigate(`/dashboard/producer/lotes/${lot.id}`)}>
                    <td className="sec-mono">{lot.lotCode}</td>
                    <td>{lot.productName || '—'}</td>
                    <td>{lot.farmName || '—'}</td>
                    <td>{lot.availableQuantity} {lot.unitOfMeasure}</td>
                    <td>{fmt(lot.harvestDate)}</td>
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

export default LotsList
