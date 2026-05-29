import { useState } from 'react'
import { BadgeCheck, Download, Sparkles } from 'lucide-react'
import { useProducerData } from '../useProducerData'
import { certificationApi } from '../../../../shared/api/certificationApi'
import CertificationApplicationModal from '../components/CertificationApplicationModal'
import './sections.css'

const STATUS = {
  SUBMITTED: ['Enviada', 'amber'], IN_REVIEW: ['En revisión', 'amber'],
  APPROVED: ['Aprobada', 'green'], VALIDATED: ['Validada', 'green'],
  REJECTED: ['Rechazada', 'red'], DRAFT: ['Borrador', 'gray'],
}

function fmt(iso) {
  if (!iso) return '—'
  try { return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) }
  catch { return iso }
}

const Certifications = () => {
  const { applications, loading, error } = useProducerData()
  const [showCreate, setShowCreate] = useState(false)

  return (
    <div className="sec">
      <div className="sec-head">
        <div>
          <h1>Certificaciones</h1>
          <p>Solicitudes de certificación de tus lotes y su estado.</p>
        </div>
        <button className="sec-btn" onClick={() => setShowCreate(true)}><BadgeCheck size={16} /> Nueva solicitud</button>
      </div>

      {showCreate && <CertificationApplicationModal onClose={() => setShowCreate(false)} />}

      {loading && <div className="sec-loading">Cargando certificaciones…</div>}
      {error && !loading && <div className="sec-error">{error}</div>}

      {!loading && !error && applications.length === 0 && (
        <div className="sec-empty">
          <BadgeCheck size={32} className="sec-empty-icon" />
          <p>Aún no tienes solicitudes de certificación.</p>
        </div>
      )}

      {!loading && applications.length > 0 && (
        <div className="sec-card">
          <table className="sec-table">
            <thead>
              <tr>
                <th>Código</th><th>Certificación</th><th>Lote</th>
                <th>Enviada</th><th>IA</th><th>Estado</th><th>PDF</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => {
                const [label, color] = STATUS[app.status] || [app.status, 'gray']
                return (
                  <tr key={app.id}>
                    <td className="sec-mono">{app.applicationCode}</td>
                    <td>{app.certificationName}</td>
                    <td className="sec-mono">{app.lotCode || '—'}</td>
                    <td>{fmt(app.submittedAt)}</td>
                    <td>{app.recommendedByAi ? <Sparkles size={14} color="#d97706" /> : '—'}</td>
                    <td><span className={`sec-badge sec-badge--${color}`}>{label}</span></td>
                    <td>
                      <a
                        href={certificationApi.pdfUrl(app.id)}
                        target="_blank" rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="sec-mono" style={{ color: '#16a34a', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        <Download size={13} /> PDF
                      </a>
                    </td>
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

export default Certifications
