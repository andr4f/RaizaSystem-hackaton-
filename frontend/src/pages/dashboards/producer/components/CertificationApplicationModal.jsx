import { useState, useEffect } from 'react'
import Modal from './Modal'
import { useProducerData } from '../useProducerData'
import { certificationApi } from '../../../../shared/api/certificationApi'

const CertificationApplicationModal = ({ onClose, onCreated }) => {
  const { producerId, lots, refresh } = useProducerData()

  const [catalog, setCatalog] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    lotId: '', certificationId: '', estimatedVolume: '', volumeUnit: 'kg',
    cultivationType: '', destinationEmail: '',
  })

  useEffect(() => {
    certificationApi.getCatalog()
      .then(res => {
        const list = res.data ?? []
        setCatalog(list)
        setForm(s => ({
          ...s,
          certificationId: list.length > 0 ? String(list[0].id) : '',
          lotId: lots.length > 0 ? String(lots[0].id) : '',
        }))
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [lots])

  const set = (k) => (e) => setForm(s => ({ ...s, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const lot = lots.find(l => String(l.id) === String(form.lotId))
      await certificationApi.submitApplication({
        producerId,
        farmId: lot?.farmId,
        lotId: Number(form.lotId),
        certificationId: Number(form.certificationId),
        estimatedVolume: form.estimatedVolume ? Number(form.estimatedVolume) : null,
        volumeUnit: form.volumeUnit,
        cultivationType: form.cultivationType || null,
        destinationEmail: form.destinationEmail || null,
        recommendedByAi: false,
      })
      await refresh()
      onCreated?.()
      onClose()
    } catch (err) {
      setError(err.message || 'No se pudo crear la solicitud.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title="Nueva solicitud de certificación" subtitle="Asocia un lote a una certificación." onClose={onClose}>
      {loading ? (
        <p className="rz-hint">Cargando catálogo…</p>
      ) : lots.length === 0 ? (
        <p className="rz-hint">Necesitas al menos un lote registrado para solicitar una certificación.</p>
      ) : (
        <form className="rz-form" onSubmit={handleSubmit}>
          {error && <div className="rz-error">{error}</div>}

          <div className="rz-field">
            <label className="rz-label">Lote <span className="req">*</span></label>
            <select className="rz-select" value={form.lotId} onChange={set('lotId')} required>
              {lots.map(l => <option key={l.id} value={l.id}>{l.lotCode} — {l.productName}</option>)}
            </select>
          </div>

          <div className="rz-field">
            <label className="rz-label">Certificación <span className="req">*</span></label>
            <select className="rz-select" value={form.certificationId} onChange={set('certificationId')} required>
              {catalog.length === 0 && <option value="">No hay certificaciones en el catálogo</option>}
              {catalog.map(c => <option key={c.id} value={c.id}>{c.name} ({c.certifier})</option>)}
            </select>
          </div>

          <div className="rz-field-row">
            <div className="rz-field">
              <label className="rz-label">Volumen estimado</label>
              <input className="rz-input" type="number" min="0" step="0.01" value={form.estimatedVolume} onChange={set('estimatedVolume')} placeholder="500" />
            </div>
            <div className="rz-field">
              <label className="rz-label">Unidad</label>
              <select className="rz-select" value={form.volumeUnit} onChange={set('volumeUnit')}>
                {['kg', 'ton', 'lb', 'qq'].map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div className="rz-field">
            <label className="rz-label">Tipo de cultivo</label>
            <input className="rz-input" value={form.cultivationType} onChange={set('cultivationType')} placeholder="Orgánico, bajo sombra…" />
          </div>

          <div className="rz-field">
            <label className="rz-label">Correo de destino (opcional)</label>
            <input className="rz-input" type="email" value={form.destinationEmail} onChange={set('destinationEmail')} placeholder="certificadora@correo.com" />
            <span className="rz-hint">Se enviará el PDF generado de la solicitud.</span>
          </div>

          <div className="rz-form-actions">
            <button type="button" className="rz-btn rz-btn--ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="rz-btn rz-btn--primary" disabled={submitting || catalog.length === 0}>
              {submitting ? 'Enviando…' : 'Crear solicitud'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}

export default CertificationApplicationModal
