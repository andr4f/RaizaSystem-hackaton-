import { ExporterDataProvider } from './useExporterData'
import ExporterLayout from './ExporterLayout'

// Shell del dashboard del exportador: provee datos + layout con <Outlet/>.
// Las secciones se montan vía rutas anidadas (ver main.jsx).
const ExporterDashboard = () => (
  <ExporterDataProvider>
    <ExporterLayout />
  </ExporterDataProvider>
)

export default ExporterDashboard
