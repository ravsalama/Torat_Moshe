import Link from 'next/link';
import { crearClienteServidor } from '@/lib/supabase/server';
import { cambiarActivo } from './actions';

export default async function PaginaPersonas({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await crearClienteServidor();

  let consulta = supabase
    .from('personas')
    .select('id, nombre, apellidos, email, telefono, activo')
    .order('apellidos', { ascending: true })
    .order('nombre', { ascending: true });

  if (q) {
    consulta = consulta.or(`nombre.ilike.%${q}%,apellidos.ilike.%${q}%,email.ilike.%${q}%`);
  }

  const { data: personas, error } = await consulta;

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/" className="text-sm text-torat-moshe-gray hover:underline">
            ← Volver al dashboard
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-torat-moshe-navy">
            Personas / Congregantes
          </h1>
        </div>
        <Link
          href="/personas/nueva"
          className="rounded bg-torat-moshe-navy px-4 py-2 text-sm font-medium text-white hover:bg-torat-moshe-navy-dark"
        >
          + Nueva persona
        </Link>
      </div>

      <form className="mb-4" action="/personas">
        <input
          type="text"
          name="q"
          defaultValue={q ?? ''}
          placeholder="Buscar por nombre, apellidos o email…"
          className="w-full max-w-md rounded border border-torat-moshe-gray/40 p-2 text-sm"
        />
      </form>

      {error && (
        <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">
          Error al cargar personas: {error.message}
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border border-torat-moshe-gray/30">
        <table className="min-w-full divide-y divide-torat-moshe-gray/20 text-sm">
          <thead className="bg-torat-moshe-navy/5">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-torat-moshe-navy">
                Nombre completo
              </th>
              <th className="px-4 py-2 text-left font-medium text-torat-moshe-navy">Email</th>
              <th className="px-4 py-2 text-left font-medium text-torat-moshe-navy">Teléfono</th>
              <th className="px-4 py-2 text-left font-medium text-torat-moshe-navy">Estado</th>
              <th className="px-4 py-2 text-right font-medium text-torat-moshe-navy">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-torat-moshe-gray/10">
            {personas?.map((persona) => (
              <tr key={persona.id}>
                <td className="px-4 py-2">
                  {persona.nombre} {persona.apellidos}
                </td>
                <td className="px-4 py-2 text-torat-moshe-gray">{persona.email ?? '—'}</td>
                <td className="px-4 py-2 text-torat-moshe-gray">{persona.telefono ?? '—'}</td>
                <td className="px-4 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      persona.activo
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {persona.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-2 text-right">
                  <Link
                    href={`/personas/${persona.id}`}
                    className="mr-3 text-torat-moshe-navy hover:underline"
                  >
                    Editar
                  </Link>
                  <form
                    action={async () => {
                      'use server';
                      await cambiarActivo(persona.id, !persona.activo);
                    }}
                    className="inline"
                  >
                    <button type="submit" className="text-torat-moshe-gray hover:underline">
                      {persona.activo ? 'Desactivar' : 'Activar'}
                    </button>
                  </form>
                </td>
              </tr>
            ))}

            {personas?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-torat-moshe-gray">
                  {q ? 'No hay personas que coincidan con la búsqueda.' : 'Aún no hay personas registradas.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
