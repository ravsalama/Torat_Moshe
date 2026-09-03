import Link from 'next/link';
import { crearPersona } from '../actions';

export default async function PaginaNuevaPersona({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen bg-white p-8">
      <Link href="/personas" className="text-sm text-torat-moshe-gray hover:underline">
        ← Volver a personas
      </Link>
      <h1 className="mt-1 mb-6 text-2xl font-semibold text-torat-moshe-navy">Nueva persona</h1>

      {error && (
        <p className="mb-4 max-w-lg rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <form action={crearPersona} className="max-w-lg space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700">Nombre *</label>
            <input
              name="nombre"
              required
              className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Apellidos *</label>
            <input
              name="apellidos"
              required
              className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Teléfono</label>
          <input
            name="telefono"
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Dirección</label>
          <input
            name="direccion"
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Fecha de nacimiento</label>
          <input
            type="date"
            name="fecha_nacimiento"
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          />
          <p className="mt-1 text-xs text-torat-moshe-gray">
            La fecha hebrea equivalente se calcula automáticamente.
          </p>
        </div>

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
          Guardar persona
        </button>
      </form>
    </main>
  );
}
