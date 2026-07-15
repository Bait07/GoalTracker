import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Cajita } from '../types'

export function useCajitas() {
  const [cajitas, setCajitas] = useState<Cajita[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('cajita')
      .select('*')
      .order('prioridad', { ascending: true })
    if (error) setError(error.message)
    else setCajitas(data as Cajita[])
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function createCajita(input: Omit<Cajita, 'id' | 'valor_ahorrado'>) {
    const { error } = await supabase.from('cajita').insert({ ...input, valor_ahorrado: 0 })
    if (error) return { error: error.message }
    await refresh()
    return { error: null }
  }

  async function updateCajita(id: string, changes: Partial<Cajita>) {
    const { error } = await supabase.from('cajita').update(changes).eq('id', id)
    if (error) return { error: error.message }
    await refresh()
    return { error: null }
  }

  async function deleteCajita(id: string) {
    const { error } = await supabase.from('cajita').delete().eq('id', id)
    if (error) return { error: error.message }
    await refresh()
    return { error: null }
  }

  return { cajitas, loading, error, createCajita, updateCajita, deleteCajita, refresh }
}
