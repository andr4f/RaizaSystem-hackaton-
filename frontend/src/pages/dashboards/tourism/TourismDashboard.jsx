import { TourismDataProvider } from './useTourismData'
import TourismLayout from './TourismLayout'

// Shell del dashboard del operador turístico: provee datos + layout con <Outlet/>.
// Las secciones se montan vía rutas anidadas (ver main.jsx).
const TourismDashboard = () => (
  <TourismDataProvider>
    <TourismLayout />
  </TourismDataProvider>
)

export default TourismDashboard
