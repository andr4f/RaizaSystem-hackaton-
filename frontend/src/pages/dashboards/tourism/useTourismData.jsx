import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from '../../../app/providers/AuthContext'
import { tourismApi } from '../../../shared/api/tourismApi'
import { lotApi } from '../../../shared/api/lotApi'

const TourismDataContext = createContext(null)

export function TourismDataProvider({ children }) {
  const { user } = useAuth()
  const operatorId = user?.profileId

  const [operator, setOperator]       = useState(null)
  const [experiences, setExperiences] = useState([])
  const [lotsByExp, setLotsByExp]     = useState({}) // { [experienceId]: ExperienceLotResponse[] }
  const [lots, setLots]               = useState([]) // catálogo de lotes (para vincular / aliados)
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const results = await Promise.allSettled([
        tourismApi.getOperators(),
        operatorId ? tourismApi.getOperatorExperiences(operatorId) : Promise.resolve({ data: [] }),
        lotApi.getAll(),
      ])
      const [opRes, exRes, lotRes] = results

      if (opRes.status === 'fulfilled') {
        const all = opRes.value.data ?? []
        setOperator(all.find(o => o.id === operatorId) ?? all[0] ?? null)
      }
      if (lotRes.status === 'fulfilled') setLots(lotRes.value.data ?? [])

      const exps = exRes.status === 'fulfilled' ? (exRes.value.data ?? []) : []
      setExperiences(exps)

      // Cargar los lotes vinculados de cada experiencia en paralelo.
      const lotResults = await Promise.allSettled(
        exps.map(e => tourismApi.getExperienceLots(e.id)),
      )
      const map = {}
      exps.forEach((e, i) => {
        const r = lotResults[i]
        map[e.id] = r.status === 'fulfilled' ? (r.value.data ?? []) : []
      })
      setLotsByExp(map)

      const firstError = results.find(r => r.status === 'rejected')
      if (firstError) setError(firstError.reason?.message ?? 'Error cargando datos')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [operatorId])

  useEffect(() => { load() }, [load])

  // Índice de lotes por id → resolver producto/finca/productor de cada vínculo.
  const lotsById = useMemo(() => {
    const map = new Map()
    lots.forEach(l => map.set(l.id, l))
    return map
  }, [lots])

  // Productores aliados derivados de los lotes vinculados a las experiencias.
  const alliedProducers = useMemo(() => {
    const map = new Map()
    Object.values(lotsByExp).flat().forEach(link => {
      const lot = lotsById.get(link.lotId)
      if (!lot) return
      const key = lot.producerId || lot.producerName || lot.farmName
      if (!key) return
      if (!map.has(key)) {
        map.set(key, {
          key,
          name: lot.producerName || 'Productor',
          farm: lot.farmName || 'Finca',
          municipality: lot.municipality || '',
          products: new Set(),
          experiences: new Set(),
        })
      }
      const entry = map.get(key)
      if (lot.productName) entry.products.add(lot.productName)
      entry.experiences.add(link.experienceId)
    })
    return [...map.values()].map(p => ({
      ...p,
      products: [...p.products],
      experiences: p.experiences.size,
    }))
  }, [lotsByExp, lotsById])

  // Nº total de lotes vinculados a través de todas las experiencias.
  const linkedLotCount = useMemo(
    () => Object.values(lotsByExp).reduce((s, arr) => s + arr.length, 0),
    [lotsByExp],
  )

  const value = {
    user, operatorId, operator,
    experiences, lotsByExp, lots, lotsById,
    alliedProducers, linkedLotCount,
    loading, error, refresh: load,
  }

  return (
    <TourismDataContext.Provider value={value}>
      {children}
    </TourismDataContext.Provider>
  )
}

export function useTourismData() {
  const ctx = useContext(TourismDataContext)
  if (!ctx) throw new Error('useTourismData must be used inside TourismDataProvider')
  return ctx
}
