import Link from 'next/link';
import { notFound } from 'next/navigation';
import { crearClienteServidor } from '@/lib/supabase/server';
import { MESES_HEBREOS } from '@/lib/hebcal';
import { actualizarNajala } from '../../actions';

const MESES_GREGORIANOS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

export default async function PaginaEditarNajala({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; najalaId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id, najalaId } = await params;
  const { error } = await searchParams;

  const supabase = await crearClienteServidor();
  const { data: najala } = await supabase
    .from('najalot')
    .select(
      'id, nombre_familiar, relacion_familiar, calendario_origen, dia_hebreo, mes_hebreo, anio_hebreo, dia_gregoriano, mes_gregoriano, anio_gregoriano, notas'
    )
    .eq('id', najalaId)
    .single();

  if (!najala) {
    notFound();
  }

  const actualizarConId = actualizarNajala.bind(null, id, najala.id);

  return (
    <div className="p-6 md:p-8">
      <Link href={`/personas/${id}`} className="text-sm text-torat-moshe-gray hover:underline">
        ← Volver a la ficha
      </Link>
      <h1 className="mt-1 mb-6 text-2xl font-semibold text-torat-moshe-navy">Editar Najalot</h1>

      {error && (
        <p className="mb-4 max-w-lg rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <form action={actualizarConId} className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm text-gray-700">Nombre del familiar *</label>
          <input
            name="nombre_familiar"
            required
            defaultValue={najala.nombre_familiar}
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Relación familiar *</label>
          <input
            name="relacion_familiar"
            required
            defaultValue={najala.relacion_familiar}
            list="relaciones-familiares"
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          />
          <datalist id="relaciones-familiares">
            <option value="Padre" />
            <option value="Madre" />
            <option value="Cónyuge" />
            <option value="Hijo" />
            <option value="Hija" />
            <option value="Hermano" />
            <option value="Hermana" />
            <option value="Abuelo" />
            <option value="Abuela" />
          </datalist>
        </div>

        <fieldset className="rounded border border-torat-moshe-gray/30 p-4">
          <legend className="px-1 text-sm font-medium text-torat-moshe-navy">
            ¿En qué calendario tienes la fecha?
          </legend>

          <div className="mb-4 flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="calendario_origen"
                value="hebreo"
                defaultChecked={najala.calendario_origen === 'hebreo'}
              />
              Hebreo
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="calendario_origen"
                value="gregoriano"
                defaultChecked={najala.calendario_origen === 'gregoriano'}
              />
              Gregoriano (civil)
            </label>
          </div>

          <p className="mb-3 text-xs text-torat-moshe-gray">
            Rellena solo el bloque del calendario que hayas elegido arriba. El año es opcional
            en ambos casos.
          </p>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-700">Día hebreo</label>
              <input
                type="number"
                min={1}
                max={30}
                name="dia_hebreo"
                defaultValue={najala.dia_hebreo ?? ''}
                className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-700">Mes hebreo</label>
              <select
                name="mes_hebreo"
                defaultValue={najala.mes_hebreo ?? ''}
                className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
              >
                <option value="" disabled>
                  Selecciona…
                </option>
                {MESES_HEBREOS.map((mes) => (
                  <option key={mes} value={mes}>
                    {mes}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-700">Año hebreo (opcional)</label>
              <input
                type="number"
                name="anio_hebreo"
                defaultValue={najala.anio_hebreo ?? ''}
                className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-700">Día gregoriano</label>
              <input
                type="number"
                min={1}
                max={31}
                name="dia_gregoriano"
                defaultValue={najala.dia_gregoriano ?? ''}
                className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-700">Mes gregoriano</label>
              <select
                name="mes_gregoriano"
                defaultValue={najala.mes_gregoriano ?? ''}
                className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
              >
                <option value="" disabled>
                  Selecciona…
                </option>
                {MESES_GREGORIANOS.map((mes, i) => (
                  <option key={mes} value={i + 1}>
                    {mes}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-700">Año gregoriano (opcional)</label>
              <input
                type="number"
                name="anio_gregoriano"
                defaultValue={najala.anio_gregoriano ?? ''}
                className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
              />
            </div>
          </div>
        </fieldset>

        <div>
          <label className="block text-sm text-gray-700">Notas</label>
          <textarea
            name="notas"
            rows={3}
            defaultValue={najala.notas ?? ''}
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          />
        </div>

        <button
          type="submit"
          className="rounded bg-torat-moshe-navy px-4 py-2 text-sm font-medium text-white hover:bg-torat-moshe-navy-dark"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
