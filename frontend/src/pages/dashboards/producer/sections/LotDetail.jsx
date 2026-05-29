import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { QRCodeCanvas } from 'qrcode.react'
import { ArrowLeft, Leaf, BadgeCheck } from 'lucide-react'
import { lotApi } from '../../../../shared/api/lotApi'
import { publicTraceApi } from '../../../../shared/api/publicTraceApi'
import './sections.css'
import './LotDetail.css'

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

const LotDetail = () => {
  const { lotId } = useParams()
  const navigate = useNavigate()
  const [lot, setLot] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true); setError(null)
    lotApi.getDetail(lotId)
      .then(res => setLot(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [lotId])

  if (loading) return <div className="sec"><div className="sec-loading">Cargando lote…</div></div>
  if (error) return <div className="sec"><div className="sec-error">{error}</div></div>
  if (!lot) return null

  const [label, color] = STATUS[lot.status] || [lot.status, 'gray']
  const qrUrl = lot.qrCodeValue ? publicTraceApi.publicUrl(lot.qrCodeValue) : null

  const FIELDS = [
    ['Producto', lot.productName], ['Categoría', lot.productCategory],
    ['Finca', lot.farmName], ['Cantidad', `${lot.availableQuantity} ${lot.unitOfMeasure}`],
    ['Cosecha', fmt(lot.harvestDate)], ['Proceso', lot.processType || '—'],
    ['Calidad', lot.qualityGrade || '—'], ['Condiciones', lot.cultivationConditions || '—'],
  ]

  return (
    <div className="sec">
      <button className="ld-back" onClick={() => navigate('/dashboard/producer/lotes')}>
        <ArrowLeft size={16} /> Volver a mis lotes
      </button>

      <div className="sec-head">
        <div>
          <h1>{lot.productName || lot.lotCode}</h1>
          <p className="sec-mono">{lot.lotCode}</p>
        </div>
        <span className={`sec-badge sec-badge--${color}`}>{label}</span>
      </div>

      <div className="ld-grid">
        <div className="ld-main">
          <section className="sec-tile">
            <h3 className="ld-h3"><Leaf size={16} /> Información del lote</h3>
            <dl className="ld-fields">
              {FIELDS.map(([k, v]) => (
                <div key={k}><dt>{k}</dt><dd>{v || '—'}</dd></div>
              ))}
            </dl>
          </section>

          <section className="sec-tile">
            <h3 className="ld-h3"><BadgeCheck size={16} /> Certificaciones ({lot.certifications?.length || 0})</h3>
            {(!lot.certifications || lot.certifications.length === 0)
              ? <p className="sec-empty" style={{ padding: 16 }}>Sin certificaciones adjuntas.</p>
              : (
                <ul className="ld-certs">
                  {lot.certifications.map(c => (
                    <li key={c.id}>
                      <span>{c.certificationName}</span>
                      <span className={`sec-badge sec-badge--${c.status === 'VALIDATED' ? 'green' : 'amber'}`}>{c.status}</span>
                    </li>
                  ))}
                </ul>
              )}
          </section>
        </div>

        <aside className="ld-side">
          {qrUrl && (
            <section className="sec-tile ld-qr">
              <h3 className="ld-h3">Código QR</h3>
              <QRCodeCanvas value={qrUrl} size={150} level="M" includeMargin />
              <a href={qrUrl} target="_blank" rel="noreferrer" className="ph-link" style={{ fontSize: 12 }}>Ver vista pública</a>
            </section>
          )}
          <section className="sec-tile">
            <h3 className="ld-h3">Eventos ({lot.events?.length || 0})</h3>
            <button className="sec-btn sec-btn--ghost" style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => navigate('/dashboard/producer/trazabilidad')}>
              Ver trazabilidad completa
            </button>
          </section>
        </aside>
      </div>
    </div>
  )
}

export default LotDetail
