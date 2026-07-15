export interface CajitaParaAsignar {
  id: string
  prioridad: number
  precioObjetivo: number
  valorAhorrado: number
  fechaObjetivo: string | null
  estado: 'Pendiente' | 'Ahorrando' | 'Comprado' | 'Instalado' | 'Cancelado'
}

export interface Asignacion {
  cajitaId: string
  monto: number
}

export function calcularTotalActivos(items: { monto: number; activo: boolean }[]): number {
  return items.filter((i) => i.activo).reduce((sum, i) => sum + i.monto, 0)
}

export function calcularTotalCuotasDeudas(
  deudas: { valorCuota: number; activo: boolean }[]
): number {
  return deudas.filter((d) => d.activo).reduce((sum, d) => sum + d.valorCuota, 0)
}

export function calcularDisponibleParaCajitas(
  montoRecibido: number,
  totalGastosFijos: number,
  totalDeudas: number
): number {
  return Math.max(0, montoRecibido - totalGastosFijos - totalDeudas)
}

export function recomendarAsignacion(
  cajitas: CajitaParaAsignar[],
  disponible: number
): Asignacion[] {
  const elegibles = cajitas
    .filter((c) => c.estado === 'Pendiente' || c.estado === 'Ahorrando')
    .slice()
    .sort((a, b) => {
      if (a.fechaObjetivo && b.fechaObjetivo) {
        const dateDiff = a.fechaObjetivo.localeCompare(b.fechaObjetivo)
        if (dateDiff !== 0) return dateDiff
      } else if (a.fechaObjetivo && !b.fechaObjetivo) {
        return -1
      } else if (!a.fechaObjetivo && b.fechaObjetivo) {
        return 1
      }
      return a.prioridad - b.prioridad
    })

  let restante = disponible
  const asignaciones: Asignacion[] = []
  for (const cajita of elegibles) {
    if (restante <= 0) break
    const faltante = Math.max(0, cajita.precioObjetivo - cajita.valorAhorrado)
    if (faltante <= 0) continue
    const monto = Math.min(faltante, restante)
    asignaciones.push({ cajitaId: cajita.id, monto })
    restante -= monto
  }
  return asignaciones
}

export interface ImpactoCompra {
  saldoLibreDespues: number
  alcanza: boolean
  faltante: number
}

export function calcularImpactoCompra(saldoLibreActual: number, montoCompra: number): ImpactoCompra {
  const saldoLibreDespues = saldoLibreActual - montoCompra
  const alcanza = saldoLibreDespues >= 0
  return {
    saldoLibreDespues,
    alcanza,
    faltante: alcanza ? 0 : Math.abs(saldoLibreDespues),
  }
}
