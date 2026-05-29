import { CalendarCheck, MapPin } from 'lucide-react'
import { useTourismData } from '../useTourismData'
import './sections.css'

const BOOKING_STATUS = {
  CONTACTED: ['Contactado', 'blue'],
  QUALIFIED: ['Confirmado', 'green'],
  IN_EXPORT_REVIEW: ['En proceso', 'amber'],
  CLOSED_WON: ['Completado', 'green'],
  CLOSED_LOST: ['Cancelado', 'gray'],
}

const VISIT_TYPE = {
  QR_SCANNED: 'Escaneo QR',
  LOT_RESERVED: 'Reserva confirmada',
}

function fmt(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  } catch { return iso }
}

const Bookings = () => {
  const { bookings, visits, loading, error } = useTourismData()

  return (
    <div className="tsec">
      <div className="tsec-head">
        <div>
          <h1>Reservas y visitantes</h1>
          <p>Reservas confirmadas y visitantes que interactuaron con tus experiencias.</p>
        </div>
      </div>

      {loading && <div className="tsec-loading">Cargando reservas y visitantes…</div>}
      {error && !loading && <div className="tsec-error">{error}</div>}

      {!loading && !error && (
        <>
          <section>
            <h2 className="tsec-subhead">Reservas confirmadas</h2>
            {bookings.length === 0 ? (
              <div className="tsec-empty">
                <CalendarCheck size={32} className="tsec-empty-icon" />
                <p>Aún no hay reservas en tus experiencias vinculadas.</p>
              </div>
            ) : (
              <div className="tsec-card">
                <table className="tsec-table">
                  <thead>
                    <tr>
                      <th>Visitante</th>
                      <th>Experiencia</th>
                      <th>Lote</th>
                      <th>Cantidad</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => {
                      const [label, tone] = BOOKING_STATUS[b.status] || [b.status, 'gray']
                      return (
                        <tr key={b.id}>
                          <td>{b.visitorName || 'Visitante'}</td>
                          <td>{b.experienceTitle || '—'}</td>
                          <td className="tsec-mono">{b.lotCode}</td>
                          <td>{b.requestedQuantity ? `${b.requestedQuantity} ${b.unitOfMeasure || ''}` : '—'}</td>
                          <td><span className={`tsec-badge tsec-badge--${tone}`}>{label}</span></td>
                          <td>{fmt(b.createdAt)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section>
            <h2 className="tsec-subhead">Visitantes recientes</h2>
            {visits.length === 0 ? (
              <div className="tsec-empty">
                <MapPin size={32} className="tsec-empty-icon" />
                <p>Sin visitas registradas por escaneos QR en tus lotes vinculados.</p>
              </div>
            ) : (
              <div className="tsec-card">
                <table className="tsec-table">
                  <thead>
                    <tr>
                      <th>Visitante</th>
                      <th>Experiencia</th>
                      <th>Lote</th>
                      <th>Evento</th>
                      <th>Descripción</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visits.map(v => (
                      <tr key={v.id}>
                        <td>{v.visitorName || '—'}</td>
                        <td>{v.experienceTitle || '—'}</td>
                        <td className="tsec-mono">{v.lotCode}</td>
                        <td>{VISIT_TYPE[v.eventType] || v.eventType}</td>
                        <td>{v.description || v.title || '—'}</td>
                        <td>{fmt(v.eventTimestamp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}

export default Bookings
