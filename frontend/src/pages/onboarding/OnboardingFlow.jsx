import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../app/providers/AuthContext'
import WelcomeStep from './steps/WelcomeStep'

const ROLE_DASHBOARD = {
  PRODUCER: '/dashboard/producer',
  EXPORTER: '/dashboard/exporter',
  TOURISM_OPERATOR: '/dashboard/tourism',
}

const OnboardingFlow = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

  const handleStart = () => {
    // step 0 → step 1 (próximos pasos se añaden aquí)
    const dashboard = ROLE_DASHBOARD[user?.role] ?? '/'
    navigate(dashboard)
  }

  if (step === 0) {
    return <WelcomeStep onStart={handleStart} />
  }

  return null
}

export default OnboardingFlow
