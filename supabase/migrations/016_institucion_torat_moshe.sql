-- Asegura que exista una institución "Torat Moshe", para poder usarla
-- como valor por defecto al crear una donación (la mayoría de
-- donativos son para la propia sinagoga, no para otra institución).
insert into public.instituciones (nombre, activo)
select 'Torat Moshe', true
where not exists (
  select 1 from public.instituciones where nombre = 'Torat Moshe'
);
