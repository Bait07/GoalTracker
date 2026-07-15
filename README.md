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
