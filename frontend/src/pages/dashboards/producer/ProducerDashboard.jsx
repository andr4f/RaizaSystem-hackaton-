import { useState } from 'react'
import DashboardLayout from '../../../shared/components/DashboardLayout'
import LotsList from './sections/LotsList'
import LotDetail from './sections/LotDetail'
import TraceabilityEvents from './sections/TraceabilityEvents'
import AiSummary from './sections/AiSummary'
import LeadsInbox from './sections/LeadsInbox'
import './ProducerDashboard.css'

const SECTIONS = {
  LOTS: 'lots',
  LOT_DETAIL: 'lot_detail',
  TRACEABILITY: 'traceability',
  AI_SUMMARY: 'ai_summary',
  LEADS: 'leads',
}

const ProducerDashboard = () => {
  const [activeSection, setActiveSection] = useState(SECTIONS.LOTS)
  const [selectedLotId, setSelectedLotId] = useState(null)

  const navItems = [
    {
      id: SECTIONS.LOTS,
      label: 'Mis Lotes',
      active: activeSection === SECTIONS.LOTS,
      onClick: () => setActiveSection(SECTIONS.LOTS),
    },
    {
      id: SECTIONS.TRACEABILITY,
      label: 'Trazabilidad',
      active: activeSection === SECTIONS.TRACEABILITY,
      onClick: () => setActiveSection(SECTIONS.TRACEABILITY),
    },
    {
      id: SECTIONS.AI_SUMMARY,
      label: 'Resumen IA',
      active: activeSection === SECTIONS.AI_SUMMARY,
      onClick: () => setActiveSection(SECTIONS.AI_SUMMARY),
    },
    {
      id: SECTIONS.LEADS,
      label: 'Leads',
      active: activeSection === SECTIONS.LEADS,
      onClick: () => setActiveSection(SECTIONS.LEADS),
    },
  ]

  const handleSelectLot = (lotId) => {
    setSelectedLotId(lotId)
    setActiveSection(SECTIONS.LOT_DETAIL)
  }

  const handleBackToLots = () => {
    setActiveSection(SECTIONS.LOTS)
  }

  const renderSection = () => {
    switch (activeSection) {
      case SECTIONS.LOTS:
        return <LotsList onSelectLot={handleSelectLot} />
      case SECTIONS.LOT_DETAIL:
        return <LotDetail lotId={selectedLotId} onBack={handleBackToLots} />
      case SECTIONS.TRACEABILITY:
        return <TraceabilityEvents lotId={selectedLotId} />
      case SECTIONS.AI_SUMMARY:
        return <AiSummary lotId={selectedLotId} />
      case SECTIONS.LEADS:
        return <LeadsInbox />
      default:
        return null
    }
  }

  return (
    <DashboardLayout navItems={navItems} roleLabel="Productor">
      {renderSection()}
    </DashboardLayout>
  )
}

export default ProducerDashboard
