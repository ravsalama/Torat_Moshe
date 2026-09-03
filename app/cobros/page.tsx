import Link from 'next/link';
import { crearClienteServidor } from '@/lib/supabase/server';
import { cambiarActivoCobro } from './actions';

export default async function PaginaCobros() {
  const supabase = await crearClienteServidor();
  const { data: cobros, error } = await supabase
    .from('cobros')
    .select('id, nombre, fecha_inicio, fecha_fin, meta_monto, activo')
    .order('fecha_inicio', { ascending: false, nullsFirst: false });

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/" className="text-sm text-torat-moshe-gray hover:underline">
            ← Volver al dashboard
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-torat-moshe-navy">
            Cobros / Campañas
          </h1>
        </div>
        <Link
          href="/cobros/nueva"
          className="rounded bg-torat-moshe-navy px-4 py-2 text-sm font-medium text-white hover:bg-torat-moshe-navy-dark"
        >
          + Nuevo cobro
        </Link>
      </div>

      {error && (
        <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">
          Error al cargar cobros: {error.message}
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border border-torat-moshe-gray/30">
        <table className="min-w-full divide-y divide-torat-moshe-gray/20 text-sm">
          <thead className="bg-torat-moshe-navy/5">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-torat-moshe-navy">Nombre</th>
              <th className="px-4 py-2 text-left font-medium text-torat-moshe-navy">Periodo</th>
              <th className="px-4 py-2 text-left font-medium text-torat-moshe-navy">Meta</th>
              <th className="px-4 py-2 text-left font-medium text-torat-moshe-navy">Estado</th>
              <th className="px-4 py-2 text-right font-medium text-torat-moshe-navy">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-torat-moshe-gray/10">
            {cobros?.map((cobro) => (
              <tr key={cobro.id}>
                <td className="px-4 py-2">
                  <Link href={`/cobros/${cobro.id}`} className="text-torat-moshe-navy hover:underline">
                    {cobro.nombre}
                  </Link>
                </td>
                <td className="px-4 py-2 text-torat-moshe-gray">
                  {cobro.fecha_inicio ?? '—'} {cobro.fecha_fin ? `→ ${cobro.fecha_fin}` : ''}
                </td>
                <td className="px-4 py-2 text-torat-moshe-gray">
                  {cobro.meta_monto ? `${cobro.meta_monto} €` : '—'}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      cobro.activo ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {cobro.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-2 text-right">
                  <Link
                    href={`/cobros/${cobro.id}/editar`}
                    className="mr-3 text-torat-moshe-navy hover:underline"
                  >
                    Editar
                  </Link>
                  <form
                    action={async () => {
                      'use server';
                      await cambiarActivoCobro(cobro.id, !cobro.activo);
                    }}
                    className="inline"
                  >
                    <button type="submit" className="text-torat-moshe-gray hover:underline">
                      {cobro.activo ? 'Desactivar' : 'Activar'}
                    </button>
                  </form>
                </td>
              </tr>
            ))}

            {cobros?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-torat-moshe-gray">
                  Aún no hay cobros registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
