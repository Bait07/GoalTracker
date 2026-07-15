import { useState } from 'react'
import { useCajitas } from '../hooks/useCajitas'
import CajitaCard from '../components/CajitaCard'
import type { Cajita, CajitaCategoria, CajitaEstado } from '../types'

const CATEGORIAS: CajitaCategoria[] = [
  'Electrodomésticos',
  'Muebles',
  'Tecnología',
  'Cocina',
  'Habitación',
  'Sala',
  'Baño',
  'Limpieza',
  'Herramientas',
  'Decoración',
]
const ESTADOS: CajitaEstado[] = ['Pendiente', 'Ahorrando', 'Comprado', 'Instalado', 'Cancelado']

const emptyForm = {
  nombre: '',
  categoria: CATEGORIAS[0],
  prioridad: 3,
  precio_objetivo: 0,
  fecha_objetivo: '',
  estado: 'Pendiente' as CajitaEstado,
  notas: '',
}

export default function CajitasPage() {
  const { cajitas, loading, error, createCajita, updateCajita, deleteCajita } = useCajitas()
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [editing, setEditing] = useState<Cajita | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)

  const visibles = cajitas.filter(
    (c) =>
      (!filtroCategoria || c.categoria === filtroCategoria) &&
      (!filtroEstado || c.estado === filtroEstado)
  )

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  function openEdit(c: Cajita) {
    setEditing(c)
    setForm({
      nombre: c.nombre,
      categoria: c.categoria,
      prioridad: c.prioridad,
      precio_objetivo: c.precio_objetivo,
      fecha_objetivo: c.fecha_objetivo ?? '',
      estado: c.estado,
      notas: c.notas ?? '',
    })
    setShowForm(true)
  }

  async function handleSubmit() {
    const payload = {
      nombre: form.nombre,
      categoria: form.categoria,
      prioridad: form.prioridad,
      precio_objetivo: form.precio_objetivo,
      fecha_objetivo: form.fecha_objetivo || null,
      estado: form.estado,
      notas: form.notas || null,
    }
    if (editing) {
      await updateCajita(editing.id, payload)
    } else {
      await createCajita(payload)
    }
    setShowForm(false)
  }

  return (
    <div className="p-4 pb-20 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Cajitas</h1>
        <button onClick={openCreate} className="bg-blue-600 text-white rounded px-3 py-1">
          + Nueva
        </button>
      </div>

      <div className="flex gap-2">
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="">Todas las categorías</option>
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="">Todos los estados</option>
          {ESTADOS.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="space-y-3">
        {visibles.map((c) => (
          <CajitaCard
            key={c.id}
            cajita={c}
            onEdit={() => openEdit(c)}
            onDelete={() => deleteCajita(c.id)}
          />
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center">
          <div className="bg-white rounded-t-lg sm:rounded-lg p-4 w-full sm:max-w-md space-y-3">
            <h2 className="font-semibold">{editing ? 'Editar cajita' : 'Nueva cajita'}</h2>
            <input
              placeholder="Nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
            <select
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value as CajitaCategoria })}
              className="w-full border rounded px-3 py-2"
            >
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              placeholder="Prioridad (1 = más alta)"
              value={form.prioridad}
              onChange={(e) => setForm({ ...form, prioridad: Number(e.target.value) })}
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="number"
              min="1"
              placeholder="Precio objetivo"
              value={form.precio_objetivo}
              onChange={(e) => setForm({ ...form, precio_objetivo: Number(e.target.value) })}
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="date"
              value={form.fecha_objetivo}
              onChange={(e) => setForm({ ...form, fecha_objetivo: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
            <select
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value as CajitaEstado })}
              className="w-full border rounded px-3 py-2"
            >
              {ESTADOS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Notas"
              value={form.notas}
              onChange={(e) => setForm({ ...form, notas: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="px-3 py-1">
                Cancelar
              </button>
              <button onClick={handleSubmit} className="bg-blue-600 text-white rounded px-3 py-1">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
