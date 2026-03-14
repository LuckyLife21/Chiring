-- Códigos de descuento por chiringuito
-- Ejecuta este SQL en el editor SQL de Supabase si quieres usar códigos promocionales.

create table if not exists public.codigos_descuento (
  id uuid primary key default gen_random_uuid(),
  chiringuito_id uuid not null references public.chiringuitos(id) on delete cascade,
  codigo text not null,
  tipo text not null check (tipo in ('porcentaje', 'fijo')),
  valor numeric not null check (valor >= 0),
  activo boolean not null default true,
  created_at timestamptz default now(),
  unique(chiringuito_id, codigo)
);

create index if not exists idx_codigos_descuento_chiringuito on public.codigos_descuento(chiringuito_id);
create index if not exists idx_codigos_descuento_codigo on public.codigos_descuento(chiringuito_id, codigo);

alter table public.codigos_descuento enable row level security;

create policy "Chiringuitos pueden gestionar sus códigos"
  on public.codigos_descuento for all
  using (true)
  with check (true);

comment on table public.codigos_descuento is 'Códigos promocionales por chiringuito (porcentaje o descuento fijo)';
