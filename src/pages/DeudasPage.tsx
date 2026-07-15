import { useState } from 'react'
import { useDeudas } from '../hooks/useDeudas'
import { useGastosFijos } from '../hooks/useGastosFijos'

export default function DeudasPage() {
  const { deudas, createDeuda, updateDeuda, deleteDeuda } = useDeudas()
  const { gastos, createGasto, updateGasto, deleteGasto } = useGastosFijos()

  const [nuevaDeuda, setNuevaDeuda] = useState({
    nombre: '',
    valor_cuota: 0,
    total_cuotas: 1,
    activo: true,
  })
  const [nuevoGasto, setNuevoGasto] = useState({ nombre: '', monto: 0, activo: true })

  async function handleAddDeuda() {
    if (!nuevaDeuda.nombre || nuevaDeuda.valor_cuota <= 0 || nuevaDeuda.total_cuotas <= 0) return
    await createDeuda(nuevaDeuda)
    setNuevaDeuda({ nombre: '', valor_cuota: 0, total_cuotas: 1, activo: true })
  }

  async function handleAddGasto() {
    if (!nuevoGasto.nombre || nuevoGasto.monto <= 0) return
    await createGasto(nuevoGasto)
    setNuevoGasto({ nombre: '', monto: 0, activo: true })
  }

  return (
    <div className="p-4 pb-20 space-y-8">
      <section className="space-y-3">
        <h1 className="text-lg font-semibold">Deudas</h1>
        {deudas.map((d) => (
          <div key={d.id} className="border rounded p-3 flex justify-between items-center">
            <div>
              <p className="font-medium">{d.nombre}</p>
              <p className="text-sm text-gray-600">
                Cuota ${d.valor_cuota.toLocaleString('es-CO')} · {d.cuotas_pagadas}/
                {d.total_cuotas} pagadas
              </p>
            </div>
            <div className="flex gap-2 items-center text-sm">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={d.activo}
                  onChange={(e) => updateDeuda(d.id, { activo: e.target.checked })}
                />
                Activa
              </label>
              <button onClick={() => deleteDeuda(d.id)} className="text-red-600">
                Eliminar
              </button>
            </div>
          </div>
        ))}
        <div className="border rounded p-3 space-y-2">
          <p className="font-medium text-sm">Nueva deuda</p>
          <input
            placeholder="Nombre"
            value={nuevaDeuda.nombre}
            onChange={(e) => setNuevaDeuda({ ...nuevaDeuda, nombre: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="number"
            min="1"
            placeholder="Valor cuota"
            value={nuevaDeuda.valor_cuota}
            onChange={(e) => setNuevaDeuda({ ...nuevaDeuda, valor_cuota: Number(e.target.value) })}
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="number"
            min="1"
            placeholder="Total cuotas"
            value={nuevaDeuda.total_cuotas}
            onChange={(e) =>
              setNuevaDeuda({ ...nuevaDeuda, total_cuotas: Number(e.target.value) })
            }
            className="w-full border rounded px-3 py-2"
          />
          <button onClick={handleAddDeuda} className="bg-blue-600 text-white rounded px-3 py-1">
            Agregar
          </button>
        </div>
      </section>

      <section className="space-y-3">
        <h1 className="text-lg font-semibold">Gastos fijos</h1>
        {gastos.map((g) => (
          <div key={g.id} className="border rounded p-3 flex justify-between items-center">
            <div>
              <p className="font-medium">{g.nombre}</p>
              <p className="text-sm text-gray-600">${g.monto.toLocaleString('es-CO')}</p>
            </div>
            <div className="flex gap-2 items-center text-sm">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={g.activo}
                  onChange={(e) => updateGasto(g.id, { activo: e.target.checked })}
                />
                Activo
              </label>
              <button onClick={() => deleteGasto(g.id)} className="text-red-600">
                Eliminar
              </button>
            </div>
          </div>
        ))}
        <div className="border rounded p-3 space-y-2">
          <p className="font-medium text-sm">Nuevo gasto fijo</p>
          <input
            placeholder="Nombre"
            value={nuevoGasto.nombre}
            onChange={(e) => setNuevoGasto({ ...nuevoGasto, nombre: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="number"
            min="1"
            placeholder="Monto"
            value={nuevoGasto.monto}
            onChange={(e) => setNuevoGasto({ ...nuevoGasto, monto: Number(e.target.value) })}
            className="w-full border rounded px-3 py-2"
          />
          <button onClick={handleAddGasto} className="bg-blue-600 text-white rounded px-3 py-1">
            Agregar
          </button>
        </div>
      </section>
    </div>
  )
}
