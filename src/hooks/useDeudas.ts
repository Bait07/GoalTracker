import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Deuda } from '../types'

export function useDeudas() {
  const [deudas, setDeudas] = useState<Deuda[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from('deuda').select('*').order('nombre')
    if (error) setError(error.message)
    else setDeudas(data as Deuda[])
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function createDeuda(input: Omit<Deuda, 'id' | 'cuotas_pagadas'>) {
    const { error } = await supabase.from('deuda').insert({ ...input, cuotas_pagadas: 0 })
    if (error) return { error: error.message }
    await refresh()
    return { error: null }
  }

  async function updateDeuda(id: string, changes: Partial<Deuda>) {
    const { error } = await supabase.from('deuda').update(changes).eq('id', id)
    if (error) return { error: error.message }
    await refresh()
    return { error: null }
  }

  async function deleteDeuda(id: string) {
    const { error } = await supabase.from('deuda').delete().eq('id', id)
    if (error) return { error: error.message }
    await refresh()
    return { error: null }
  }

  return { deudas, loading, error, createDeuda, updateDeuda, deleteDeuda, refresh }
}
