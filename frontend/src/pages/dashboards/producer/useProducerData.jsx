import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../../app/providers/AuthContext'
import { producerApi } from '../../../shared/api/producerApi'
import { lotApi } from '../../../shared/api/lotApi'
import { leadApi } from '../../../shared/api/leadApi'
import { certificationApi } from '../../../shared/api/certificationApi'
import { dashboardApi } from '../../../shared/api/dashboardApi'

const ProducerDataContext = createContext(null)

export function ProducerDataProvider({ children }) {
  const { user } = useAuth()
  const producerId = user?.profileId

  const [producer, setProducer]   = useState(null)
  const [lots, setLots]           = useState([])
  const [leads, setLeads]         = useState([])
  const [applications, setApps]   = useState([])
  const [stats, setStats]         = useState(null)
  const [finance, setFinance]     = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  const load = useCallback(async () => {
    if (!producerId) return
    setLoading(true)
    setError(null)
    try {
      const results = await Promise.allSettled([
        producerApi.getById(producerId),
        lotApi.getByProducer(producerId),
        leadApi.getAll(),
        certificationApi.getApplications(producerId),
        dashboardApi.getStats(),
        producerApi.getFinance(producerId),
      ])
      const [pRes, lRes, leRes, cRes, sRes, fRes] = results
      if (pRes.status === 'fulfilled')  setProducer(pRes.value.data)
      if (lRes.status === 'fulfilled')  setLots(lRes.value.data ?? [])
      if (leRes.status === 'fulfilled') setLeads(leRes.value.data ?? [])
      if (cRes.status === 'fulfilled')  setApps(cRes.value.data ?? [])
      if (sRes.status === 'fulfilled')  setStats(sRes.value.data ?? null)
      if (fRes.status === 'fulfilled')  setFinance(fRes.value.data ?? null)
      const firstError = results.find(r => r.status === 'rejected')
      if (firstError) setError(firstError.reason?.message ?? 'Error cargando datos')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [producerId])

  useEffect(() => { load() }, [load])

  const value = {
    producerId, producer, lots, leads, applications, stats, finance,
    loading, error, refresh: load,
  }

  return (
    <ProducerDataContext.Provider value={value}>
      {children}
    </ProducerDataContext.Provider>
  )
}

export function useProducerData() {
  const ctx = useContext(ProducerDataContext)
  if (!ctx) throw new Error('useProducerData must be used inside ProducerDataProvider')
  return ctx
}
