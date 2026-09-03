import Link from 'next/link';
import { crearClienteServidor } from '@/lib/supabase/server';
import { cambiarActivoInstitucion } from './actions';

export default async function PaginaInstituciones() {
  const supabase = await crearClienteServidor();
  const { data: instituciones, error } = await supabase
    .from('instituciones')
    .select('id, nombre, email_contacto, activo')
    .order('nombre', { ascending: true });

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/" className="text-sm text-torat-moshe-gray hover:underline">
            ← Volver al dashboard
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-torat-moshe-navy">Instituciones</h1>
        </div>
        <Link
          href="/instituciones/nueva"
          className="rounded bg-torat-moshe-navy px-4 py-2 text-sm font-medium text-white hover:bg-torat-moshe-navy-dark"
        >
          + Nueva institución
        </Link>
      </div>

      {error && (
        <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">
          Error al cargar instituciones: {error.message}
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border border-torat-moshe-gray/30">
        <table className="min-w-full divide-y divide-torat-moshe-gray/20 text-sm">
          <thead className="bg-torat-moshe-navy/5">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-torat-moshe-navy">Nombre</th>
              <th className="px-4 py-2 text-left font-medium text-torat-moshe-navy">
                Email de contacto
              </th>
              <th className="px-4 py-2 text-left font-medium text-torat-moshe-navy">Estado</th>
              <th className="px-4 py-2 text-right font-medium text-torat-moshe-navy">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-torat-moshe-gray/10">
            {instituciones?.map((inst) => (
              <tr key={inst.id}>
                <td className="px-4 py-2">
                  <Link href={`/instituciones/${inst.id}`} className="text-torat-moshe-navy hover:underline">
                    {inst.nombre}
                  </Link>
                </td>
                <td className="px-4 py-2 text-torat-moshe-gray">{inst.email_contacto ?? '—'}</td>
                <td className="px-4 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      inst.activo ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {inst.activo ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="px-4 py-2 text-right">
                  <Link
                    href={`/instituciones/${inst.id}/editar`}
                    className="mr-3 text-torat-moshe-navy hover:underline"
                  >
                    Editar
                  </Link>
                  <form
                    action={async () => {
                      'use server';
                      await cambiarActivoInstitucion(inst.id, !inst.activo);
                    }}
                    className="inline"
                  >
                    <button type="submit" className="text-torat-moshe-gray hover:underline">
                      {inst.activo ? 'Desactivar' : 'Activar'}
                    </button>
                  </form>
                </td>
              </tr>
            ))}

            {instituciones?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-torat-moshe-gray">
                  Aún no hay instituciones registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
