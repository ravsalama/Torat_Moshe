import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { crearClienteServidor } from '@/lib/supabase/server';
import { obtenerPerfilActual } from '@/lib/auth-helpers';
import { actualizarDonacion } from '../../actions';

export default async function PaginaEditarDonacion({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const perfil = await obtenerPerfilActual();
  if (perfil?.rol !== 'super_admin') {
    redirect(
      `/donaciones/${id}?error=${encodeURIComponent('Solo un super administrador puede editar una donación directamente.')}`
    );
  }

  const supabase = await crearClienteServidor();
  const { data: donacion } = await supabase
    .from('donaciones')
    .select(
      'id, persona_id, cobro_id, institucion_id, monto, moneda, concepto, estado, metodo_pago, fecha, notas'
    )
    .eq('id', id)
    .single();

  if (!donacion) {
    notFound();
  }

  const [{ data: personas }, { data: cobros }, { data: instituciones }] = await Promise.all([
    supabase.from('personas').select('id, nombre, apellidos').order('apellidos'),
    supabase.from('cobros').select('id, nombre').order('nombre'),
    supabase.from('instituciones').select('id, nombre').order('nombre'),
  ]);

  const actualizarConId = actualizarDonacion.bind(null, donacion.id);

  return (
    <main className="min-h-screen bg-white p-8">
      <Link
        href={`/donaciones/${donacion.id}`}
        className="text-sm text-torat-moshe-gray hover:underline"
      >
        ← Volver a la ficha
      </Link>
      <h1 className="mt-1 mb-6 text-2xl font-semibold text-torat-moshe-navy">Editar donación</h1>

      {error && (
        <p className="mb-4 max-w-lg rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <form action={actualizarConId} className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm text-gray-700">Persona *</label>
          <select
            name="persona_id"
            required
            defaultValue={donacion.persona_id}
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          >
            {personas?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} {p.apellidos}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700">Importe *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="monto"
              required
              defaultValue={donacion.monto}
              className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Moneda</label>
            <input
              name="moneda"
              defaultValue={donacion.moneda}
              className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700">Fecha *</label>
            <input
              type="date"
              name="fecha"
              required
              defaultValue={donacion.fecha}
              className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Estado *</label>
            <select
              name="estado"
              required
              defaultValue={donacion.estado}
              className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
            >
              <option value="pendiente">Pendiente</option>
              <option value="pagado">Pagado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700">Método de pago</label>
          <select
            name="metodo_pago"
            defaultValue={donacion.metodo_pago ?? ''}
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          >
            <option value="">— Ninguno —</option>
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="bizum">Bizum</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700">Concepto</label>
          <input
            name="concepto"
            defaultValue={donacion.concepto ?? ''}
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700">Cobro / Campaña</label>
            <select
              name="cobro_id"
              defaultValue={donacion.cobro_id ?? ''}
              className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
            >
              <option value="">— Ninguno —</option>
              {cobros?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700">Institución</label>
            <select
              name="institucion_id"
              defaultValue={donacion.institucion_id ?? ''}
              className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
            >
              <option value="">— Ninguna —</option>
              {instituciones?.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700">Notas</label>
          <textarea
            name="notas"
            rows={3}
            defaultValue={donacion.notas ?? ''}
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
