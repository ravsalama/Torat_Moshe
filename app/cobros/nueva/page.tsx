import Link from 'next/link';
import { crearCobro } from '../actions';

export default async function PaginaNuevoCobro({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen bg-white p-8">
      <Link href="/cobros" className="text-sm text-torat-moshe-gray hover:underline">
        ← Volver a cobros
      </Link>
      <h1 className="mt-1 mb-6 text-2xl font-semibold text-torat-moshe-navy">Nuevo cobro</h1>

      {error && (
        <p className="mb-4 max-w-lg rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <form action={crearCobro} className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm text-gray-700">Nombre *</label>
          <input
            name="nombre"
            required
            placeholder="p.ej. Kol Nidré 5786"
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Descripción</label>
          <textarea
            name="descripcion"
            rows={3}
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700">Fecha de inicio</label>
            <input
              type="date"
              name="fecha_inicio"
              className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Fecha de fin</label>
            <input
              type="date"
              name="fecha_fin"
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
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          />
        </div>

        <button
          type="submit"
          className="rounded bg-torat-moshe-navy px-4 py-2 text-sm font-medium text-white hover:bg-torat-moshe-navy-dark"
        >
          Guardar cobro
        </button>
      </form>
    </main>
  );
}
