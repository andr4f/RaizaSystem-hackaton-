import { QRCodeCanvas } from 'qrcode.react'
import { QrCode, Download, ExternalLink } from 'lucide-react'
import { useTourismData } from '../useTourismData'
import { publicExperienceApi } from '../../../../shared/api/publicExperienceApi'
import './sections.css'

const TourismQr = () => {
  const { experiences, loading, error } = useTourismData()
  const withQr = experiences.filter(e => e.qrSlug)

  const download = (slug, title) => {
    const canvas = document.getElementById(`tqr-${slug}`)
    if (!canvas) return
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = `qr-${title.replace(/\s+/g, '-').toLowerCase()}.png`
    a.click()
  }

  return (
    <div className="tsec">
      <div className="tsec-head">
        <div>
          <h1>QR turísticos</h1>
          <p>Cada experiencia tiene un QR que abre su historia y trazabilidad para los visitantes.</p>
        </div>
      </div>

      {loading && <div className="tsec-loading">Cargando experiencias…</div>}
      {error && !loading && <div className="tsec-error">{error}</div>}

      {!loading && !error && withQr.length === 0 && (
        <div className="tsec-empty">
          <QrCode size={32} className="tsec-empty-icon" />
          <p>Ninguna de tus experiencias tiene QR todavía.</p>
        </div>
      )}

      {!loading && withQr.length > 0 && (
        <div className="tsec-grid">
          {withQr.map(e => {
            const url = publicExperienceApi.experiencePublicUrl(e.qrSlug)
            return (
              <div key={e.id} className="tsec-qr-tile">
                <div className="tsec-qr-canvas">
                  <QRCodeCanvas id={`tqr-${e.qrSlug}`} value={url} size={150} level="M" includeMargin />
                </div>
                <span className="tsec-qr-title">{e.title}</span>
                <span className="tsec-mono">/{e.qrSlug}</span>
                <div className="tsec-qr-actions">
                  <button className="tsec-btn" onClick={() => download(e.qrSlug, e.title)}>
                    <Download size={14} /> Descargar
                  </button>
                  <a className="tsec-btn tsec-btn--ghost" href={url} target="_blank" rel="noreferrer">
                    <ExternalLink size={14} /> Ver
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default TourismQr
