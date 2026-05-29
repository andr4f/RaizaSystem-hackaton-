import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../../app/providers/AuthContext'
import { lotApi } from '../../../shared/api/lotApi'
import { leadApi } from '../../../shared/api/leadApi'
import { productApi } from '../../../shared/api/productApi'
import { certificationApi } from '../../../shared/api/certificationApi'

const ExporterDataContext = createContext(null)

// Estados de lote que un exportador considera "verificados / listos para exportar".
const VERIFIED_STATUSES = ['AVAILABLE', 'RESERVED', 'IN_EXPORT_REVIEW', 'SOLD']

export function ExporterDataProvider({ children }) {
  const { user } = useAuth()

  const [lots, setLots]         = useState([])
  const [leads, setLeads]       = useState([])
  const [products, setProducts] = useState([])
  const [certs, setCerts]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const results = await Promise.allSettled([
        lotApi.getAll(),
        leadApi.getAll(),
        productApi.getAll(),
        certificationApi.getCatalog(),
      ])
      const [lRes, leRes, pRes, cRes] = results
      if (lRes.status === 'fulfilled')  setLots(lRes.value.data ?? [])
      if (leRes.status === 'fulfilled') setLeads(leRes.value.data ?? [])
      if (pRes.status === 'fulfilled')  setProducts(pRes.value.data ?? [])
      if (cRes.status === 'fulfilled')  setCerts(cRes.value.data ?? [])
      const firstError = results.find(r => r.status === 'rejected')
      if (firstError) setError(firstError.reason?.message ?? 'Error cargando datos')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const verifiedLots = lots.filter(l => VERIFIED_STATUSES.includes(l.status))

  const value = {
    user, lots, verifiedLots, leads, products, certs,
    loading, error, refresh: load,
  }

  return (
    <ExporterDataContext.Provider value={value}>
      {children}
    </ExporterDataContext.Provider>
  )
}

export function useExporterData() {
  const ctx = useContext(ExporterDataContext)
  if (!ctx) throw new Error('useExporterData must be used inside ExporterDataProvider')
  return ctx
}
