import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useSaldos() {
  const [fondoEmergencia, setFondoEmergencia] = useState(0)
  const [saldoLibre, setSaldoLibre] = useState(0)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const [fondoRes, saldoRes] = await Promise.all([
      supabase.from('fondo_emergencia').select('valor_actual').maybeSingle(),
      supabase.from('saldo_libre').select('valor_actual').maybeSingle(),
    ])
    setFondoEmergencia(fondoRes.data?.valor_actual ?? 0)
    setSaldoLibre(saldoRes.data?.valor_actual ?? 0)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function setSaldoLibreValor(nuevoValor: number, userId: string) {
    await supabase.from('saldo_libre').upsert({ user_id: userId, valor_actual: nuevoValor })
    await refresh()
  }

  async function setFondoEmergenciaValor(nuevoValor: number, userId: string) {
    await supabase.from('fondo_emergencia').upsert({ user_id: userId, valor_actual: nuevoValor })
    await refresh()
  }

  return { fondoEmergencia, saldoLibre, loading, setSaldoLibreValor, setFondoEmergenciaValor, refresh }
}
