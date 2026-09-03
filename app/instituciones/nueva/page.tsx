import Link from 'next/link';
import { crearInstitucion } from '../actions';

export default async function PaginaNuevaInstitucion({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="p-6 md:p-8">
      <Link href="/instituciones" className="text-sm text-torat-moshe-gray hover:underline">
        ← Volver a instituciones
      </Link>
      <h1 className="mt-1 mb-6 text-2xl font-semibold text-torat-moshe-navy">Nueva institución</h1>

      {error && (
        <p className="mb-4 max-w-lg rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <form action={crearInstitucion} className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm text-gray-700">Nombre *</label>
          <input
            name="nombre"
            required
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Email de contacto</label>
          <input
            type="email"
            name="email_contacto"
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          />
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
          Guardar institución
        </button>
      </form>
    </div>
  );
}
