import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useCajitas } from '../hooks/useCajitas'
import { useDeudas } from '../hooks/useDeudas'
import { useGastosFijos } from '../hooks/useGastosFijos'
import { useSaldos } from '../hooks/useSaldos'
import { supabase } from '../lib/supabaseClient'
import {
  calcularTotalActivos,
  calcularTotalCuotasDeudas,
  calcularDisponibleParaCajitas,
  recomendarAsignacion,
} from '../lib/finance'

export default function NuevoIngresoPage() {
  const navigate = useNavigate()
  const { session } = useAuth()
  const { cajitas, refresh: refreshCajitas } = useCajitas()
  const { deudas, refresh: refreshDeudas } = useDeudas()
  const { gastos } = useGastosFijos()
  const { saldoLibre, setSaldoLibreValor } = useSaldos()

  const [monto, setMonto] = useState(0)
  const [asignaciones, setAsignaciones] = useState<Record<string, number>>({})
  const [paso, setPaso] = useState<'monto' | 'reparto'>('monto')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const totalGastosFijos = useMemo(() => calcularTotalActivos(gastos), [gastos])
  const totalDeudas = useMemo(
    () =>
      calcularTotalCuotasDeudas(
        deudas.map((d) => ({ valorCuota: d.valor_cuota, activo: d.activo }))
      ),
    [deudas]
  )
  const disponible = calcularDisponibleParaCajitas(monto, totalGastosFijos, totalDeudas)

  function irAReparto() {
    if (monto <= 0) {
      setError('Ingresa un monto mayor a 0')
      return
    }
    setError(null)
    const recomendado = recomendarAsignacion(
      cajitas.map((c) => ({
        id: c.id,
        prioridad: c.prioridad,
        precioObjetivo: c.precio_objetivo,
        valorAhorrado: c.valor_ahorrado,
        fechaObjetivo: c.fecha_objetivo,
        estado: c.estado,
      })),
      disponible
    )
    const map: Record<string, number> = {}
    for (const a of recomendado) map[a.cajitaId] = a.monto
    setAsignaciones(map)
    setPaso('reparto')
  }

  const totalAsignado = Object.values(asignaciones).reduce((s, v) => s + v, 0)
  const dineroLibreResultante = Math.max(0, disponible - totalAsignado)

  async function confirmar() {
    if (!session) return
    setSaving(true)
    setError(null)

    const { data: ingreso, error: ingresoError } = await supabase
      .from('ingreso_mensual')
      .insert({
        user_id: session.user.id,
        monto_recibido: monto,
        total_gastos_fijos: totalGastosFijos,
        total_deudas: totalDeudas,
        total_asignado_cajitas: totalAsignado,
        dinero_libre_resultante: dineroLibreResultante,
      })
      .select()
      .single()

    if (ingresoError || !ingreso) {
      setError(ingresoError?.message ?? 'Error creando el ingreso')
      setSaving(false)
      return
    }

    for (const [cajitaId, montoAsignado] of Object.entries(asignaciones)) {
      if (montoAsignado <= 0) continue
      await supabase.from('aporte_cajita').insert({
        user_id: session.user.id,
        ingreso_mensual_id: ingreso.id,
        cajita_id: cajitaId,
        monto: montoAsignado,
      })
      const cajita = cajitas.find((c) => c.id === cajitaId)
      if (cajita) {
        await supabase
          .from('cajita')
          .update({ valor_ahorrado: cajita.valor_ahorrado + montoAsignado })
          .eq('id', cajitaId)
      }
    }

    for (const deuda of deudas.filter((d) => d.activo)) {
      const nuevasCuotas = deuda.cuotas_pagadas + 1
      await supabase
        .from('deuda')
        .update({
          cuotas_pagadas: nuevasCuotas,
          activo: nuevasCuotas < deuda.total_cuotas,
        })
        .eq('id', deuda.id)
    }

    await setSaldoLibreValor(saldoLibre + dineroLibreResultante, session.user.id)
    await Promise.all([refreshCajitas(), refreshDeudas()])

    setSaving(false)
    navigate('/')
  }

  if (paso === 'monto') {
    return (
      <div className="p-4 pb-20 space-y-4">
        <h1 className="text-lg font-semibold">Nuevo ingreso</h1>
        <p className="text-sm text-gray-600">¿Cuánto recibiste?</p>
        <input
          type="number"
          min="1"
          value={monto || ''}
          onChange={(e) => setMonto(Number(e.target.value))}
          className="w-full border rounded px-3 py-2"
          autoFocus
        />
        <p className="text-sm text-gray-600">
          Gastos fijos: ${totalGastosFijos.toLocaleString('es-CO')} · Deudas: $
          {totalDeudas.toLocaleString('es-CO')}
        </p>
        <p className="font-medium">
          Disponible para cajitas: ${disponible.toLocaleString('es-CO')}
        </p>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button onClick={irAReparto} className="bg-blue-600 text-white rounded px-3 py-2 w-full">
          Ver reparto recomendado
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 pb-20 space-y-4">
      <h1 className="text-lg font-semibold">Reparto recomendado</h1>
      {cajitas
        .filter((c) => c.estado === 'Pendiente' || c.estado === 'Ahorrando')
        .map((c) => (
          <div key={c.id} className="flex justify-between items-center gap-2">
            <span className="text-sm">{c.nombre}</span>
            <input
              type="number"
              min="0"
              value={asignaciones[c.id] ?? 0}
              onChange={(e) => setAsignaciones({ ...asignaciones, [c.id]: Number(e.target.value) })}
              className="w-28 border rounded px-2 py-1 text-right"
            />
          </div>
        ))}
      <p className="font-medium">Total asignado: ${totalAsignado.toLocaleString('es-CO')}</p>
      <p className="font-medium">
        Dinero libre resultante: ${dineroLibreResultante.toLocaleString('es-CO')}
      </p>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div className="flex gap-2">
        <button onClick={() => setPaso('monto')} className="flex-1 border rounded px-3 py-2">
          Atrás
        </button>
        <button
          onClick={confirmar}
          disabled={saving}
          className="flex-1 bg-blue-600 text-white rounded px-3 py-2 disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Confirmar'}
        </button>
      </div>
    </div>
  )
}
