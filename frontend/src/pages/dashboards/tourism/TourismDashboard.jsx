import { useState } from 'react'
import DashboardLayout from '../../../shared/components/DashboardLayout'
import ExperiencesList from './sections/ExperiencesList'
import ExperienceDetail from './sections/ExperienceDetail'
import ExperienceForm from './sections/ExperienceForm'
import LinkedLots from './sections/LinkedLots'
import './TourismDashboard.css'

const SECTIONS = {
  EXPERIENCES: 'experiences',
  EXPERIENCE_DETAIL: 'experience_detail',
  NEW_EXPERIENCE: 'new_experience',
  LINKED_LOTS: 'linked_lots',
}

const TourismDashboard = () => {
  const [activeSection, setActiveSection] = useState(SECTIONS.EXPERIENCES)
  const [selectedExperienceId, setSelectedExperienceId] = useState(null)

  const navItems = [
    {
      id: SECTIONS.EXPERIENCES,
      label: 'Mis Experiencias',
      active: activeSection === SECTIONS.EXPERIENCES,
      onClick: () => setActiveSection(SECTIONS.EXPERIENCES),
    },
    {
      id: SECTIONS.NEW_EXPERIENCE,
      label: 'Nueva Experiencia',
      active: activeSection === SECTIONS.NEW_EXPERIENCE,
      onClick: () => setActiveSection(SECTIONS.NEW_EXPERIENCE),
    },
    {
      id: SECTIONS.LINKED_LOTS,
      label: 'Lotes Vinculados',
      active: activeSection === SECTIONS.LINKED_LOTS,
      onClick: () => setActiveSection(SECTIONS.LINKED_LOTS),
    },
  ]

  const handleSelectExperience = (experienceId) => {
    setSelectedExperienceId(experienceId)
    setActiveSection(SECTIONS.EXPERIENCE_DETAIL)
  }

  const handleBackToExperiences = () => {
    setActiveSection(SECTIONS.EXPERIENCES)
  }

  const renderSection = () => {
    switch (activeSection) {
      case SECTIONS.EXPERIENCES:
        return <ExperiencesList onSelectExperience={handleSelectExperience} />
      case SECTIONS.EXPERIENCE_DETAIL:
        return <ExperienceDetail experienceId={selectedExperienceId} onBack={handleBackToExperiences} />
      case SECTIONS.NEW_EXPERIENCE:
        return <ExperienceForm onSuccess={handleBackToExperiences} />
      case SECTIONS.LINKED_LOTS:
        return <LinkedLots experienceId={selectedExperienceId} />
      default:
        return null
    }
  }

  return (
    <DashboardLayout navItems={navItems} roleLabel="Agente Turístico">
      {renderSection()}
    </DashboardLayout>
  )
}

export default TourismDashboard
