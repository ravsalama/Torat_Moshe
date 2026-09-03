import Link from 'next/link';
import { notFound } from 'next/navigation';
import { crearClienteServidor } from '@/lib/supabase/server';
import { MESES_HEBREOS } from '@/lib/hebcal';
import { crearNajala } from '../actions';

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

export default async function PaginaNuevaNajala({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await crearClienteServidor();
  const { data: persona } = await supabase
    .from('personas')
    .select('id, nombre, apellidos')
    .eq('id', id)
    .single();

  if (!persona) {
    notFound();
  }

  const crearConId = crearNajala.bind(null, persona.id);

  return (
    <main className="min-h-screen bg-white p-8">
      <Link href={`/personas/${persona.id}`} className="text-sm text-torat-moshe-gray hover:underline">
        ← Volver a la ficha
      </Link>
      <h1 className="mt-1 mb-1 text-2xl font-semibold text-torat-moshe-navy">Nuevo Najalot</h1>
      <p className="mb-6 text-sm text-torat-moshe-gray">
        Familiar de {persona.nombre} {persona.apellidos}
      </p>

      {error && (
        <p className="mb-4 max-w-lg rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <form action={crearConId} className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm text-gray-700">Nombre del familiar *</label>
          <input
            name="nombre_familiar"
            required
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Relación familiar *</label>
          <input
            name="relacion_familiar"
            required
            list="relaciones-familiares"
            placeholder="p.ej. Padre, Madre, Cónyuge…"
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
              <input type="radio" name="calendario_origen" value="hebreo" defaultChecked />
              Hebreo
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="calendario_origen" value="gregoriano" />
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
                className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-700">Mes hebreo</label>
              <select
                name="mes_hebreo"
                defaultValue=""
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
                className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-700">Mes gregoriano</label>
              <select
                name="mes_gregoriano"
                defaultValue=""
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
                className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
              />
              <p className="mt-1 text-xs text-torat-moshe-gray">
                Sin año, la fecha hebrea se calcula solo como referencia
                aproximada.
              </p>
            </div>
          </div>
        </fieldset>

        <div>
          <label className="block text-sm text-gray-700">Notas</label>
          <textarea
            name="notas"
            rows={3}
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          />
        </div>

        <button
          type="submit"
          className="rounded bg-torat-moshe-navy px-4 py-2 text-sm font-medium text-white hover:bg-torat-moshe-navy-dark"
        >
          Guardar Najalot
        </button>
      </form>
    </main>
  );
}
