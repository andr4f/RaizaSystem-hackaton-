import { Wallet, Info } from 'lucide-react'
import './sections.css'

// Placeholder: el back aún no expone endpoints financieros del operador turístico.
const TourismFinance = () => (
  <div className="tsec">
    <div className="tsec-head">
      <div>
        <h1>Finanzas</h1>
        <p>Ingresos por experiencias, comisiones y estado financiero de tu operación.</p>
      </div>
    </div>

    <div className="tsec-notice">
      <Info size={16} />
      <span>
        El módulo financiero aún no tiene endpoints en el back
        (<code>GET /tourism/finance</code>). Vista lista para conectarse cuando existan.
      </span>
    </div>

    <div className="tsec-empty">
      <Wallet size={32} className="tsec-empty-icon" />
      <p>Aquí verás los ingresos de tus experiencias, pagos y balance de operaciones.</p>
    </div>
  </div>
)

export default TourismFinance
