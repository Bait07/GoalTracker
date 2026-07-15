import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useCajitas } from '../hooks/useCajitas'
import { useSaldos } from '../hooks/useSaldos'
import { supabase } from '../lib/supabaseClient'
import { calcularImpactoCompra } from '../lib/finance'

export default function NuevaCompraPage() {
  const navigate = useNavigate()
  const { session } = useAuth()
  const { cajitas, refresh: refreshCajitas } = useCajitas()
  const { saldoLibre, setSaldoLibreValor } = useSaldos()

  const [descripcion, setDescripcion] = useState('')
  const [monto, setMonto] = useState(0)
  const [planeada, setPlaneada] = useState(true)
  const [cajitaId, setCajitaId] = useState('')
  const [mostrarImpacto, setMostrarImpacto] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const impacto = calcularImpactoCompra(saldoLibre, monto)

  function validar(): boolean {
    if (!descripcion || monto <= 0) {
      setError('Completa descripción y un monto mayor a 0')
      return false
    }
    if (planeada && !cajitaId) {
      setError('Selecciona la cajita de la que sale esta compra')
      return false
    }
    setError(null)
    return true
  }

  function handleContinuar() {
    if (!validar()) return
    if (!planeada) {
      setMostrarImpacto(true)
      return
    }
    guardar()
  }

  async function guardar() {
    if (!session) return
    setSaving(true)
    setError(null)

    if (planeada) {
      const cajita = cajitas.find((c) => c.id === cajitaId)
      if (cajita) {
        const { error: cajitaError } = await supabase
          .from('cajita')
          .update({ valor_ahorrado: Math.max(0, cajita.valor_ahorrado - monto) })
          .eq('id', cajitaId)
        if (cajitaError) {
          setError(cajitaError.message ?? 'Error guardando la compra, intenta de nuevo')
          setSaving(false)
          return
        }
      }
    } else {
      const { error: saldoError } = await setSaldoLibreValor(impacto.saldoLibreDespues, session.user.id)
      if (saldoError) {
        setError('Error guardando la compra, intenta de nuevo')
        setSaving(false)
        return
      }
    }

    const { error: movimientoError } = await supabase.from('movimiento_libre').insert({
      user_id: session.user.id,
      descripcion,
      monto,
      planeado: planeada,
      cajita_afectada_id: planeada ? cajitaId : null,
    })
    if (movimientoError) {
      setError(movimientoError.message ?? 'Error guardando la compra, intenta de nuevo')
      setSaving(false)
      return
    }

    await refreshCajitas()
    setSaving(false)
    navigate('/')
  }

  return (
    <div className="p-4 pb-20 space-y-4">
      <h1 className="text-lg font-semibold">Nueva compra</h1>
      <input
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />
      <input
        type="number"
        min="1"
        placeholder="Monto"
        value={monto || ''}
        onChange={(e) => setMonto(Number(e.target.value))}
        className="w-full border rounded px-3 py-2"
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={planeada}
          onChange={(e) => setPlaneada(e.target.checked)}
        />
        Esta compra estaba planeada (sale de una cajita)
      </label>
      {planeada && (
        <select
          value={cajitaId}
          onChange={(e) => setCajitaId(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Selecciona cajita</option>
          {cajitas.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {mostrarImpacto && !planeada && (
        <div className={`border rounded p-3 ${impacto.alcanza ? 'bg-yellow-50' : 'bg-red-50'}`}>
          <p className="font-medium">Esta compra no estaba planeada.</p>
          {impacto.alcanza ? (
            <p className="text-sm">
              Saldo libre: ${saldoLibre.toLocaleString('es-CO')} → $
              {impacto.saldoLibreDespues.toLocaleString('es-CO')} después de esta compra.
            </p>
          ) : (
            <p className="text-sm text-red-700">
              No tienes saldo libre suficiente (te faltan $
              {impacto.faltante.toLocaleString('es-CO')}). Esto tocaría una cajita o tu fondo de
              emergencia. ¿Seguro que quieres continuar?
            </p>
          )}
        </div>
      )}

      {!mostrarImpacto || planeada ? (
        <button onClick={handleContinuar} className="bg-blue-600 text-white rounded px-3 py-2 w-full">
          Continuar
        </button>
      ) : (
        <button
          onClick={guardar}
          disabled={saving}
          className="bg-red-600 text-white rounded px-3 py-2 w-full disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Sí, confirmar compra de todas formas'}
        </button>
      )}
    </div>
  )
}
