import Link from 'next/link';
import { cancelarDonacion } from '../../actions';

export default async function PaginaCancelarDonacion({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const cancelarConId = cancelarDonacion.bind(null, id);

  return (
    <div className="p-6 md:p-8">
      <Link href={`/donaciones/${id}`} className="text-sm text-torat-moshe-gray hover:underline">
        ← Volver a la ficha
      </Link>
      <h1 className="mt-1 mb-6 text-2xl font-semibold text-torat-moshe-navy">
        Cancelar donación
      </h1>

      {error && (
        <p className="mb-4 max-w-lg rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <form action={cancelarConId} className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm text-gray-700">Motivo *</label>
          <textarea
            name="motivo"
            required
            rows={3}
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          />
        </div>

        <button
          type="submit"
          className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Confirmar cancelación
        </button>
      </form>
    </div>
  );
}
