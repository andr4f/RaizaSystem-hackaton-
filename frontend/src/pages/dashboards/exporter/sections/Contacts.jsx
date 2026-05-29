import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Package } from 'lucide-react'
import { useExporterData } from '../useExporterData'
import './sections.css'

const Contacts = () => {
  const navigate = useNavigate()
  const { lots, loading, error } = useExporterData()

  // Productores únicos derivados de los lotes disponibles.
  const producers = useMemo(() => {
    const map = new Map()
    lots.forEach(l => {
      const key = l.producerId || l.producerName || l.farmName
      if (!key) return
      if (!map.has(key)) {
        map.set(key, {
          key,
          name: l.producerName || 'Productor',
          farm: l.farmName || 'Finca',
          products: new Set(),
          lots: 0,
        })
      }
      const entry = map.get(key)
      entry.lots += 1
      if (l.productName) entry.products.add(l.productName)
    })
    return [...map.values()].map(p => ({ ...p, products: [...p.products] }))
  }, [lots])

  return (
    <div className="esec">
      <div className="esec-head">
        <div>
          <h1>Contactos y productores</h1>
          <p>Productores con lotes disponibles para conectar y negociar directamente.</p>
        </div>
      </div>

      {loading && <div className="esec-loading">Cargando contactos…</div>}
      {error && !loading && <div className="esec-error">{error}</div>}

      {!loading && !error && producers.length === 0 && (
        <div className="esec-empty">
          <Users size={32} className="esec-empty-icon" />
          <p>Aún no hay productores con lotes disponibles.</p>
        </div>
      )}

      {!loading && producers.length > 0 && (
        <div className="esec-grid">
          {producers.map(p => (
            <div key={p.key} className="esec-tile">
              <div className="esec-tile-body">
                <span className="esec-tile-name">{p.name}</span>
                <span className="esec-tile-meta">{p.farm}</span>
                <span className="esec-tile-meta" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Package size={13} /> {p.products.join(', ') || 'Sin productos'}
                </span>
                <span className="esec-tile-meta"><strong>{p.lots}</strong> lote(s) disponible(s)</span>
                <div className="esec-tile-foot">
                  <button className="esec-tile-btn" onClick={() => navigate('/dashboard/exporter/explorar')}>
                    Ver lotes →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Contacts
