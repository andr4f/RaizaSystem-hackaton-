import { Wallet, Info } from 'lucide-react'
import './sections.css'

// Placeholder: el back aún no expone endpoints financieros del exportador.
const ExporterFinance = () => (
  <div className="esec">
    <div className="esec-head">
      <div>
        <h1>Finanzas</h1>
        <p>Pagos, anticipos y estado financiero de tus operaciones de exportación.</p>
      </div>
    </div>

    <div className="esec-notice">
      <Info size={16} />
      <span>
        El módulo financiero aún no tiene endpoints en el back
        (<code>GET /exporters/finance</code>). Vista lista para conectarse cuando existan.
      </span>
    </div>

    <div className="esec-empty">
      <Wallet size={32} className="esec-empty-icon" />
      <p>Aquí verás tus pagos, comisiones y balance de operaciones.</p>
    </div>
  </div>
)

export default ExporterFinance
