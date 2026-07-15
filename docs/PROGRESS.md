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
