# Goal Tracker — Diseño (MVP)

**Fecha:** 2026-07-14
**Origen:** `contexto.md` (Plan Maestro de Independencia Financiera)

## Propósito

Convertir el plan financiero de `contexto.md` en una app que ayude a ejecutarlo:
registrar el ingreso mensual y distribuirlo (gastos fijos → deudas → cajitas →
dinero libre), llevar el progreso de cada meta de compra ("cajita"), y —el
punto más importante para el usuario— frenar las compras impulsivas mostrando
el impacto real antes de confirmarlas.

## Alcance del MVP

Todo el flujo descrito en `contexto.md`, sección "Idea del programa":
cajitas, deudas, gastos fijos, registro de ingreso mensual con distribución,
dashboard, y registro de compras (incluyendo compras no planeadas con freno
anti-impulso).

Fuera de alcance por ahora: multi-usuario/compartido, notificaciones push,
exportes/reportes PDF, edición de histórico de ingresos ya registrados.

## Stack y arquitectura

- **Frontend:** React + Vite + TypeScript, mobile-first, desplegado en Vercel
  conectado al repo de GitHub (push a main = deploy automático).
- **Backend:** Supabase (Postgres + Auth + API autogenerada). No se escribe
  servidor propio.
- **Auth:** Supabase Auth, email/password, un solo usuario. Row Level
  Security en todas las tablas filtrando por `user_id`.
- **Estilos:** Tailwind CSS.

## Modelo de datos (Postgres / Supabase)

```
gasto_fijo
  id, user_id, nombre, monto, activo

deuda
  id, user_id, nombre, valorCuota, totalCuotas, cuotasPagadas, activo
  -- saldoRestante = (totalCuotas - cuotasPagadas) * valorCuota

cajita
  id, user_id, nombre, categoria, prioridad, precioObjetivo,
  valorAhorrado, fechaObjetivo, estado, notas
  -- categoria: Electrodomésticos | Muebles | Tecnología | Cocina |
  --   Habitación | Sala | Baño | Limpieza | Herramientas | Decoración
  -- estado: Pendiente | Ahorrando | Comprado | Instalado | Cancelado

fondo_emergencia
  user_id, valorActual   -- registro único por usuario, colchón informativo (meta sugerida 2M-5M)

saldo_libre
  user_id, valorActual   -- saldo acumulado de "dinero libre", persiste entre meses

ingreso_mensual
  id, user_id, fecha, montoRecibido, totalGastosFijos, totalDeudas,
  totalAsignadoCajitas, dineroLibreResultante

aporte_cajita
  id, ingresoMensualId, cajitaId, monto   -- detalle de reparto por cajita en cada ingreso

movimiento_libre
  id, user_id, fecha, descripcion, monto, planeado (bool),
  cajitaAfectadaId (nullable)   -- si el gasto se descontó de una cajita en vez del saldo libre
```

## Flujos principales

### A. Registrar ingreso mensual
1. Usuario indica cuánto recibió.
2. App resta automáticamente gastos fijos activos y la cuota pendiente de
   cada deuda activa.
3. Con el disponible restante, se listan las cajitas activas (estado
   Pendiente/Ahorrando) ordenadas por prioridad, con una asignación
   **recomendada** (prioriza fecha objetivo más próxima, luego prioridad
   declarada, hasta cubrir el faltante de cada una o agotar el disponible).
   El usuario edita los montos libremente antes de confirmar.
4. El sobrante tras las asignaciones se suma a `saldo_libre`.
5. Al confirmar: se crea `ingreso_mensual`, se crea un `aporte_cajita` por
   cajita asignada (y se suma a su `valorAhorrado`), y cada deuda activa
   incrementa `cuotasPagadas` en 1 (si `cuotasPagadas` alcanza
   `totalCuotas`, la deuda pasa a `activo = false`).

### B. Registrar una compra / gasto
1. Formulario: descripción, monto, ¿estaba planeada?
2. Si sale de una cajita: se descuenta de `valorAhorrado` de esa cajita y se
   muestra el nuevo faltante.
3. Si es no planeada (impulsiva): antes de guardar, la app muestra el
   impacto — cuánto queda en `saldo_libre` tras el gasto, o si no alcanza,
   advierte que tocaría una cajita o el fondo de emergencia — y exige
   confirmación explícita antes de crear el `movimiento_libre`.

### C. Dashboard
Progreso general combinado de cajitas activas, lista de cajitas con barra de
progreso y estado (✅🟡⚪), saldo libre actual, fondo de emergencia actual,
deudas restantes, histórico reciente de ingresos y movimientos.

## Pantallas

1. Login (email/password)
2. Dashboard (pantalla inicial)
3. Cajitas (listar/crear/editar/eliminar, filtrable por categoría/estado)
4. Deudas y gastos fijos (alta/edición/desactivación)
5. Nuevo ingreso y Nueva compra (modales o pantallas desde botones del
   Dashboard)

Navegación: barra inferior fija (Dashboard / Cajitas / Deudas / +), sin
sidebar ni rutas anidadas.

## Manejo de errores

- Validación de formularios: montos > 0, campos requeridos, fecha objetivo
  no en el pasado (advertencia, no bloqueo).
- Fallos de red/Supabase: mensaje de error simple, sin perder lo escrito en
  el formulario.
- Seguridad de datos: RLS de Supabase como única barrera (suficiente para
  este alcance de un solo usuario).

## Verificación

Antes de dar el MVP por terminado, probar en navegador el flujo completo:
crear cajita → registrar ingreso → ver reparto recomendado y confirmarlo →
registrar una compra impulsiva → ver el freno con el impacto mostrado →
confirmar dashboard actualizado correctamente.

## Seguimiento entre conversaciones

Se mantendrá un archivo de progreso/estado del proyecto (fuera de este spec)
para que futuras conversaciones sepan qué está hecho y qué falta.
