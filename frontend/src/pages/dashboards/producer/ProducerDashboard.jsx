import { ProducerDataProvider } from './useProducerData'
import ProducerLayout from './ProducerLayout'

// Shell del dashboard del productor: provee datos + layout con <Outlet/>.
// Las secciones se montan vía rutas anidadas (ver main.jsx).
const ProducerDashboard = () => (
  <ProducerDataProvider>
    <ProducerLayout />
  </ProducerDataProvider>
)

export default ProducerDashboard
