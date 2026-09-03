-- Rediseño de Najalot: en vez de dos columnas en "personas" (que solo
-- permitían UN Najalot, y encima confundían el fallecimiento de la propia
-- persona con el de un familiar), pasa a ser una tabla aparte: cada
-- persona puede tener varios Najalot, uno por cada familiar fallecido
-- que quiera recordar.

-- 1) Eliminar las columnas antiguas y mal planteadas de "personas"
alter table public.personas drop column if exists najalot_dia_hebreo;
alter table public.personas drop column if exists najalot_mes_hebreo;

-- 2) Tabla nueva
create table if not exists public.najalot (
  id uuid primary key default gen_random_uuid(),
  persona_id uuid not null references public.personas(id) on delete cascade,

  nombre_familiar text not null,
  relacion_familiar text not null,

  -- Qué calendario usó quien introdujo el dato (solo para mostrarlo
  -- correctamente al editar; el cálculo del próximo aniversario siempre
  -- se hace en el calendario hebreo, ver dia_hebreo/mes_hebreo).
  calendario_origen text not null check (calendario_origen in ('hebreo', 'gregoriano')),

  -- Campos canónicos en hebreo: SIEMPRE rellenos, son los que se usan
  -- para calcular la próxima fecha del Najalot cada año.
  dia_hebreo smallint not null check (dia_hebreo between 1 and 30),
  mes_hebreo text not null,
  anio_hebreo integer, -- opcional

  -- Campos gregorianos: solo informativos, rellenos únicamente cuando
  -- calendario_origen = 'gregoriano' (para poder editar sin perder el
  -- dato original tal y como se introdujo).
  dia_gregoriano smallint check (dia_gregoriano between 1 and 31),
  mes_gregoriano smallint check (mes_gregoriano between 1 and 12),
  anio_gregoriano integer, -- opcional

  notas text,
  created_by uuid references public.perfiles(id),
  updated_by uuid references public.perfiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists najalot_persona_id_idx on public.najalot(persona_id);

alter table public.najalot enable row level security;

-- Mismo criterio de acceso que "personas": solo super_admin y gestor
-- pueden ver y gestionar Najalot (parnas no tiene acceso).
create policy "najalot_select_staff" on public.najalot
  for select
  using (
    exists (
      select 1 from public.perfiles
      where perfiles.id = auth.uid()
        and perfiles.rol in ('super_admin', 'gestor')
    )
  );

create policy "najalot_insert_staff" on public.najalot
  for insert
  with check (
    exists (
      select 1 from public.perfiles
      where perfiles.id = auth.uid()
        and perfiles.rol in ('super_admin', 'gestor')
    )
  );

create policy "najalot_update_staff" on public.najalot
  for update
  using (
    exists (
      select 1 from public.perfiles
      where perfiles.id = auth.uid()
        and perfiles.rol in ('super_admin', 'gestor')
    )
  );

create policy "najalot_delete_staff" on public.najalot
  for delete
  using (
    exists (
      select 1 from public.perfiles
      where perfiles.id = auth.uid()
        and perfiles.rol in ('super_admin', 'gestor')
    )
  );
