import Link from 'next/link';
import { notFound } from 'next/navigation';
import { crearClienteServidor } from '@/lib/supabase/server';
import { actualizarCobro } from '../../actions';

export default async function PaginaEditarCobro({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await crearClienteServidor();
  const { data: cobro } = await supabase
    .from('cobros')
    .select('id, nombre, descripcion, fecha_inicio, fecha_fin, meta_monto')
    .eq('id', id)
    .single();

  if (!cobro) {
    notFound();
  }

  const actualizarConId = actualizarCobro.bind(null, cobro.id);

  return (
    <div className="p-6 md:p-8">
      <Link href={`/cobros/${cobro.id}`} className="text-sm text-torat-moshe-gray hover:underline">
        ← Volver a la ficha
      </Link>
      <h1 className="mt-1 mb-6 text-2xl font-semibold text-torat-moshe-navy">Editar cobro</h1>

      {error && (
        <p className="mb-4 max-w-lg rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <form action={actualizarConId} className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm text-gray-700">Nombre *</label>
          <input
            name="nombre"
            required
            defaultValue={cobro.nombre}
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Descripción</label>
          <textarea
            name="descripcion"
            rows={3}
            defaultValue={cobro.descripcion ?? ''}
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700">Fecha de inicio</label>
            <input
              type="date"
              name="fecha_inicio"
              defaultValue={cobro.fecha_inicio ?? ''}
              className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Fecha de fin</label>
            <input
              type="date"
              name="fecha_fin"
              defaultValue={cobro.fecha_fin ?? ''}
              className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700">Meta (€)</label>
          <input
            type="number"
            step="0.01"
            name="meta_monto"
            defaultValue={cobro.meta_monto ?? ''}
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
