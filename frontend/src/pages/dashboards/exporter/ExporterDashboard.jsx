import { useState } from 'react'
import DashboardLayout from '../../../shared/components/DashboardLayout'
import ReviewsList from './sections/ReviewsList'
import ReviewDetail from './sections/ReviewDetail'
import ReviewForm from './sections/ReviewForm'
import './ExporterDashboard.css'

const SECTIONS = {
  REVIEWS: 'reviews',
  REVIEW_DETAIL: 'review_detail',
  NEW_REVIEW: 'new_review',
}

const ExporterDashboard = () => {
  const [activeSection, setActiveSection] = useState(SECTIONS.REVIEWS)
  const [selectedReviewId, setSelectedReviewId] = useState(null)

  const navItems = [
    {
      id: SECTIONS.REVIEWS,
      label: 'Reviews',
      active: activeSection === SECTIONS.REVIEWS,
      onClick: () => setActiveSection(SECTIONS.REVIEWS),
    },
    {
      id: SECTIONS.NEW_REVIEW,
      label: 'Nueva Review',
      active: activeSection === SECTIONS.NEW_REVIEW,
      onClick: () => setActiveSection(SECTIONS.NEW_REVIEW),
    },
  ]

  const handleSelectReview = (reviewId) => {
    setSelectedReviewId(reviewId)
    setActiveSection(SECTIONS.REVIEW_DETAIL)
  }

  const handleBackToReviews = () => {
    setActiveSection(SECTIONS.REVIEWS)
  }

  const renderSection = () => {
    switch (activeSection) {
      case SECTIONS.REVIEWS:
        return <ReviewsList onSelectReview={handleSelectReview} />
      case SECTIONS.REVIEW_DETAIL:
        return <ReviewDetail reviewId={selectedReviewId} onBack={handleBackToReviews} />
      case SECTIONS.NEW_REVIEW:
        return <ReviewForm onSuccess={handleBackToReviews} />
      default:
        return null
    }
  }

  return (
    <DashboardLayout navItems={navItems} roleLabel="Exportador">
      {renderSection()}
    </DashboardLayout>
  )
}

export default ExporterDashboard
