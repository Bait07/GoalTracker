export type CajitaCategoria =
  | 'Electrodomésticos'
  | 'Muebles'
  | 'Tecnología'
  | 'Cocina'
  | 'Habitación'
  | 'Sala'
  | 'Baño'
  | 'Limpieza'
  | 'Herramientas'
  | 'Decoración'

export type CajitaEstado = 'Pendiente' | 'Ahorrando' | 'Comprado' | 'Instalado' | 'Cancelado'

export interface Cajita {
  id: string
  nombre: string
  categoria: CajitaCategoria
  prioridad: number
  precio_objetivo: number
  valor_ahorrado: number
  fecha_objetivo: string | null
  estado: CajitaEstado
  notas: string | null
}

export interface GastoFijo {
  id: string
  nombre: string
  monto: number
  activo: boolean
}

export interface Deuda {
  id: string
  nombre: string
  valor_cuota: number
  total_cuotas: number
  cuotas_pagadas: number
  activo: boolean
}

export interface IngresoMensual {
  id: string
  fecha: string
  monto_recibido: number
  total_gastos_fijos: number
  total_deudas: number
  total_asignado_cajitas: number
  dinero_libre_resultante: number
}

export interface MovimientoLibre {
  id: string
  fecha: string
  descripcion: string
  monto: number
  planeado: boolean
  cajita_afectada_id: string | null
}
