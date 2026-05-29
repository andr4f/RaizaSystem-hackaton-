import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Leaf, PackageSearch } from 'lucide-react'
import { useExporterData } from '../useExporterData'
import './sections.css'

const STATUS = {
  AVAILABLE: ['Disponible', 'green'], CERTIFICATION_PENDING: ['Cert. pendiente', 'amber'],
  RESERVED: ['Reservado', 'blue'], IN_EXPORT_REVIEW: ['En revisión', 'amber'],
  SOLD: ['Vendido', 'gray'], INACTIVE: ['Inactivo', 'gray'],
}

const ExploreProducts = () => {
  const navigate = useNavigate()
  const { lots, loading, error } = useExporterData()
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const available = lots.filter(l => ['AVAILABLE', 'CERTIFICATION_PENDING', 'RESERVED'].includes(l.status))
    if (!q.trim()) return available
    const t = q.toLowerCase()
    return available.filter(l =>
      (l.productName || '').toLowerCase().includes(t) ||
      (l.farmName || '').toLowerCase().includes(t) ||
      (l.lotCode || '').toLowerCase().includes(t),
    )
  }, [lots, q])

  return (
    <div className="esec">
      <div className="esec-head">
        <div>
          <h1>Explorar productos</h1>
          <p>Descubre lotes disponibles de productores de la región listos para exportación.</p>
        </div>
      </div>

      <div className="esec-search">
        <Search size={16} />
        <input
          placeholder="Buscar por producto, finca o código…"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </div>

      {loading && <div className="esec-loading">Cargando productos…</div>}
      {error && !loading && <div className="esec-error">{error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <div className="esec-empty">
          <PackageSearch size={32} className="esec-empty-icon" />
          <p>No se encontraron lotes disponibles con ese criterio.</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="esec-grid">
          {filtered.map(lot => {
            const [label, tone] = STATUS[lot.status] || [lot.status, 'gray']
            return (
              <div key={lot.id} className="esec-tile">
                <div className="esec-tile-img"><Leaf size={26} /></div>
                <div className="esec-tile-body">
                  <span className="esec-tile-name">{lot.productName || lot.lotCode}</span>
                  <span className="esec-tile-meta">{lot.farmName || 'Finca'} · {lot.municipality || 'Magdalena'}</span>
                  <span className="esec-tile-meta">Disponible <strong>{lot.availableQuantity} {lot.unitOfMeasure}</strong></span>
                  <span className={`esec-badge esec-badge--${tone}`}>{label}</span>
                  <div className="esec-tile-foot">
                    <button className="esec-tile-btn" onClick={() => navigate('/dashboard/exporter/lotes')}>
                      Ver lote →
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ExploreProducts
