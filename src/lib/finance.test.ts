import { describe, it, expect } from 'vitest'
import {
  calcularTotalActivos,
  calcularTotalCuotasDeudas,
  calcularDisponibleParaCajitas,
  recomendarAsignacion,
  calcularImpactoCompra,
} from './finance'

describe('calcularTotalActivos', () => {
  it('suma solo los items activos', () => {
    const total = calcularTotalActivos([
      { monto: 100000, activo: true },
      { monto: 55000, activo: true },
      { monto: 20000, activo: false },
    ])
    expect(total).toBe(155000)
  })
})

describe('calcularTotalCuotasDeudas', () => {
  it('suma solo las cuotas de deudas activas', () => {
    const total = calcularTotalCuotasDeudas([
      { valorCuota: 930000, activo: true },
      { valorCuota: 335000, activo: false },
    ])
    expect(total).toBe(930000)
  })
})

describe('calcularDisponibleParaCajitas', () => {
  it('resta gastos fijos y deudas del ingreso', () => {
    expect(calcularDisponibleParaCajitas(4500000, 400000, 930000)).toBe(3170000)
  })

  it('nunca retorna negativo', () => {
    expect(calcularDisponibleParaCajitas(1000000, 400000, 930000)).toBe(0)
  })
})

describe('recomendarAsignacion', () => {
  it('prioriza la cajita con fecha objetivo más próxima', () => {
    const cajitas = [
      {
        id: 'sala',
        prioridad: 1,
        precioObjetivo: 2500000,
        valorAhorrado: 0,
        fechaObjetivo: '2026-11-01',
        estado: 'Pendiente' as const,
      },
      {
        id: 'nevera',
        prioridad: 2,
        precioObjetivo: 2500000,
        valorAhorrado: 1250000,
        fechaObjetivo: '2026-09-01',
        estado: 'Ahorrando' as const,
      },
    ]
    const asignaciones = recomendarAsignacion(cajitas, 1000000)
    expect(asignaciones).toEqual([{ cajitaId: 'nevera', monto: 1000000 }])
  })

  it('reparte entre varias cajitas hasta agotar el disponible', () => {
    const cajitas = [
      {
        id: 'a',
        prioridad: 1,
        precioObjetivo: 500000,
        valorAhorrado: 0,
        fechaObjetivo: '2026-08-01',
        estado: 'Pendiente' as const,
      },
      {
        id: 'b',
        prioridad: 1,
        precioObjetivo: 1000000,
        valorAhorrado: 0,
        fechaObjetivo: '2026-09-01',
        estado: 'Pendiente' as const,
      },
    ]
    const asignaciones = recomendarAsignacion(cajitas, 700000)
    expect(asignaciones).toEqual([
      { cajitaId: 'a', monto: 500000 },
      { cajitaId: 'b', monto: 200000 },
    ])
  })

  it('ignora cajitas Comprado, Instalado o Cancelado', () => {
    const cajitas = [
      {
        id: 'done',
        prioridad: 1,
        precioObjetivo: 500000,
        valorAhorrado: 500000,
        fechaObjetivo: null,
        estado: 'Comprado' as const,
      },
    ]
    expect(recomendarAsignacion(cajitas, 500000)).toEqual([])
  })
})

describe('calcularImpactoCompra', () => {
  it('indica que alcanza cuando el saldo libre cubre la compra', () => {
    const impacto = calcularImpactoCompra(500000, 200000)
    expect(impacto).toEqual({ saldoLibreDespues: 300000, alcanza: true, faltante: 0 })
  })

  it('indica que no alcanza y calcula el faltante', () => {
    const impacto = calcularImpactoCompra(100000, 250000)
    expect(impacto).toEqual({ saldoLibreDespues: -150000, alcanza: false, faltante: 150000 })
  })
})
