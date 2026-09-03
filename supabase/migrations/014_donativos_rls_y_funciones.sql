-- Gestión de donativos: instituciones, cobros y donaciones.
--
-- Reglas de acceso (según README):
-- - Ver / crear instituciones, cobros y donaciones: super_admin y gestor.
-- - Editar/eliminar una donación ya creada, libremente: solo super_admin.
-- - gestor solo puede cambiar el estado de una donación a través de las
--   funciones marcar_donacion_pagada() / cancelar_donacion() (nunca con
--   un UPDATE directo).

-- ============================================================
-- INSTITUCIONES
-- ============================================================
alter table public.instituciones enable row level security;

drop policy if exists "instituciones_select_staff" on public.instituciones;
create policy "instituciones_select_staff" on public.instituciones
  for select
  using (
    exists (
      select 1 from public.perfiles
      where perfiles.id = auth.uid() and perfiles.rol in ('super_admin', 'gestor')
    )
  );

drop policy if exists "instituciones_insert_staff" on public.instituciones;
create policy "instituciones_insert_staff" on public.instituciones
  for insert
  with check (
    exists (
      select 1 from public.perfiles
      where perfiles.id = auth.uid() and perfiles.rol in ('super_admin', 'gestor')
    )
  );

drop policy if exists "instituciones_update_staff" on public.instituciones;
create policy "instituciones_update_staff" on public.instituciones
  for update
  using (
    exists (
      select 1 from public.perfiles
      where perfiles.id = auth.uid() and perfiles.rol in ('super_admin', 'gestor')
    )
  );

-- ============================================================
-- COBROS
-- ============================================================
alter table public.cobros enable row level security;

drop policy if exists "cobros_select_staff" on public.cobros;
create policy "cobros_select_staff" on public.cobros
  for select
  using (
    exists (
      select 1 from public.perfiles
      where perfiles.id = auth.uid() and perfiles.rol in ('super_admin', 'gestor')
    )
  );

drop policy if exists "cobros_insert_staff" on public.cobros;
create policy "cobros_insert_staff" on public.cobros
  for insert
  with check (
    exists (
      select 1 from public.perfiles
      where perfiles.id = auth.uid() and perfiles.rol in ('super_admin', 'gestor')
    )
  );

drop policy if exists "cobros_update_staff" on public.cobros;
create policy "cobros_update_staff" on public.cobros
  for update
  using (
    exists (
      select 1 from public.perfiles
      where perfiles.id = auth.uid() and perfiles.rol in ('super_admin', 'gestor')
    )
  );

-- ============================================================
-- DONACIONES
-- ============================================================
alter table public.donaciones enable row level security;

drop policy if exists "donaciones_select_staff" on public.donaciones;
create policy "donaciones_select_staff" on public.donaciones
  for select
  using (
    exists (
      select 1 from public.perfiles
      where perfiles.id = auth.uid() and perfiles.rol in ('super_admin', 'gestor')
    )
  );

drop policy if exists "donaciones_insert_staff" on public.donaciones;
create policy "donaciones_insert_staff" on public.donaciones
  for insert
  with check (
    exists (
      select 1 from public.perfiles
      where perfiles.id = auth.uid() and perfiles.rol in ('super_admin', 'gestor')
    )
  );

-- A propósito, SOLO super_admin puede hacer UPDATE/DELETE directo.
-- gestor tiene que pasar por las funciones de abajo.
drop policy if exists "donaciones_update_super_admin" on public.donaciones;
create policy "donaciones_update_super_admin" on public.donaciones
  for update
  using (
    exists (
      select 1 from public.perfiles
      where perfiles.id = auth.uid() and perfiles.rol = 'super_admin'
    )
  );

drop policy if exists "donaciones_delete_super_admin" on public.donaciones;
create policy "donaciones_delete_super_admin" on public.donaciones
  for delete
  using (
    exists (
      select 1 from public.perfiles
      where perfiles.id = auth.uid() and perfiles.rol = 'super_admin'
    )
  );

-- ============================================================
-- FUNCIONES: marcar_donacion_pagada / cancelar_donacion
--
-- SECURITY DEFINER: se ejecutan con privilegios elevados para poder
-- actualizar la donación aunque quien llama sea "gestor" (que no tiene
-- permiso de UPDATE directo por la policy de arriba). Por eso, dentro
-- de la función comprobamos a mano que quien llama es super_admin o
-- gestor -- si no, se aborta con una excepción.
-- ============================================================

create or replace function public.marcar_donacion_pagada(
  p_donacion_id uuid,
  p_metodo_pago text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.perfiles
    where perfiles.id = auth.uid() and perfiles.rol in ('super_admin', 'gestor')
  ) then
    raise exception 'No tienes permiso para marcar donaciones como pagadas.';
  end if;

  update public.donaciones
  set estado = 'pagado',
      metodo_pago = p_metodo_pago,
      updated_by = auth.uid(),
      updated_at = now()
  where id = p_donacion_id;

  if not found then
    raise exception 'Donación % no encontrada.', p_donacion_id;
  end if;
end;
$$;

create or replace function public.cancelar_donacion(
  p_donacion_id uuid,
  p_motivo text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.perfiles
    where perfiles.id = auth.uid() and perfiles.rol in ('super_admin', 'gestor')
  ) then
    raise exception 'No tienes permiso para cancelar donaciones.';
  end if;

  update public.donaciones
  set estado = 'cancelado',
      notas = coalesce(notas || E'\n', '') || 'Cancelada: ' || p_motivo,
      updated_by = auth.uid(),
      updated_at = now()
  where id = p_donacion_id;

  if not found then
    raise exception 'Donación % no encontrada.', p_donacion_id;
  end if;
end;
$$;

grant execute on function public.marcar_donacion_pagada(uuid, text) to authenticated;
grant execute on function public.cancelar_donacion(uuid, text) to authenticated;
