-- Matenat Yado: donativo simbólico cuyo importe final no se conoce al
-- crearlo (se deja en 1€ por defecto) y se ajusta al cobrarlo.
alter table public.donaciones
  add column if not exists es_matenat_yado boolean not null default false;

-- Se reemplaza la función para permitir opcionalmente actualizar el
-- importe en el mismo paso de marcar como pagada (p_monto = null deja
-- el importe como estaba).
create or replace function public.marcar_donacion_pagada(
  p_donacion_id uuid,
  p_metodo_pago text,
  p_monto numeric default null
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
      monto = coalesce(p_monto, monto),
      updated_by = auth.uid(),
      updated_at = now()
  where id = p_donacion_id;

  if not found then
    raise exception 'Donación % no encontrada.', p_donacion_id;
  end if;
end;
$$;

grant execute on function public.marcar_donacion_pagada(uuid, text, numeric) to authenticated;

-- Postgres no permite cambiar solo la firma "in place" si ya existe una
-- versión distinta con el mismo nombre y distinta cantidad de
-- parámetros por defecto; nos aseguramos de que no quede la versión
-- vieja de 2 parámetros huérfana.
drop function if exists public.marcar_donacion_pagada(uuid, text);
