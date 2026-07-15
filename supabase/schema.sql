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
