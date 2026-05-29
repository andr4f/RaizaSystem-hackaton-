import { Truck, Info } from 'lucide-react'
import './sections.css'

// Placeholder: el back aún no expone endpoints de órdenes/envíos del exportador.
const Orders = () => (
  <div className="esec">
    <div className="esec-head">
      <div>
        <h1>Órdenes y envíos</h1>
        <p>Seguimiento de órdenes de compra y logística de exportación.</p>
      </div>
    </div>

    <div className="esec-notice">
      <Info size={16} />
      <span>
        El módulo de órdenes y envíos aún no tiene endpoints en el back
        (<code>GET /exporters/orders</code>). Esta vista quedará lista para conectarse cuando existan.
      </span>
    </div>

    <div className="esec-empty">
      <Truck size={32} className="esec-empty-icon" />
      <p>Cuando registres una orden, aquí verás su estado y seguimiento de envío.</p>
    </div>
  </div>
)

export default Orders
