import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useCajitas } from '../hooks/useCajitas'
import { useDeudas } from '../hooks/useDeudas'
import { useSaldos } from '../hooks/useSaldos'
import ProgressBar from '../components/ProgressBar'
import CajitaCard from '../components/CajitaCard'

export default function DashboardPage() {
  const { session } = useAuth()
  const { cajitas } = useCajitas()
  const { deudas } = useDeudas()
  const { fondoEmergencia, saldoLibre, setFondoEmergenciaValor } = useSaldos()

  const [editandoFondo, setEditandoFondo] = useState(false)
  const [fondoInput, setFondoInput] = useState(0)

  const activas = cajitas.filter((c) => c.estado === 'Pendiente' || c.estado === 'Ahorrando')
  const totalObjetivo = activas.reduce((s, c) => s + c.precio_objetivo, 0)
  const totalAhorrado = activas.reduce((s, c) => s + c.valor_ahorrado, 0)
  const progresoGeneral = totalObjetivo > 0 ? (totalAhorrado / totalObjetivo) * 100 : 0

  async function guardarFondo() {
    if (session) await setFondoEmergenciaValor(fondoInput, session.user.id)
    setEditandoFondo(false)
  }

  return (
    <div className="p-4 pb-20 space-y-6">
      <h1 className="text-lg font-semibold">Independencia</h1>

      <div className="space-y-1">
        <ProgressBar percent={progresoGeneral} />
        <p className="text-sm text-gray-600">{progresoGeneral.toFixed(0)}% de tus metas activas</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="border rounded p-3">
          <p className="text-xs text-gray-500">Saldo libre</p>
          <p className="font-medium">${saldoLibre.toLocaleString('es-CO')}</p>
        </div>
        <div className="border rounded p-3">
          <p className="text-xs text-gray-500">Fondo emergencia</p>
          {editandoFondo ? (
            <div className="flex gap-1 items-center">
              <input
                type="number"
                min="0"
                value={fondoInput}
                onChange={(e) => setFondoInput(Number(e.target.value))}
                className="w-full border rounded px-1 py-0.5 text-sm"
                autoFocus
              />
              <button onClick={guardarFondo} className="text-blue-600 text-sm">
                OK
              </button>
            </div>
          ) : (
            <p
              className="font-medium cursor-pointer"
              onClick={() => {
                setFondoInput(fondoEmergencia)
                setEditandoFondo(true)
              }}
            >
              ${fondoEmergencia.toLocaleString('es-CO')} ✎
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Link to="/ingreso" className="flex-1 bg-blue-600 text-white rounded px-3 py-2 text-center">
          + Ingreso
        </Link>
        <Link to="/compra" className="flex-1 bg-gray-700 text-white rounded px-3 py-2 text-center">
          + Compra
        </Link>
      </div>

      <div className="space-y-2">
        <p className="font-medium text-sm text-gray-500">Deudas restantes</p>
        {deudas
          .filter((d) => d.activo)
          .map((d) => (
            <p key={d.id} className="text-sm">
              {d.nombre}: {d.cuotas_pagadas}/{d.total_cuotas} cuotas
            </p>
          ))}
        {deudas.filter((d) => d.activo).length === 0 && (
          <p className="text-sm text-gray-400">Sin deudas activas</p>
        )}
      </div>

      <div className="space-y-3">
        <p className="font-medium text-sm text-gray-500">Cajitas</p>
        {cajitas.map((c) => (
          <CajitaCard key={c.id} cajita={c} />
        ))}
      </div>
    </div>
  )
}
