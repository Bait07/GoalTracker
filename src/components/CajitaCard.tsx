import type { Cajita } from '../types'
import ProgressBar from './ProgressBar'

const ESTADO_ICONO: Record<Cajita['estado'], string> = {
  Pendiente: '⚪',
  Ahorrando: '🟡',
  Comprado: '✅',
  Instalado: '✅',
  Cancelado: '❌',
}

export default function CajitaCard({
  cajita,
  onEdit,
  onDelete,
}: {
  cajita: Cajita
  onEdit?: () => void
  onDelete?: () => void
}) {
  const percent =
    cajita.precio_objetivo > 0 ? (cajita.valor_ahorrado / cajita.precio_objetivo) * 100 : 0
  const faltante = Math.max(0, cajita.precio_objetivo - cajita.valor_ahorrado)

  return (
    <div className="border rounded p-3 space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">
            {ESTADO_ICONO[cajita.estado]} {cajita.nombre}
          </p>
          <p className="text-xs text-gray-500">{cajita.categoria}</p>
        </div>
        {(onEdit || onDelete) && (
          <div className="space-x-2 text-sm">
            {onEdit && (
              <button onClick={onEdit} className="text-blue-600">
                Editar
              </button>
            )}
            {onDelete && (
              <button onClick={onDelete} className="text-red-600">
                Eliminar
              </button>
            )}
          </div>
        )}
      </div>
      <ProgressBar percent={percent} />
      <p className="text-sm text-gray-600">
        ${cajita.valor_ahorrado.toLocaleString('es-CO')} / $
        {cajita.precio_objetivo.toLocaleString('es-CO')} (faltan $
        {faltante.toLocaleString('es-CO')})
      </p>
    </div>
  )
}
