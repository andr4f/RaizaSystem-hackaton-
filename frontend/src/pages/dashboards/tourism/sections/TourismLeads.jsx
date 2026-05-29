import { Inbox, Info } from 'lucide-react'
import './sections.css'

// Placeholder: el back aún no expone solicitudes/leads dirigidos al operador turístico.
const TourismLeads = () => (
  <div className="tsec">
    <div className="tsec-head">
      <div>
        <h1>Leads y solicitudes</h1>
        <p>Solicitudes de información y leads de visitantes interesados en tus experiencias.</p>
      </div>
    </div>

    <div className="tsec-notice">
      <Info size={16} />
      <span>
        El módulo de leads turísticos aún no tiene endpoints en el back
        (<code>GET /tourism/leads</code>). Esta vista quedará lista para conectarse cuando existan.
      </span>
    </div>

    <div className="tsec-empty">
      <Inbox size={32} className="tsec-empty-icon" />
      <p>Cuando un visitante solicite información, aquí verás su mensaje y podrás responderle.</p>
    </div>
  </div>
)

export default TourismLeads
