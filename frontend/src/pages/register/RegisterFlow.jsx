import { useState } from 'react'
import RoleSelectStep from './steps/RoleSelectStep'
import ProducerStep1  from './steps/producer/ProducerStep1'
import ProducerStep2  from './steps/producer/ProducerStep2'
import ProducerStep3  from './steps/producer/ProducerStep3'
import TourismStep1   from './steps/tourism/TourismStep1'
import TourismStep2   from './steps/tourism/TourismStep2'
import TourismStep3   from './steps/tourism/TourismStep3'
import ExporterStep1  from './steps/exporter/ExporterStep1'
import ExporterStep2  from './steps/exporter/ExporterStep2'
import ExporterStep3  from './steps/exporter/ExporterStep3'
import Register       from '../../auth/Register'

const RegisterFlow = () => {
  const [step, setStep]         = useState(0)
  const [formData, setFormData] = useState({})

  const mergeData = (partial) => setFormData(prev => ({ ...prev, ...partial }))
  const goNext    = (data = {}) => { mergeData(data); setStep(s => s + 1) }
  const goBack    = ()           => setStep(s => Math.max(0, s - 1))

  // Step 0 — selección de rol (todos los roles)
  if (step === 0) {
    return <RoleSelectStep onNext={(role) => { mergeData({ role }); setStep(1) }} />
  }

  // Pasos del PRODUCTOR
  if (formData.role === 'PRODUCER') {
    if (step === 1) return <ProducerStep1 onNext={goNext} onBack={goBack} currentStep={1} />
    if (step === 2) return <ProducerStep2 onNext={goNext} onBack={goBack} currentStep={2} />
    if (step === 3) return <ProducerStep3 onNext={goNext} onBack={goBack} currentStep={3} />
    // El rol ya viene en formData — Register lo recibe y oculta el selector
    if (step === 4) return <Register defaultRole={formData.role} />
  }

  // Pasos del OPERADOR TURÍSTICO
  if (formData.role === 'TOURISM_OPERATOR') {
    if (step === 1) return <TourismStep1 onNext={goNext} onBack={goBack} currentStep={1} />
    if (step === 2) return <TourismStep2 onNext={goNext} onBack={goBack} currentStep={2} />
    if (step === 3) return <TourismStep3 onNext={goNext} onBack={goBack} currentStep={3} />
    if (step === 4) return <Register defaultRole={formData.role} />
  }

  // Pasos del EXPORTADOR
  if (formData.role === 'EXPORTER') {
    if (step === 1) return <ExporterStep1 onNext={goNext} onBack={goBack} currentStep={1} />
    if (step === 2) return <ExporterStep2 onNext={goNext} onBack={goBack} currentStep={2} />
    if (step === 3) return <ExporterStep3 onNext={goNext} onBack={goBack} currentStep={3} />
    if (step === 4) return <Register defaultRole={formData.role} />
  }

  // TODO: pasos para BUYER

  return null
}

export default RegisterFlow
