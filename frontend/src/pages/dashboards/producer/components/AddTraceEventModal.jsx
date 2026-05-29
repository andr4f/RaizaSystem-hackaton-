import { useState } from 'react'
import Modal from './Modal'
import { lotApi } from '../../../../shared/api/lotApi'

// Tipos de evento que un productor registra manualmente
const EVENT_TYPES = [
  { value: 'CULTIVATION_UPDATED', label: 'Actualización de cultivo' },
  { value: 'HARVEST_COMPLETED',   label: 'Cosecha completada' },
  { value: 'QUALITY_CHECKED',     label: 'Control de calidad' },
  { value: 'CERTIFICATION_SUBMITTED', label: 'Certificación enviada' },
]

const AddTraceEventModal = ({ lot, onClose, onCreated }) => {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    eventType: 'HARVEST_COMPLETED',
    title: '',
    description: '',
    metricName: '',
    metricValue: '',
    metricUnit: '',
  })

  const set = (k) => (e) => setForm(s => ({ ...s, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await lotApi.createEvent(lot.id, {
        lotId: lot.id,
        eventType: form.eventType,
        eventTimestamp: new Date().toISOString(),
        actorType: 'PRODUCER',
        title: form.title,
        description: form.description || null,
        metricName: form.metricName || null,
        metricValue: form.metricValue || null,
        metricUnit: form.metricUnit || null,
      })
      onCreated?.()
      onClose()
    } catch (err) {
      setError(err.message || 'No se pudo registrar el evento.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title="Registrar evento de trazabilidad"
      subtitle={`Lote ${lot.lotCode}`}
      onClose={onClose}
    >
      <form className="rz-form" onSubmit={handleSubmit}>
        {error && <div className="rz-error">{error}</div>}

        <div className="rz-field">
          <label className="rz-label">Tipo de evento <span className="req">*</span></label>
          <select className="rz-select" value={form.eventType} onChange={set('eventType')}>
            {EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <div className="rz-field">
          <label className="rz-label">Título <span className="req">*</span></label>
          <input className="rz-input" value={form.title} onChange={set('title')} placeholder="Cosecha finalizada" required />
        </div>

        <div className="rz-field">
          <label className="rz-label">Descripción</label>
          <textarea className="rz-textarea" value={form.description} onChange={set('description')} placeholder="Detalles del evento…" />
        </div>

        <div className="rz-field-row">
          <div className="rz-field">
            <label className="rz-label">Métrica</label>
            <input className="rz-input" value={form.metricName} onChange={set('metricName')} placeholder="humedad" />
          </div>
          <div className="rz-field">
            <label className="rz-label">Valor / unidad</label>
            <div className="rz-field-row" style={{ gap: 8 }}>
              <input className="rz-input" value={form.metricValue} onChange={set('metricValue')} placeholder="63" />
              <input className="rz-input" value={form.metricUnit} onChange={set('metricUnit')} placeholder="%" />
            </div>
          </div>
        </div>

        <div className="rz-form-actions">
          <button type="button" className="rz-btn rz-btn--ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" className="rz-btn rz-btn--primary" disabled={submitting}>
            {submitting ? 'Guardando…' : 'Registrar evento'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default AddTraceEventModal
