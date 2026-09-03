import Link from 'next/link';
import { crearClienteServidor } from '@/lib/supabase/server';
import { crearDonacion } from '../actions';

export default async function PaginaNuevaDonacion({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; persona?: string }>;
}) {
  const { error, persona } = await searchParams;

  const supabase = await crearClienteServidor();
  const { data: personas } = await supabase
    .from('personas')
    .select('id, nombre, apellidos')
    .eq('activo', true)
    .order('apellidos', { ascending: true });

  const { data: cobros } = await supabase
    .from('cobros')
    .select('id, nombre')
    .eq('activo', true)
    .order('nombre', { ascending: true });

  const { data: instituciones } = await supabase
    .from('instituciones')
    .select('id, nombre')
    .eq('activo', true)
    .order('nombre', { ascending: true });

  const hoy = new Date().toISOString().slice(0, 10);

  return (
    <div className="p-6 md:p-8">
      <Link href="/donaciones" className="text-sm text-torat-moshe-gray hover:underline">
        ← Volver a donaciones
      </Link>
      <h1 className="mt-1 mb-6 text-2xl font-semibold text-torat-moshe-navy">Nueva donación</h1>

      {error && (
        <p className="mb-4 max-w-lg rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <form action={crearDonacion} className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm text-gray-700">Persona *</label>
          <select
            name="persona_id"
            required
            defaultValue={persona ?? ''}
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          >
            <option value="" disabled>
              Selecciona…
            </option>
            {personas?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} {p.apellidos}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700">Importe *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="monto"
              required
              className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Moneda</label>
            <input
              name="moneda"
              defaultValue="EUR"
              className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700">Fecha *</label>
          <input
            type="date"
            name="fecha"
            required
            defaultValue={hoy}
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Concepto</label>
          <input
            name="concepto"
            placeholder="p.ej. Alia el Sábado, donativo mensual…"
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700">Cobro / Campaña</label>
            <select
              name="cobro_id"
              defaultValue=""
              className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
            >
              <option value="">— Ninguno —</option>
              {cobros?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700">Institución</label>
            <select
              name="institucion_id"
              defaultValue=""
              className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
            >
              <option value="">— Ninguna —</option>
              {instituciones?.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700">Notas</label>
          <textarea
            name="notas"
            rows={3}
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          />
        </div>

        <p className="text-xs text-torat-moshe-gray">
          La donación se crea como <span className="font-medium">pendiente</span>. Márcala como
          pagada desde su ficha cuando se cobre.
        </p>

        <button
          type="submit"
          className="rounded bg-torat-moshe-navy px-4 py-2 text-sm font-medium text-white hover:bg-torat-moshe-navy-dark"
        >
          Guardar donación
        </button>
      </form>
    </div>
  );
}
