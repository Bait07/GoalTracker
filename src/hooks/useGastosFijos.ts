import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { GastoFijo } from '../types'

export function useGastosFijos() {
  const [gastos, setGastos] = useState<GastoFijo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from('gasto_fijo').select('*').order('nombre')
    if (error) setError(error.message)
    else setGastos(data as GastoFijo[])
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function createGasto(input: Omit<GastoFijo, 'id'>) {
    const { error } = await supabase.from('gasto_fijo').insert(input)
    if (error) return { error: error.message }
    await refresh()
    return { error: null }
  }

  async function updateGasto(id: string, changes: Partial<GastoFijo>) {
    const { error } = await supabase.from('gasto_fijo').update(changes).eq('id', id)
    if (error) return { error: error.message }
    await refresh()
    return { error: null }
  }

  async function deleteGasto(id: string) {
    const { error } = await supabase.from('gasto_fijo').delete().eq('id', id)
    if (error) return { error: error.message }
    await refresh()
    return { error: null }
  }

  return { gastos, loading, error, createGasto, updateGasto, deleteGasto, refresh }
}
