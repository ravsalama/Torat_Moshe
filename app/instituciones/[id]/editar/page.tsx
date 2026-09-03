import Link from 'next/link';
import { notFound } from 'next/navigation';
import { crearClienteServidor } from '@/lib/supabase/server';
import { actualizarInstitucion } from '../../actions';

export default async function PaginaEditarInstitucion({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await crearClienteServidor();
  const { data: institucion } = await supabase
    .from('instituciones')
    .select('id, nombre, email_contacto, notas')
    .eq('id', id)
    .single();

  if (!institucion) {
    notFound();
  }

  const actualizarConId = actualizarInstitucion.bind(null, institucion.id);

  return (
    <main className="min-h-screen bg-white p-8">
      <Link
        href={`/instituciones/${institucion.id}`}
        className="text-sm text-torat-moshe-gray hover:underline"
      >
        ← Volver a la ficha
      </Link>
      <h1 className="mt-1 mb-6 text-2xl font-semibold text-torat-moshe-navy">
        Editar institución
      </h1>

      {error && (
        <p className="mb-4 max-w-lg rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <form action={actualizarConId} className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm text-gray-700">Nombre *</label>
          <input
            name="nombre"
            required
            defaultValue={institucion.nombre}
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Email de contacto</label>
          <input
            type="email"
            name="email_contacto"
            defaultValue={institucion.email_contacto ?? ''}
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Notas</label>
          <textarea
            name="notas"
            rows={3}
            defaultValue={institucion.notas ?? ''}
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
    </main>
  );
}
