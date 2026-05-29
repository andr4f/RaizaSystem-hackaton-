import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  BadgeCheck, MapPin, Leaf, Mountain, Droplets, Package,
  ShieldCheck, CheckCircle2, X,
} from 'lucide-react'
import { publicTraceApi } from '../../shared/api/publicTraceApi'
import heroImg from '../landing/assets/imagen-cafe-tabi.png'
import './PublicTracePage.css'

const CERTIFIER_LABEL = {
  FAIRTRADE: 'Fairtrade',
  RAINFOREST_ALLIANCE: 'Rainforest Alliance',
  UTZ: 'UTZ',
  ORGANIC: 'Biolatina',
}

function fmtDate(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch { return iso }
}

function fmtDateTime(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch { return iso }
}

function certLabel(issuer) {
  if (!issuer) return 'Certificador'
  return CERTIFIER_LABEL[issuer] || issuer.replace(/_/g, ' ')
}

/** QR de lote/producto → /trace/{qrCodeValue}. No usar para experiencias turísticas. */
const PublicTracePage = () => {
  const { qrSlug } = useParams()
  const [trace, setTrace] = useState(null)
  const [producer, setProducer] = useState(null)
  const [scanDate, setScanDate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [leadOpen, setLeadOpen] = useState(false)
  const [leadForm, setLeadForm] = useState({ buyerName: '', email: '', phone: '', message: '' })
  const [leadSending, setLeadSending] = useState(false)
  const [leadSent, setLeadSent] = useState(false)
  const [leadError, setLeadError] = useState(null)

  useEffect(() => {
    if (!qrSlug) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const scanKey = `trace-scan-${qrSlug}`
        if (!sessionStorage.getItem(scanKey)) {
          try {
            await publicTraceApi.scan(qrSlug)
            sessionStorage.setItem(scanKey, new Date().toISOString())
          } catch {
            /* escaneo opcional */
          }
        }
        const scannedAt = sessionStorage.getItem(scanKey) || new Date().toISOString()
        if (!cancelled) setScanDate(scannedAt)

        const traceRes = await publicTraceApi.getTrace(qrSlug)
        const data = traceRes.data
        if (cancelled) return
        setTrace(data)

        if (data.producerId) {
          const prodRes = await publicTraceApi.getProducer(data.producerId)
          if (!cancelled) setProducer(prodRes.data)
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'No se pudo cargar la trazabilidad.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [qrSlug])

  const location = useMemo(() => {
    if (!trace) return 'Magdalena, Colombia'
    const parts = [trace.farmMunicipality, trace.corregimiento].filter(Boolean)
    if (parts.length) return parts.join(' · ')
    return trace.producerMunicipality
      ? `${trace.producerMunicipality}, Sierra Nevada de Santa Marta`
      : 'Sierra Nevada de Santa Marta'
  }, [trace])

  const attrs = useMemo(() => [
    { icon: Leaf, label: 'Categoría', value: trace?.productCategory || '—' },
    { icon: Mountain, label: 'Variedad', value: trace?.qualityGrade || '—' },
    { icon: Droplets, label: 'Proceso', value: trace?.processType || '—' },
    { icon: MapPin, label: 'Altitud', value: trace?.altitudeMeters ? `${trace.altitudeMeters} msnm` : '—' },
  ], [trace])

  const submitLead = async (e) => {
    e.preventDefault()
    if (!trace?.lotId) return
    setLeadSending(true)
    setLeadError(null)
    try {
      await publicTraceApi.createLead(qrSlug, {
        lotId: trace.lotId,
        buyerType: 'INDIVIDUAL',
        buyerName: leadForm.buyerName.trim(),
        email: leadForm.email.trim() || null,
        phone: leadForm.phone.trim() || null,
        message: leadForm.message.trim() || 'Solicitud de información desde la página pública de trazabilidad.',
        country: 'Colombia',
        preferredLanguage: 'es',
        sourceType: 'PUBLIC_QR',
        sourceReference: qrSlug,
      })
      setLeadSent(true)
      setLeadOpen(false)
    } catch (err) {
      setLeadError(err.message || 'No se pudo enviar la solicitud.')
    } finally {
      setLeadSending(false)
    }
  }

  if (loading) {
    return <div className="ptr ptr-loading">Cargando trazabilidad del producto…</div>
  }

  if (error || !trace) {
    return (
      <div className="ptr ptr-error">
        <h1>Producto no encontrado</h1>
        <p>{error || 'El código QR no corresponde a un lote registrado.'}</p>
      </div>
    )
  }

  const producerName = producer?.name || trace.producerName
  const producerBio = producer?.bio
    || 'Productor comprometido con prácticas sostenibles y la calidad de origen en el Magdalena.'
  const producerLocation = producer
    ? `${trace.farmName || producer.communityName || producer.municipality}, ${producer.municipality}`
    : `${trace.farmName}, ${trace.farmMunicipality || trace.producerMunicipality}`

  return (
    <div className="ptr">
      {/* Hero */}
      <header className="ptr-hero" style={{ backgroundImage: `url(${heroImg})` }}>
        <div className="ptr-hero-overlay" />
        <div className="ptr-hero-inner">
          <img src="/logo-nombre.svg" alt="Raíza" className="ptr-logo" />
          <div className="ptr-hero-badge">
            <BadgeCheck size={14} /> Producto trazado
          </div>
          <h1>{trace.productName}</h1>
          <div className="ptr-hero-meta">
            <span><Leaf size={14} /> {trace.farmName}</span>
            <span><MapPin size={14} /> {location}</span>
          </div>
          {scanDate && (
            <p className="ptr-scan-note">
              Escaneado el {fmtDateTime(scanDate)}. Gracias por apoyar lo auténtico.
            </p>
          )}
          <button type="button" className="ptr-btn ptr-btn--light" onClick={() => setLeadOpen(true)}>
            Solicitar información
          </button>
        </div>
      </header>

      <main className="ptr-main">
        {/* Historia */}
        <section className="ptr-section">
          <h2><ShieldCheck size={18} /> Historia del producto</h2>
          <p className="ptr-story">{trace.productDescription}</p>
          <div className="ptr-attrs">
            {attrs.map(({ icon: Icon, label, value }) => (
              <div key={label} className="ptr-attr">
                <Icon size={18} />
                <div>
                  <span className="ptr-attr-label">{label}</span>
                  <strong>{value}</strong>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="ptr-grid">
          {/* Timeline */}
          <section className="ptr-section ptr-timeline-section">
            <h2>Trazabilidad del lote</h2>
            <p className="ptr-sub">Código: <code>{trace.lotCode}</code></p>
            {trace.timeline?.length === 0 ? (
              <p className="ptr-empty">Este lote aún no tiene eventos de trazabilidad registrados.</p>
            ) : (
              <ol className="ptr-timeline">
                {trace.timeline.map((ev, i) => (
                  <li key={`${ev.eventType}-${i}`} className="ptr-timeline-item">
                    <div className="ptr-timeline-dot"><CheckCircle2 size={16} /></div>
                    <div className="ptr-timeline-body">
                      <div className="ptr-timeline-head">
                        <strong>{ev.title}</strong>
                        <span>{fmtDate(ev.eventTimestamp)}</span>
                      </div>
                      <p>{ev.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <aside className="ptr-aside">
            {/* Certificaciones */}
            <section className="ptr-card">
              <h3>Certificaciones</h3>
              {trace.certifications?.length === 0 ? (
                <p className="ptr-empty-sm">Sin certificaciones registradas.</p>
              ) : (
                <ul className="ptr-certs">
                  {trace.certifications.map(c => (
                    <li key={c.certificateCode}>
                      <Package size={16} />
                      <div>
                        <strong>{c.name}</strong>
                        <span>Certificado por {certLabel(c.issuer)}</span>
                        {c.validTo && <span>Válido hasta {fmtDate(c.validTo)}</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Productor */}
            <section className="ptr-card ptr-producer">
              <h3>Productor</h3>
              <div className="ptr-producer-head">
                <div className="ptr-avatar">{producerName.charAt(0)}</div>
                <div>
                  <strong>{producerName}</strong>
                  <span>{producerLocation}</span>
                </div>
              </div>
              <p className="ptr-producer-bio">{producerBio}</p>
              <button type="button" className="ptr-btn ptr-btn--outline" onClick={() => setLeadOpen(true)}>
                Conocer al productor
              </button>
            </section>
          </aside>
        </div>

        {/* CTA */}
        <section className="ptr-cta">
          <div className="ptr-cta-inner">
            <h2>¿Interesado en este producto?</h2>
            <p>
              Conecta con nosotros y recibe más información sobre disponibilidad y compras.
              Apoya directamente a los productores locales.
            </p>
            <div className="ptr-cta-actions">
              <button type="button" className="ptr-btn ptr-btn--primary" onClick={() => setLeadOpen(true)}>
                Solicitar información
              </button>
              <button type="button" className="ptr-btn ptr-btn--ghost-white" onClick={() => setLeadOpen(true)}>
                Contactar productor
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="ptr-footer">
        <div className="ptr-footer-values">
          <span>Trazabilidad verificada</span>
          <span>Origen Magdalena</span>
          <span>Sostenible</span>
          <span>Calidad garantizada</span>
        </div>
        <p>© {new Date().getFullYear()} Raíza. Trazabilidad que genera confianza.</p>
      </footer>

      {leadSent && (
        <div className="ptr-toast">¡Solicitud enviada! El productor recibirá tu mensaje.</div>
      )}

      {/* Modal lead */}
      {leadOpen && (
        <div className="ptr-modal-backdrop" onClick={() => setLeadOpen(false)}>
          <div className="ptr-modal" onClick={e => e.stopPropagation()}>
            <button type="button" className="ptr-modal-close" onClick={() => setLeadOpen(false)} aria-label="Cerrar">
              <X size={18} />
            </button>
            <h3>Solicitar información</h3>
            <p className="ptr-modal-sub">Sobre {trace.productName} · {trace.farmName}</p>
            <form onSubmit={submitLead}>
              <label>
                Nombre *
                <input required value={leadForm.buyerName} onChange={e => setLeadForm(f => ({ ...f, buyerName: e.target.value }))} />
              </label>
              <label>
                Correo
                <input type="email" value={leadForm.email} onChange={e => setLeadForm(f => ({ ...f, email: e.target.value }))} />
              </label>
              <label>
                Teléfono
                <input value={leadForm.phone} onChange={e => setLeadForm(f => ({ ...f, phone: e.target.value }))} />
              </label>
              <label>
                Mensaje
                <textarea rows={3} value={leadForm.message} onChange={e => setLeadForm(f => ({ ...f, message: e.target.value }))} placeholder="Cuéntanos qué te interesa de este producto…" />
              </label>
              {leadError && <p className="ptr-form-error">{leadError}</p>}
              <button type="submit" className="ptr-btn ptr-btn--primary ptr-btn--full" disabled={leadSending}>
                {leadSending ? 'Enviando…' : 'Enviar solicitud'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PublicTracePage
