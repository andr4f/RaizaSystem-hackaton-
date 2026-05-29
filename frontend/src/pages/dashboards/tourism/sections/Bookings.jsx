import { CalendarCheck, Info } from 'lucide-react'
import './sections.css'

// Placeholder: el back aún no expone endpoints de reservas/visitantes.
const Bookings = () => (
  <div className="tsec">
    <div className="tsec-head">
      <div>
        <h1>Reservas y visitantes</h1>
        <p>Gestión de reservas de tus experiencias y seguimiento de visitantes.</p>
      </div>
    </div>

    <div className="tsec-notice">
      <Info size={16} />
      <span>
        El módulo de reservas y visitantes aún no tiene endpoints en el back
        (<code>GET /tourism/bookings</code>). Esta vista quedará lista para conectarse cuando existan.
      </span>
    </div>

    <div className="tsec-empty">
      <CalendarCheck size={32} className="tsec-empty-icon" />
      <p>Cuando un visitante reserve una experiencia, aquí verás su estado y datos de contacto.</p>
    </div>
  </div>
)

export default Bookings
