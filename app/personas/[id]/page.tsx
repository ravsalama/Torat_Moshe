import Link from 'next/link';
import { notFound } from 'next/navigation';
import { crearClienteServidor } from '@/lib/supabase/server';
import { actualizarPersona } from '../actions';

export default async function PaginaEditarPersona({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await crearClienteServidor();
  const { data: persona } = await supabase
    .from('personas')
    .select(
      'id, nombre, apellidos, email, telefono, direccion, fecha_nacimiento, fecha_nacimiento_hebrea, notas'
    )
    .eq('id', id)
    .single();

  if (!persona) {
    notFound();
  }

  const actualizarConId = actualizarPersona.bind(null, persona.id);

  return (
    <main className="min-h-screen bg-white p-8">
      <Link href="/personas" className="text-sm text-torat-moshe-gray hover:underline">
        ← Volver a personas
      </Link>
      <h1 className="mt-1 mb-6 text-2xl font-semibold text-torat-moshe-navy">
        Editar persona
      </h1>

      {error && (
        <p className="mb-4 max-w-lg rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <form action={actualizarConId} className="max-w-lg space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700">Nombre *</label>
            <input
              name="nombre"
              required
              defaultValue={persona.nombre}
              className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Apellidos *</label>
            <input
              name="apellidos"
              required
              defaultValue={persona.apellidos}
              className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            defaultValue={persona.email ?? ''}
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Teléfono</label>
          <input
            name="telefono"
            defaultValue={persona.telefono ?? ''}
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Dirección</label>
          <input
            name="direccion"
            defaultValue={persona.direccion ?? ''}
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700">Fecha de nacimiento</label>
            <input
              type="date"
              name="fecha_nacimiento"
              defaultValue={persona.fecha_nacimiento ?? ''}
              className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
            />
            {persona.fecha_nacimiento_hebrea && (
              <p className="mt-1 text-xs text-torat-moshe-gray">
                Actual: {persona.fecha_nacimiento_hebrea}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-700">Fecha de Najalot (si aplica)</label>
            <input
              type="date"
              name="fecha_najalot"
              className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
            />
            <p className="mt-1 text-xs text-torat-moshe-gray">
              Déjalo vacío para no modificar el Najalot ya guardado.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700">Notas</label>
          <textarea
            name="notas"
            rows={3}
            defaultValue={persona.notas ?? ''}
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
