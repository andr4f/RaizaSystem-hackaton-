import { useState, useEffect, useCallback } from 'react'
import { Route, MapPin, Plus } from 'lucide-react'
import { useProducerData } from '../useProducerData'
import { lotApi } from '../../../../shared/api/lotApi'
import AddTraceEventModal from '../components/AddTraceEventModal'
import './sections.css'
import './Traceability.css'

const EVENT_LABEL = {
  HARVESTED: 'Cosechado', PROCESSED: 'Procesado', PACKAGED: 'Empacado',
  SHIPPED: 'Enviado', QR_SCANNED: 'QR escaneado', CERTIFIED: 'Certificado',
  QUALITY_CHECK: 'Control de calidad', RECEIVED: 'Recibido',
}

function fmt(iso) {
  if (!iso) return '—'
  try { return new Date(iso).toLocaleString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }
  catch { return iso }
}

const TraceabilityEvents = () => {
  const { lots } = useProducerData()
  const [selectedLot, setSelectedLot] = useState('')
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showAdd, setShowAdd] = useState(false)

  const lotObj = lots.find(l => String(l.id) === String(selectedLot))

  useEffect(() => {
    if (!selectedLot && lots.length > 0) setSelectedLot(String(lots[0].id))
  }, [lots, selectedLot])

  const loadEvents = useCallback(() => {
    if (!selectedLot) return
    setLoading(true); setError(null)
    lotApi.getEvents(selectedLot)
      .then(res => setEvents(res.data ?? []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [selectedLot])

  useEffect(() => { loadEvents() }, [loadEvents])

  return (
    <div className="sec">
      <div className="sec-head">
        <div>
          <h1>Trazabilidad</h1>
          <p>Sigue el recorrido de cada lote desde la cosecha hasta el comprador.</p>
        </div>
        {lots.length > 0 && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <select className="trz-select" value={selectedLot} onChange={e => setSelectedLot(e.target.value)}>
              {lots.map(l => <option key={l.id} value={l.id}>{l.lotCode} — {l.productName}</option>)}
            </select>
            <button className="sec-btn" onClick={() => setShowAdd(true)} disabled={!selectedLot}>
              <Plus size={16} /> Agregar evento
            </button>
          </div>
        )}
      </div>

      {showAdd && lotObj && (
        <AddTraceEventModal
          lot={lotObj}
          onClose={() => setShowAdd(false)}
          onCreated={loadEvents}
        />
      )}

      {lots.length === 0 && (
        <div className="sec-empty"><Route size={32} className="sec-empty-icon" /><p>Registra un lote para ver su trazabilidad.</p></div>
      )}

      {loading && <div className="sec-loading">Cargando eventos…</div>}
      {error && !loading && <div className="sec-error">{error}</div>}

      {!loading && !error && selectedLot && events.length === 0 && (
        <div className="sec-empty"><Route size={32} className="sec-empty-icon" /><p>Este lote aún no tiene eventos de trazabilidad.</p></div>
      )}

      {!loading && events.length > 0 && (
        <div className="trz-timeline">
          {events.map(ev => (
            <div key={ev.id} className="trz-event">
              <div className="trz-dot" />
              <div className="trz-content">
                <div className="trz-event-head">
                  <span className="trz-event-title">{ev.title || EVENT_LABEL[ev.eventType] || ev.eventType}</span>
                  <span className="trz-event-time">{fmt(ev.eventTimestamp)}</span>
                </div>
                {ev.description && <p className="trz-event-desc">{ev.description}</p>}
                <div className="trz-event-meta">
                  <span className={`sec-badge sec-badge--gray`}>{EVENT_LABEL[ev.eventType] || ev.eventType}</span>
                  {ev.latitude && ev.longitude && (
                    <span className="trz-geo"><MapPin size={12} /> {Number(ev.latitude).toFixed(3)}, {Number(ev.longitude).toFixed(3)}</span>
                  )}
                  {ev.metricName && <span className="trz-metric">{ev.metricName}: {ev.metricValue} {ev.metricUnit}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TraceabilityEvents
