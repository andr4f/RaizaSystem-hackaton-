import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { useTourismData } from '../useTourismData'
import { tourismApi } from '../../../../shared/api/tourismApi'
import './sections.css'

const NewExperience = () => {
  const navigate = useNavigate()
  const { operatorId, refresh } = useTourismData()

  const [form, setForm] = useState({ title: '', locationName: '', description: '', qrSlug: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('El título es obligatorio.'); return }
    if (!operatorId) { setError('No se pudo identificar tu operador turístico.'); return }
    setSaving(true)
    setError(null)
    try {
      await tourismApi.createExperience({
        operatorId,
        title: form.title.trim(),
        locationName: form.locationName.trim() || null,
        description: form.description.trim() || null,
        qrSlug: form.qrSlug.trim() || null,
      })
      await refresh()
      navigate('/dashboard/tourism/experiencias')
    } catch (err) {
      setError(err.message || 'No se pudo crear la experiencia.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="tsec">
      <button className="tsec-back" onClick={() => navigate('/dashboard/tourism/experiencias')}>
        <ChevronLeft size={16} /> Volver a experiencias
      </button>

      <div className="tsec-head">
        <div>
          <h1>Nueva experiencia</h1>
          <p>Crea una experiencia turística que conecte visitantes con la historia del territorio.</p>
        </div>
      </div>

      <form className="tsec-form" onSubmit={submit}>
        <div className="tsec-field">
          <label>Título *</label>
          <input
            value={form.title}
            onChange={set('title')}
            placeholder="Ej. Cata de Café en Minca"
            maxLength={150}
          />
        </div>

        <div className="tsec-field">
          <label>Ubicación</label>
          <input
            value={form.locationName}
            onChange={set('locationName')}
            placeholder="Ej. Finca El Mirador - Minca"
            maxLength={150}
          />
        </div>

        <div className="tsec-field">
          <label>Descripción</label>
          <textarea
            value={form.description}
            onChange={set('description')}
            placeholder="Describe la experiencia: qué incluye, duración, qué hace especial al lugar…"
          />
        </div>

        <div className="tsec-field">
          <label>Slug del QR</label>
          <input
            value={form.qrSlug}
            onChange={set('qrSlug')}
            placeholder="cata-cafe-minca (opcional)"
            maxLength={120}
          />
          <span className="tsec-field-hint">
            Si lo dejas vacío se genera automáticamente a partir del título. Es la URL pública del QR.
          </span>
        </div>

        {error && <div className="tsec-form-error">{error}</div>}

        <div className="tsec-form-actions">
          <button type="submit" className="tsec-btn" disabled={saving}>
            {saving ? 'Creando…' : 'Crear experiencia'}
          </button>
          <button
            type="button"
            className="tsec-btn tsec-btn--ghost"
            onClick={() => navigate('/dashboard/tourism/experiencias')}
            disabled={saving}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewExperience
