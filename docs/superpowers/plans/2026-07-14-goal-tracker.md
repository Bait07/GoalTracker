# Goal Tracker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the MVP described in `docs/superpowers/specs/2026-07-14-goal-tracker-design.md`: a mobile-first React app backed by Supabase that tracks savings goals ("cajitas"), debts, monthly income distribution, and includes an impulse-purchase impact check.

**Architecture:** React + Vite + TypeScript SPA, deployed to Vercel from a GitHub repo. Supabase (Postgres + Auth) is the only backend — no custom server. All money-math (allocation recommendation, income distribution, purchase impact) lives in one pure, unit-tested module (`src/lib/finance.ts`); everything else is thin CRUD wiring via Supabase's client.

**Tech Stack:** React 18, Vite, TypeScript, React Router 6, Tailwind CSS, @supabase/supabase-js v2, Vitest.

## Global Constraints

- Mobile-first, fully responsive UI (Tailwind, no desktop-only layouts).
- Single user, but every table has `user_id` + Row Level Security — no unfiltered queries.
- No custom backend server: Supabase is the only backend.
- Currency values formatted with `.toLocaleString('es-CO')`.
- Deploy target: Vercel, connected to a GitHub repo (push to `main` = auto-deploy).
- No dependency beyond what's listed in Tech Stack — no state-management library, no UI kit, no ORM.

---

### Task 1: Project scaffold

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `index.html`
- Create: `.gitignore`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/index.css`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `docs/PROGRESS.md`

**Interfaces:**
- Produces: a buildable Vite React TS project (`npm run build` succeeds), Tailwind wired through `src/index.css`.

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "goal-tracker",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
    "@supabase/supabase-js": "^2.45.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.4",
    "typescript": "^5.5.3",
    "vite": "^5.3.1",
    "vitest": "^2.0.1"
  }
}
```

- [ ] **Step 2: Write `vite.config.ts`**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
  },
})
```

- [ ] **Step 3: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true
  },
  "include": ["src"]
}
```

- [ ] **Step 4: Write `index.html`**

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Goal Tracker</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Write `.gitignore`**

```
node_modules
dist
.env
.env.local
```

- [ ] **Step 6: Write `tailwind.config.js` and `postcss.config.js`**

`tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
}
```

`postcss.config.js`:
```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 7: Write `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 8: Write `src/main.tsx`**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 9: Write placeholder `src/App.tsx`** (replaced fully in Task 11)

```tsx
export default function App() {
  return <div className="p-4">Goal Tracker</div>
}
```

- [ ] **Step 10: Write `docs/PROGRESS.md`**

```markdown
# Progress

**Spec:** docs/superpowers/specs/2026-07-14-goal-tracker-design.md
**Plan:** docs/superpowers/plans/2026-07-14-goal-tracker.md

## Status

- [ ] Task 1: Project scaffold
- [ ] Task 2: Supabase schema + client
- [ ] Task 3: Auth
- [ ] Task 4: Finance calculation library
- [ ] Task 5: Data hooks
- [ ] Task 6: Cajitas page
- [ ] Task 7: Deudas y gastos fijos page
- [ ] Task 8: Nuevo ingreso flow
- [ ] Task 9: Nueva compra flow (impulse check)
- [ ] Task 10: Dashboard
- [ ] Task 11: App shell (routing, nav) + manual e2e verification
- [ ] Task 12: Deployment

## Manual setup still needed (not automatable by an agent)

- [ ] Create a Supabase project at supabase.com
- [ ] Run `supabase/schema.sql` in the Supabase SQL editor
- [ ] Create your user in Supabase Auth (Authentication → Users → Add user)
- [ ] Copy the project URL + anon key into `.env.local` (see `.env.example`)
- [ ] Connect this GitHub repo to Vercel and set the same env vars there
```

- [ ] **Step 11: Install dependencies**

Run: `npm install`
Expected: exits 0, `node_modules` created.

- [ ] **Step 12: Verify the scaffold builds**

Run: `npm run build`
Expected: exits 0, `dist/` created, no TypeScript errors.

- [ ] **Step 13: Commit**

```bash
git add package.json package-lock.json vite.config.ts tsconfig.json index.html .gitignore src tailwind.config.js postcss.config.js docs/PROGRESS.md
git commit -m "chore: scaffold Vite React TS project with Tailwind"
```

---

### Task 2: Supabase schema and client

**Files:**
- Create: `supabase/schema.sql`
- Create: `src/lib/supabaseClient.ts`
- Create: `src/vite-env.d.ts`
- Create: `src/types.ts`
- Create: `.env.example`

**Interfaces:**
- Produces: `supabase` client (`src/lib/supabaseClient.ts`, default export named `supabase`), domain types (`src/types.ts`: `Cajita`, `CajitaCategoria`, `CajitaEstado`, `GastoFijo`, `Deuda`, `IngresoMensual`, `MovimientoLibre`) used by every later task.

- [ ] **Step 1: Write `supabase/schema.sql`**

```sql
create extension if not exists pgcrypto;

create table gasto_fijo (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id),
  nombre text not null,
  monto numeric not null check (monto > 0),
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

create table deuda (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id),
  nombre text not null,
  valor_cuota numeric not null check (valor_cuota > 0),
  total_cuotas integer not null check (total_cuotas > 0),
  cuotas_pagadas integer not null default 0,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

create table cajita (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id),
  nombre text not null,
  categoria text not null,
  prioridad integer not null default 3,
  precio_objetivo numeric not null check (precio_objetivo > 0),
  valor_ahorrado numeric not null default 0,
  fecha_objetivo date,
  estado text not null default 'Pendiente',
  notas text,
  created_at timestamptz not null default now()
);

create table fondo_emergencia (
  user_id uuid primary key default auth.uid() references auth.users(id),
  valor_actual numeric not null default 0
);

create table saldo_libre (
  user_id uuid primary key default auth.uid() references auth.users(id),
  valor_actual numeric not null default 0
);

create table ingreso_mensual (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id),
  fecha date not null default current_date,
  monto_recibido numeric not null check (monto_recibido > 0),
  total_gastos_fijos numeric not null default 0,
  total_deudas numeric not null default 0,
  total_asignado_cajitas numeric not null default 0,
  dinero_libre_resultante numeric not null default 0,
  created_at timestamptz not null default now()
);

create table aporte_cajita (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id),
  ingreso_mensual_id uuid not null references ingreso_mensual(id) on delete cascade,
  cajita_id uuid not null references cajita(id) on delete cascade,
  monto numeric not null check (monto > 0)
);

create table movimiento_libre (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id),
  fecha date not null default current_date,
  descripcion text not null,
  monto numeric not null check (monto > 0),
  planeado boolean not null default false,
  cajita_afectada_id uuid references cajita(id),
  created_at timestamptz not null default now()
);

alter table gasto_fijo enable row level security;
alter table deuda enable row level security;
alter table cajita enable row level security;
alter table fondo_emergencia enable row level security;
alter table saldo_libre enable row level security;
alter table ingreso_mensual enable row level security;
alter table aporte_cajita enable row level security;
alter table movimiento_libre enable row level security;

create policy "own rows" on gasto_fijo for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own rows" on deuda for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own rows" on cajita for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own rows" on fondo_emergencia for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own rows" on saldo_libre for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own rows" on ingreso_mensual for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own rows" on aporte_cajita for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own rows" on movimiento_libre for all using (user_id = auth.uid()) with check (user_id = auth.uid());
```

- [ ] **Step 2: Write `.env.example`**

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

- [ ] **Step 3: Write `src/vite-env.d.ts`**

```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

- [ ] **Step 4: Write `src/lib/supabaseClient.ts`**

```ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY env vars')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

- [ ] **Step 5: Write `src/types.ts`**

```ts
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
```

- [ ] **Step 6: Verify it still builds**

Since there are no real env vars yet, temporarily set dummy ones to verify the typecheck/build pipeline (not a real Supabase connection):

Run: `VITE_SUPABASE_URL=https://x.supabase.co VITE_SUPABASE_ANON_KEY=x npm run build`
Expected: exits 0.

- [ ] **Step 7: Commit**

```bash
git add supabase/schema.sql .env.example src/vite-env.d.ts src/lib/supabaseClient.ts src/types.ts
git commit -m "feat: add Supabase schema, client, and domain types"
```

---

### Task 3: Authentication

**Files:**
- Create: `src/auth/AuthContext.tsx`
- Create: `src/auth/LoginPage.tsx`
- Create: `src/auth/ProtectedRoute.tsx`

**Interfaces:**
- Consumes: `supabase` from `src/lib/supabaseClient.ts`.
- Produces: `AuthProvider` (wraps the app), `useAuth()` returning `{ session, loading, signIn, signOut }`, `LoginPage`, `ProtectedRoute` (a react-router layout route redirecting to `/login` when unauthenticated).

- [ ] **Step 1: Write `src/auth/AuthContext.tsx`**

```tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'

interface AuthContextValue {
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error ? error.message : null }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
```

- [ ] **Step 2: Write `src/auth/LoginPage.tsx`**

```tsx
import { useState, type FormEvent } from 'react'
import { useAuth } from './AuthContext'

export default function LoginPage() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const { error } = await signIn(email, password)
    setSubmitting(false)
    if (error) setError(error)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">Goal Tracker</h1>
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="password"
          required
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white rounded px-3 py-2 disabled:opacity-50"
        >
          {submitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
```

- [ ] **Step 3: Write `src/auth/ProtectedRoute.tsx`**

```tsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function ProtectedRoute() {
  const { session, loading } = useAuth()
  if (loading) return <div className="p-4">Cargando...</div>
  if (!session) return <Navigate to="/login" replace />
  return <Outlet />
}
```

- [ ] **Step 4: Verify it builds**

Run: `VITE_SUPABASE_URL=https://x.supabase.co VITE_SUPABASE_ANON_KEY=x npm run build`
Expected: exits 0.

- [ ] **Step 5: Commit**

```bash
git add src/auth
git commit -m "feat: add Supabase auth context, login page, and protected route"
```

---

### Task 4: Finance calculation library (TDD)

**Files:**
- Create: `src/lib/finance.ts`
- Test: `src/lib/finance.test.ts`

**Interfaces:**
- Produces: `calcularTotalActivos`, `calcularTotalCuotasDeudas`, `calcularDisponibleParaCajitas`, `recomendarAsignacion`, `calcularImpactoCompra` — pure functions consumed by Task 8 (income flow) and Task 9 (purchase flow).

- [ ] **Step 1: Write the failing tests in `src/lib/finance.test.ts`**

```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/finance.test.ts`
Expected: FAIL — `Cannot find module './finance'` (file doesn't exist yet).

- [ ] **Step 3: Write `src/lib/finance.ts`**

```ts
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/finance.test.ts`
Expected: PASS — 8 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/lib/finance.ts src/lib/finance.test.ts
git commit -m "feat: add finance calculation library with tests"
```

---

### Task 5: Data hooks

**Files:**
- Create: `src/hooks/useCajitas.ts`
- Create: `src/hooks/useDeudas.ts`
- Create: `src/hooks/useGastosFijos.ts`
- Create: `src/hooks/useSaldos.ts`

**Interfaces:**
- Consumes: `supabase` (`src/lib/supabaseClient.ts`), types from `src/types.ts`.
- Produces: `useCajitas()` → `{ cajitas, loading, error, createCajita, updateCajita, deleteCajita, refresh }`; `useDeudas()` → `{ deudas, loading, error, createDeuda, updateDeuda, deleteDeuda, refresh }`; `useGastosFijos()` → `{ gastos, loading, error, createGasto, updateGasto, deleteGasto, refresh }`; `useSaldos()` → `{ fondoEmergencia, saldoLibre, loading, setSaldoLibreValor, setFondoEmergenciaValor, refresh }`. All consumed by Tasks 6-10.

- [ ] **Step 1: Write `src/hooks/useCajitas.ts`**

```ts
import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Cajita } from '../types'

export function useCajitas() {
  const [cajitas, setCajitas] = useState<Cajita[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('cajita')
      .select('*')
      .order('prioridad', { ascending: true })
    if (error) setError(error.message)
    else setCajitas(data as Cajita[])
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function createCajita(input: Omit<Cajita, 'id' | 'valor_ahorrado'>) {
    const { error } = await supabase.from('cajita').insert({ ...input, valor_ahorrado: 0 })
    if (error) return { error: error.message }
    await refresh()
    return { error: null }
  }

  async function updateCajita(id: string, changes: Partial<Cajita>) {
    const { error } = await supabase.from('cajita').update(changes).eq('id', id)
    if (error) return { error: error.message }
    await refresh()
    return { error: null }
  }

  async function deleteCajita(id: string) {
    const { error } = await supabase.from('cajita').delete().eq('id', id)
    if (error) return { error: error.message }
    await refresh()
    return { error: null }
  }

  return { cajitas, loading, error, createCajita, updateCajita, deleteCajita, refresh }
}
```

- [ ] **Step 2: Write `src/hooks/useDeudas.ts`**

```ts
import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Deuda } from '../types'

export function useDeudas() {
  const [deudas, setDeudas] = useState<Deuda[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from('deuda').select('*').order('nombre')
    if (error) setError(error.message)
    else setDeudas(data as Deuda[])
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function createDeuda(input: Omit<Deuda, 'id' | 'cuotas_pagadas'>) {
    const { error } = await supabase.from('deuda').insert({ ...input, cuotas_pagadas: 0 })
    if (error) return { error: error.message }
    await refresh()
    return { error: null }
  }

  async function updateDeuda(id: string, changes: Partial<Deuda>) {
    const { error } = await supabase.from('deuda').update(changes).eq('id', id)
    if (error) return { error: error.message }
    await refresh()
    return { error: null }
  }

  async function deleteDeuda(id: string) {
    const { error } = await supabase.from('deuda').delete().eq('id', id)
    if (error) return { error: error.message }
    await refresh()
    return { error: null }
  }

  return { deudas, loading, error, createDeuda, updateDeuda, deleteDeuda, refresh }
}
```

- [ ] **Step 3: Write `src/hooks/useGastosFijos.ts`**

```ts
import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { GastoFijo } from '../types'

export function useGastosFijos() {
  const [gastos, setGastos] = useState<GastoFijo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from('gasto_fijo').select('*').order('nombre')
    if (error) setError(error.message)
    else setGastos(data as GastoFijo[])
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function createGasto(input: Omit<GastoFijo, 'id'>) {
    const { error } = await supabase.from('gasto_fijo').insert(input)
    if (error) return { error: error.message }
    await refresh()
    return { error: null }
  }

  async function updateGasto(id: string, changes: Partial<GastoFijo>) {
    const { error } = await supabase.from('gasto_fijo').update(changes).eq('id', id)
    if (error) return { error: error.message }
    await refresh()
    return { error: null }
  }

  async function deleteGasto(id: string) {
    const { error } = await supabase.from('gasto_fijo').delete().eq('id', id)
    if (error) return { error: error.message }
    await refresh()
    return { error: null }
  }

  return { gastos, loading, error, createGasto, updateGasto, deleteGasto, refresh }
}
```

- [ ] **Step 4: Write `src/hooks/useSaldos.ts`**

```ts
import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useSaldos() {
  const [fondoEmergencia, setFondoEmergencia] = useState(0)
  const [saldoLibre, setSaldoLibre] = useState(0)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const [fondoRes, saldoRes] = await Promise.all([
      supabase.from('fondo_emergencia').select('valor_actual').maybeSingle(),
      supabase.from('saldo_libre').select('valor_actual').maybeSingle(),
    ])
    setFondoEmergencia(fondoRes.data?.valor_actual ?? 0)
    setSaldoLibre(saldoRes.data?.valor_actual ?? 0)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function setSaldoLibreValor(nuevoValor: number, userId: string) {
    await supabase.from('saldo_libre').upsert({ user_id: userId, valor_actual: nuevoValor })
    await refresh()
  }

  async function setFondoEmergenciaValor(nuevoValor: number, userId: string) {
    await supabase.from('fondo_emergencia').upsert({ user_id: userId, valor_actual: nuevoValor })
    await refresh()
  }

  return { fondoEmergencia, saldoLibre, loading, setSaldoLibreValor, setFondoEmergenciaValor, refresh }
}
```

- [ ] **Step 5: Verify it builds**

Run: `VITE_SUPABASE_URL=https://x.supabase.co VITE_SUPABASE_ANON_KEY=x npm run build`
Expected: exits 0.

- [ ] **Step 6: Commit**

```bash
git add src/hooks
git commit -m "feat: add Supabase-backed data hooks for cajitas, deudas, gastos fijos, saldos"
```

---

### Task 6: Cajitas page

**Files:**
- Create: `src/components/ProgressBar.tsx`
- Create: `src/components/CajitaCard.tsx`
- Create: `src/pages/CajitasPage.tsx`

**Interfaces:**
- Consumes: `useCajitas()` (Task 5), `Cajita`/`CajitaCategoria`/`CajitaEstado` (Task 2).
- Produces: `ProgressBar` (`{ percent: number }`), `CajitaCard` (`{ cajita: Cajita, onEdit?: () => void, onDelete?: () => void }`) — reused read-only by Task 10's Dashboard.

- [ ] **Step 1: Write `src/components/ProgressBar.tsx`**

```tsx
export default function ProgressBar({ percent }: { percent: number }) {
  const clamped = Math.min(100, Math.max(0, percent))
  return (
    <div className="w-full bg-gray-200 rounded h-2">
      <div className="bg-blue-600 h-2 rounded" style={{ width: `${clamped}%` }} />
    </div>
  )
}
```

- [ ] **Step 2: Write `src/components/CajitaCard.tsx`**

```tsx
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
```

- [ ] **Step 3: Write `src/pages/CajitasPage.tsx`**

```tsx
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
```

- [ ] **Step 4: Verify it builds**

Run: `VITE_SUPABASE_URL=https://x.supabase.co VITE_SUPABASE_ANON_KEY=x npm run build`
Expected: exits 0.

- [ ] **Step 5: Commit**

```bash
git add src/components/ProgressBar.tsx src/components/CajitaCard.tsx src/pages/CajitasPage.tsx
git commit -m "feat: add cajitas page with create/edit/delete and filters"
```

---

### Task 7: Deudas y gastos fijos page

**Files:**
- Create: `src/pages/DeudasPage.tsx`

**Interfaces:**
- Consumes: `useDeudas()`, `useGastosFijos()` (Task 5).

- [ ] **Step 1: Write `src/pages/DeudasPage.tsx`**

```tsx
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
```

- [ ] **Step 2: Verify it builds**

Run: `VITE_SUPABASE_URL=https://x.supabase.co VITE_SUPABASE_ANON_KEY=x npm run build`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/pages/DeudasPage.tsx
git commit -m "feat: add debts and fixed expenses management page"
```

---

### Task 8: Nuevo ingreso flow

**Files:**
- Create: `src/pages/NuevoIngresoPage.tsx`

**Interfaces:**
- Consumes: `useAuth()` (Task 3), `useCajitas`, `useDeudas`, `useGastosFijos`, `useSaldos` (Task 5), `calcularTotalActivos`, `calcularTotalCuotasDeudas`, `calcularDisponibleParaCajitas`, `recomendarAsignacion` (Task 4), `supabase` (Task 2).
- Produces: writes to `ingreso_mensual`, `aporte_cajita`, updates `cajita.valor_ahorrado`, `deuda.cuotas_pagadas`/`activo`, `saldo_libre`.

- [ ] **Step 1: Write `src/pages/NuevoIngresoPage.tsx`**

```tsx
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
```

- [ ] **Step 2: Verify it builds**

Run: `VITE_SUPABASE_URL=https://x.supabase.co VITE_SUPABASE_ANON_KEY=x npm run build`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/pages/NuevoIngresoPage.tsx
git commit -m "feat: add monthly income registration flow with allocation recommendation"
```

---

### Task 9: Nueva compra flow (impulse check)

**Files:**
- Create: `src/pages/NuevaCompraPage.tsx`

**Interfaces:**
- Consumes: `useAuth()`, `useCajitas`, `useSaldos`, `calcularImpactoCompra` (Task 4), `supabase`.
- Produces: writes to `movimiento_libre`, updates `cajita.valor_ahorrado` or `saldo_libre`.

- [ ] **Step 1: Write `src/pages/NuevaCompraPage.tsx`**

```tsx
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

    if (planeada) {
      const cajita = cajitas.find((c) => c.id === cajitaId)
      if (cajita) {
        await supabase
          .from('cajita')
          .update({ valor_ahorrado: Math.max(0, cajita.valor_ahorrado - monto) })
          .eq('id', cajitaId)
      }
    } else {
      await setSaldoLibreValor(impacto.saldoLibreDespues, session.user.id)
    }

    await supabase.from('movimiento_libre').insert({
      user_id: session.user.id,
      descripcion,
      monto,
      planeado: planeada,
      cajita_afectada_id: planeada ? cajitaId : null,
    })

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
```

- [ ] **Step 2: Verify it builds**

Run: `VITE_SUPABASE_URL=https://x.supabase.co VITE_SUPABASE_ANON_KEY=x npm run build`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/pages/NuevaCompraPage.tsx
git commit -m "feat: add purchase registration flow with impulse-purchase impact check"
```

---

### Task 10: Dashboard

**Files:**
- Create: `src/pages/DashboardPage.tsx`

**Interfaces:**
- Consumes: `useAuth()`, `useCajitas`, `useDeudas`, `useSaldos` (with `setFondoEmergenciaValor`), `CajitaCard`, `ProgressBar`.

- [ ] **Step 1: Write `src/pages/DashboardPage.tsx`**

```tsx
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
```

- [ ] **Step 2: Verify it builds**

Run: `VITE_SUPABASE_URL=https://x.supabase.co VITE_SUPABASE_ANON_KEY=x npm run build`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/pages/DashboardPage.tsx
git commit -m "feat: add dashboard with overall progress, saldos, debts, and goal list"
```

---

### Task 11: App shell (routing, nav) and end-to-end verification

**Files:**
- Create: `src/components/BottomNav.tsx`
- Modify: `src/App.tsx` (replace placeholder from Task 1)

**Interfaces:**
- Consumes: every page/component from Tasks 3, 6, 7, 8, 9, 10.
- Produces: the final `App` default export wiring routing, auth, and navigation together.

- [ ] **Step 1: Write `src/components/BottomNav.tsx`**

```tsx
import { NavLink } from 'react-router-dom'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex-1 text-center py-2 text-sm ${isActive ? 'text-blue-600 font-medium' : 'text-gray-500'}`

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex">
      <NavLink to="/" end className={linkClass}>
        Dashboard
      </NavLink>
      <NavLink to="/cajitas" className={linkClass}>
        Cajitas
      </NavLink>
      <NavLink to="/deudas" className={linkClass}>
        Deudas
      </NavLink>
    </nav>
  )
}
```

- [ ] **Step 2: Replace `src/App.tsx`**

```tsx
import type { ReactNode } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import ProtectedRoute from './auth/ProtectedRoute'
import LoginPage from './auth/LoginPage'
import DashboardPage from './pages/DashboardPage'
import CajitasPage from './pages/CajitasPage'
import DeudasPage from './pages/DeudasPage'
import NuevoIngresoPage from './pages/NuevoIngresoPage'
import NuevaCompraPage from './pages/NuevaCompraPage'
import BottomNav from './components/BottomNav'

function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const showNav = location.pathname !== '/login'
  return (
    <>
      {children}
      {showNav && <BottomNav />}
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/cajitas" element={<CajitasPage />} />
              <Route path="/deudas" element={<DeudasPage />} />
              <Route path="/ingreso" element={<NuevoIngresoPage />} />
              <Route path="/compra" element={<NuevaCompraPage />} />
            </Route>
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  )
}
```

- [ ] **Step 3: Verify it builds**

Run: `VITE_SUPABASE_URL=https://x.supabase.co VITE_SUPABASE_ANON_KEY=x npm run build`
Expected: exits 0.

- [ ] **Step 4: Run the full test suite**

Run: `npm test`
Expected: PASS — all `finance.test.ts` tests still passing (this task didn't touch `src/lib/finance.ts`).

- [ ] **Step 5: Manual end-to-end verification (requires a real Supabase project — see Task 12, Step 1 first)**

With real `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` in `.env.local` and the schema applied:

Run: `npm run dev`, open the printed local URL, log in, then in the browser:
1. Create a cajita (e.g. "Nevera", categoría Electrodomésticos, precio 2.500.000).
2. Go to "+ Ingreso", enter a monto, confirm the recommended allocation appears and totals match (disponible = monto − gastos fijos − deudas), confirm it.
3. Verify the cajita's `valorAhorrado` increased on the Dashboard/Cajitas page.
4. Go to "+ Compra", uncheck "planeada", enter an amount larger than the current saldo libre, verify the red warning with the correct faltante appears before you can confirm.
5. Confirm the compra and verify saldo libre updated on the Dashboard.

Expected: each step behaves as described, no console errors.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/components/BottomNav.tsx
git commit -m "feat: wire routing, auth, and bottom navigation into app shell"
```

---

### Task 12: Deployment

**Files:**
- Create: `vercel.json`
- Create: `README.md`
- Modify: `docs/PROGRESS.md`

**Interfaces:**
- None — this task is configuration and documentation only.

- [ ] **Step 1: Write `vercel.json`** (SPA fallback so React Router routes work on refresh)

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- [ ] **Step 2: Write `README.md`**

```markdown
# Goal Tracker

App para ejecutar el plan de independencia financiera descrito en `contexto.md`:
metas de ahorro ("cajitas"), deudas, distribución del ingreso mensual, y un
freno para compras impulsivas.

## Setup local

1. `npm install`
2. Crea un proyecto en [supabase.com](https://supabase.com).
3. En el SQL Editor del proyecto, ejecuta el contenido de `supabase/schema.sql`.
4. En Authentication → Users, crea tu usuario (email + contraseña).
5. Copia `.env.example` a `.env.local` y completa `VITE_SUPABASE_URL` y
   `VITE_SUPABASE_ANON_KEY` (Project Settings → API).
6. `npm run dev`

## Deploy

1. Sube este repo a GitHub.
2. En [vercel.com](https://vercel.com), importa el repo.
3. En las variables de entorno del proyecto de Vercel, agrega las mismas
   `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
4. Deploy. Cada push a `main` redespliega automáticamente.

## Tests

`npm test` corre las pruebas de `src/lib/finance.ts` (la lógica de reparto de
ingreso y de impacto de compras).
```

- [ ] **Step 3: Update `docs/PROGRESS.md`**

Replace the `## Status` checklist items with all boxes checked, and add a short note:

```markdown
## Status

- [x] Task 1: Project scaffold
- [x] Task 2: Supabase schema + client
- [x] Task 3: Auth
- [x] Task 4: Finance calculation library
- [x] Task 5: Data hooks
- [x] Task 6: Cajitas page
- [x] Task 7: Deudas y gastos fijos page
- [x] Task 8: Nuevo ingreso flow
- [x] Task 9: Nueva compra flow (impulse check)
- [x] Task 10: Dashboard
- [x] Task 11: App shell (routing, nav) + manual e2e verification
- [x] Task 12: Deployment

MVP complete. Next ideas (not built yet): editing past `ingreso_mensual`
records, exporting reports, multi-user support.
```

- [ ] **Step 4: Commit**

```bash
git add vercel.json README.md docs/PROGRESS.md
git commit -m "docs: add deployment config, README setup instructions, and mark MVP complete"
```
