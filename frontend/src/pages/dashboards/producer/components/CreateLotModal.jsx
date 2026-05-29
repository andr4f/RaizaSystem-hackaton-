import { useState, useEffect } from 'react'
import Modal from './Modal'
import { useProducerData } from '../useProducerData'
import { producerApi } from '../../../../shared/api/producerApi'
import { productApi } from '../../../../shared/api/productApi'
import { lotApi } from '../../../../shared/api/lotApi'

const UNITS = ['kg', 'ton', 'lb', 'qq', 'arroba']
const NEW_FARM = '__new__'

const CreateLotModal = ({ onClose, onCreated }) => {
  const { producerId, refresh } = useProducerData()

  const [farms, setFarms] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [farmId, setFarmId] = useState('')
  const [newFarm, setNewFarm] = useState({ name: '', municipality: '', areaHectares: '' })
  const [form, setForm] = useState({
    productId: '', availableQuantity: '', unitOfMeasure: 'kg',
    harvestDate: '', processType: '', qualityGrade: '', cultivationConditions: '',
  })

  useEffect(() => {
    Promise.allSettled([producerApi.getFarms(producerId), productApi.getAll()])
      .then(([f, p]) => {
        const farmList = f.status === 'fulfilled' ? (f.value.data ?? []) : []
        const prodList = p.status === 'fulfilled' ? (p.value.data ?? []) : []
        setFarms(farmList)
        setProducts(prodList)
        setFarmId(farmList.length > 0 ? String(farmList[0].id) : NEW_FARM)
        if (prodList.length > 0) setForm(s => ({ ...s, productId: String(prodList[0].id) }))
      })
      .finally(() => setLoading(false))
  }, [producerId])

  const set = (k) => (e) => setForm(s => ({ ...s, [k]: e.target.value }))
  const setFarmField = (k) => (e) => setNewFarm(s => ({ ...s, [k]: e.target.value }))

  const creatingFarm = farmId === NEW_FARM

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      let targetFarmId = farmId
      // Crear finca primero si el usuario eligió "Nueva finca"
      if (creatingFarm) {
        if (!newFarm.name || !newFarm.municipality) {
          throw new Error('Completa el nombre y municipio de la finca.')
        }
        const farmRes = await producerApi.createFarm(producerId, {
          producerId,
          name: newFarm.name,
          municipality: newFarm.municipality,
          areaHectares: newFarm.areaHectares ? Number(newFarm.areaHectares) : null,
        })
        targetFarmId = farmRes.data.id
      }

      await lotApi.create({
        producerId,
        farmId: Number(targetFarmId),
        productId: Number(form.productId),
        harvestDate: form.harvestDate || null,
        availableQuantity: Number(form.availableQuantity),
        unitOfMeasure: form.unitOfMeasure,
        processType: form.processType || null,
        cultivationConditions: form.cultivationConditions || null,
        qualityGrade: form.qualityGrade || null,
      })

      await refresh()
      onCreated?.()
      onClose()
    } catch (err) {
      setError(err.message || 'No se pudo crear el lote.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title="Registrar nuevo lote" subtitle="El código y el QR se generan automáticamente." onClose={onClose} width={560}>
      {loading ? (
        <p className="rz-hint">Cargando fincas y productos…</p>
      ) : (
        <form className="rz-form" onSubmit={handleSubmit}>
          {error && <div className="rz-error">{error}</div>}

          {/* Finca */}
          <div className="rz-field">
            <label className="rz-label">Finca <span className="req">*</span></label>
            <select className="rz-select" value={farmId} onChange={(e) => setFarmId(e.target.value)}>
              {farms.map(f => <option key={f.id} value={f.id}>{f.name} — {f.municipality}</option>)}
              <option value={NEW_FARM}>+ Nueva finca…</option>
            </select>
          </div>

          {creatingFarm && (
            <div className="rz-field-row">
              <div className="rz-field">
                <label className="rz-label">Nombre de la finca <span className="req">*</span></label>
                <input className="rz-input" value={newFarm.name} onChange={setFarmField('name')} placeholder="Finca La Esperanza" />
              </div>
              <div className="rz-field">
                <label className="rz-label">Municipio <span className="req">*</span></label>
                <input className="rz-input" value={newFarm.municipality} onChange={setFarmField('municipality')} placeholder="Santa Marta" />
              </div>
            </div>
          )}

          {/* Producto */}
          <div className="rz-field">
            <label className="rz-label">Producto <span className="req">*</span></label>
            <select className="rz-select" value={form.productId} onChange={set('productId')} required>
              {products.length === 0 && <option value="">No hay productos</option>}
              {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.category})</option>)}
            </select>
          </div>

          {/* Cantidad + unidad */}
          <div className="rz-field-row">
            <div className="rz-field">
              <label className="rz-label">Cantidad disponible <span className="req">*</span></label>
              <input className="rz-input" type="number" min="0" step="0.01" value={form.availableQuantity} onChange={set('availableQuantity')} placeholder="1000" required />
            </div>
            <div className="rz-field">
              <label className="rz-label">Unidad <span className="req">*</span></label>
              <select className="rz-select" value={form.unitOfMeasure} onChange={set('unitOfMeasure')}>
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          {/* Cosecha + calidad */}
          <div className="rz-field-row">
            <div className="rz-field">
              <label className="rz-label">Fecha de cosecha</label>
              <input className="rz-input" type="date" value={form.harvestDate} onChange={set('harvestDate')} />
            </div>
            <div className="rz-field">
              <label className="rz-label">Grado de calidad</label>
              <input className="rz-input" value={form.qualityGrade} onChange={set('qualityGrade')} placeholder="A / Premium" />
            </div>
          </div>

          {/* Proceso */}
          <div className="rz-field">
            <label className="rz-label">Tipo de proceso</label>
            <input className="rz-input" value={form.processType} onChange={set('processType')} placeholder="WASHED / NATURAL / HONEY / FERMENTED" />
          </div>

          {/* Condiciones */}
          <div className="rz-field">
            <label className="rz-label">Condiciones de cultivo</label>
            <textarea className="rz-textarea" value={form.cultivationConditions} onChange={set('cultivationConditions')} placeholder="Sombra, altitud, riego…" />
          </div>

          <div className="rz-form-actions">
            <button type="button" className="rz-btn rz-btn--ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="rz-btn rz-btn--primary" disabled={submitting}>
              {submitting ? 'Creando…' : 'Crear lote'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}

export default CreateLotModal
