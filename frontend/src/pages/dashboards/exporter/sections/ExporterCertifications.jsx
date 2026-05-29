import { BadgeCheck, Award } from 'lucide-react'
import { useExporterData } from '../useExporterData'
import './sections.css'

const ExporterCertifications = () => {
  const { certs, loading, error } = useExporterData()

  return (
    <div className="esec">
      <div className="esec-head">
        <div>
          <h1>Certificaciones</h1>
          <p>Sellos y certificaciones que respaldan los lotes de la región.</p>
        </div>
      </div>

      {loading && <div className="esec-loading">Cargando certificaciones…</div>}
      {error && !loading && <div className="esec-error">{error}</div>}

      {!loading && !error && certs.length === 0 && (
        <div className="esec-empty">
          <BadgeCheck size={32} className="esec-empty-icon" />
          <p>No hay certificaciones en el catálogo todavía.</p>
        </div>
      )}

      {!loading && certs.length > 0 && (
        <div className="esec-grid">
          {certs.map(c => (
            <div key={c.id} className="esec-tile">
              <div className="esec-tile-body">
                <div className="esec-tile-img" style={{ height: 54, borderRadius: 12, marginBottom: 4 }}>
                  <Award size={24} />
                </div>
                <span className="esec-tile-name">{c.name || c.code}</span>
                <span className="esec-tile-meta">{c.description || c.issuingBody || 'Certificación de calidad'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ExporterCertifications
