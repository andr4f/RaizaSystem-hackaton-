import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from '../../../app/providers/AuthContext'
import { lotApi } from '../../../shared/api/lotApi'
import { leadApi } from '../../../shared/api/leadApi'
import { productApi } from '../../../shared/api/productApi'
import { certificationApi } from '../../../shared/api/certificationApi'
import { exporterApi } from '../../../shared/api/exporterApi'

import { dashboardApi } from '../../../shared/api/dashboardApi'

const ExporterDataContext = createContext(null)

// Estados de lote que un exportador considera "verificados / listos para exportar".
const VERIFIED_STATUSES = ['AVAILABLE', 'RESERVED', 'IN_EXPORT_REVIEW', 'SOLD']

export function ExporterDataProvider({ children }) {
  const { user } = useAuth()
  const exporterId = user?.profileId

  const [exporter, setExporter] = useState(null)
  const [reviews, setReviews]   = useState([])
  const [lots, setLots]         = useState([])
  const [leads, setLeads]       = useState([])
  const [products, setProducts] = useState([])
  const [certs, setCerts]       = useState([])
  const [stats, setStats]       = useState(null)
  const [orders, setOrders]     = useState([])
  const [finance, setFinance]   = useState(null)
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
        exporterId ? exporterApi.getById(exporterId) : Promise.resolve({ data: null }),
        exporterId ? exporterApi.getReviews(exporterId) : Promise.resolve({ data: [] }),
        dashboardApi.getStats(),
        exporterId ? exporterApi.getOrders(exporterId) : Promise.resolve({ data: [] }),
        exporterId ? exporterApi.getFinance(exporterId) : Promise.resolve({ data: null }),
      ])
      const [lRes, leRes, pRes, cRes, exRes, rRes, sRes, oRes, fRes] = results
      if (lRes.status === 'fulfilled')  setLots(lRes.value.data ?? [])
      if (leRes.status === 'fulfilled') setLeads(leRes.value.data ?? [])
      if (pRes.status === 'fulfilled')  setProducts(pRes.value.data ?? [])
      if (cRes.status === 'fulfilled')  setCerts(cRes.value.data ?? [])
      if (exRes.status === 'fulfilled') setExporter(exRes.value.data ?? null)
      if (rRes.status === 'fulfilled')  setReviews(rRes.value.data ?? [])
      if (sRes.status === 'fulfilled')  setStats(sRes.value.data ?? null)
      if (oRes.status === 'fulfilled')  setOrders(oRes.value.data ?? [])
      if (fRes.status === 'fulfilled')  setFinance(fRes.value.data ?? null)
      const firstError = results.find(r => r.status === 'rejected')
      if (firstError) setError(firstError.reason?.message ?? 'Error cargando datos')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [exporterId])

  useEffect(() => { load() }, [load])

  const verifiedLots = useMemo(
    () => lots.filter(l => VERIFIED_STATUSES.includes(l.status)),
    [lots],
  )

  // Índice de lotes por id → permite resolver producto/finca de cada lead.
  const lotsById = useMemo(() => {
    const map = new Map()
    lots.forEach(l => map.set(l.id, l))
    return map
  }, [lots])

  const value = {
    user, exporter, reviews,
    lots, verifiedLots, lotsById, leads, products, certs, stats,
    orders, finance,
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
