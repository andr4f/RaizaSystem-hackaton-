import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { QrCode, Download, ExternalLink } from 'lucide-react'
import { useProducerData } from '../useProducerData'
import { publicTraceApi } from '../../../../shared/api/publicTraceApi'
import './sections.css'
import './QrLabels.css'

const QrLabels = () => {
  const { lots, loading, error } = useProducerData()
  const withQr = lots.filter(l => l.qrCodeValue)

  const download = (slug, code) => {
    const canvas = document.getElementById(`qr-${slug}`)
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `qr-${code}.png`
    a.click()
  }

  return (
    <div className="sec">
      <div className="sec-head">
        <div>
          <h1>QR y etiquetas</h1>
          <p>Genera códigos QR para tus lotes. Cada QR abre la trazabilidad pública del producto.</p>
        </div>
      </div>

      {loading && <div className="sec-loading">Cargando lotes…</div>}
      {error && !loading && <div className="sec-error">{error}</div>}

      {!loading && !error && withQr.length === 0 && (
        <div className="sec-empty">
          <QrCode size={32} className="sec-empty-icon" />
          <p>Ninguno de tus lotes tiene código QR todavía.</p>
        </div>
      )}

      {!loading && withQr.length > 0 && (
        <div className="sec-grid">
          {withQr.map(lot => {
            const slug = lot.qrCodeValue
            const url = publicTraceApi.publicUrl(slug)
            return (
              <div key={lot.id} className="qr-tile">
                <div className="qr-canvas-wrap">
                  <QRCodeCanvas id={`qr-${slug}`} value={url} size={148} level="M" includeMargin />
                </div>
                <div className="qr-info">
                  <span className="qr-product">{lot.productName || 'Lote'}</span>
                  <span className="sec-mono">{lot.lotCode}</span>
                </div>
                <div className="qr-actions">
                  <button className="sec-btn" onClick={() => download(slug, lot.lotCode)}>
                    <Download size={14} /> Descargar
                  </button>
                  <a className="sec-btn sec-btn--ghost" href={url} target="_blank" rel="noreferrer">
                    <ExternalLink size={14} /> Ver pública
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

export default QrLabels
