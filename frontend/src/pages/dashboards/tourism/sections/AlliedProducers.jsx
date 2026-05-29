import { Users, Package, MapPin, Compass } from 'lucide-react'
import { useTourismData } from '../useTourismData'
import './sections.css'

const AlliedProducers = () => {
  const { alliedProducers, loading, error } = useTourismData()

  return (
    <div className="tsec">
      <div className="tsec-head">
        <div>
          <h1>Productores aliados</h1>
          <p>Productores cuyos lotes están vinculados a tus experiencias turísticas.</p>
        </div>
      </div>

      {loading && <div className="tsec-loading">Cargando aliados…</div>}
      {error && !loading && <div className="tsec-error">{error}</div>}

      {!loading && !error && alliedProducers.length === 0 && (
        <div className="tsec-empty">
          <Users size={32} className="tsec-empty-icon" />
          <p>Aún no tienes productores aliados. Vincula lotes a tus experiencias para conectarlos.</p>
        </div>
      )}

      {!loading && alliedProducers.length > 0 && (
        <div className="tsec-grid">
          {alliedProducers.map(p => (
            <div key={p.key} className="tsec-tile">
              <div className="tsec-tile-body">
                <span className="tsec-tile-name">{p.name}</span>
                <span className="tsec-tile-meta"><MapPin size={13} /> {p.farm}{p.municipality ? ` · ${p.municipality}` : ''}</span>
                <span className="tsec-tile-meta"><Package size={13} /> {p.products.join(', ') || 'Sin productos'}</span>
                <span className="tsec-tile-meta"><Compass size={13} /> <strong>{p.experiences}</strong> experiencia(s)</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AlliedProducers
