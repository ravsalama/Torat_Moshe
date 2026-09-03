import Link from 'next/link';
import { marcarDonacionPagada } from '../../actions';

export default async function PaginaMarcarPagada({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const marcarConId = marcarDonacionPagada.bind(null, id);

  return (
    <main className="min-h-screen bg-white p-8">
      <Link href={`/donaciones/${id}`} className="text-sm text-torat-moshe-gray hover:underline">
        ← Volver a la ficha
      </Link>
      <h1 className="mt-1 mb-6 text-2xl font-semibold text-torat-moshe-navy">
        Marcar como pagada
      </h1>

      {error && (
        <p className="mb-4 max-w-lg rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <form action={marcarConId} className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm text-gray-700">Método de pago *</label>
          <select
            name="metodo_pago"
            required
            defaultValue=""
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          >
            <option value="" disabled>
              Selecciona…
            </option>
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="bizum">Bizum</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <button
          type="submit"
          className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          Confirmar pago
        </button>
      </form>
    </main>
  );
}
