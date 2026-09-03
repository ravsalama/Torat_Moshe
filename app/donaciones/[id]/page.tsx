import Link from 'next/link';
import { notFound } from 'next/navigation';
import { crearClienteServidor } from '@/lib/supabase/server';
import { obtenerPerfilActual } from '@/lib/auth-helpers';
import { eliminarDonacion } from '../actions';
import type { EstadoDonacion } from '@/types/database.types';

const ETIQUETA_ESTADO: Record<EstadoDonacion, string> = {
  pendiente: 'Pendiente',
  pagado: 'Pagado',
  cancelado: 'Cancelado',
};

const COLOR_ESTADO: Record<EstadoDonacion, string> = {
  pendiente: 'bg-yellow-50 text-yellow-700',
  pagado: 'bg-green-50 text-green-700',
  cancelado: 'bg-gray-100 text-gray-500',
};

function Campo({ etiqueta, valor }: { etiqueta: string; valor: string | null | undefined }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-torat-moshe-gray">
        {etiqueta}
      </dt>
      <dd className="mt-0.5 text-sm text-gray-900">{valor && valor.length > 0 ? valor : '—'}</dd>
    </div>
  );
}

export default async function PaginaFichaDonacion({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

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

  const [{ data: persona }, { data: cobro }, { data: institucion }, perfil] = await Promise.all([
    supabase.from('personas').select('id, nombre, apellidos').eq('id', donacion.persona_id).single(),
    donacion.cobro_id
      ? supabase.from('cobros').select('id, nombre').eq('id', donacion.cobro_id).single()
      : Promise.resolve({ data: null }),
    donacion.institucion_id
      ? supabase.from('instituciones').select('id, nombre').eq('id', donacion.institucion_id).single()
      : Promise.resolve({ data: null }),
    obtenerPerfilActual(),
  ]);

  const esSuperAdmin = perfil?.rol === 'super_admin';

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/donaciones" className="text-sm text-torat-moshe-gray hover:underline">
            ← Volver a donaciones
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-torat-moshe-navy">
            {donacion.monto} {donacion.moneda}
          </h1>
          <span
            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${COLOR_ESTADO[donacion.estado]}`}
          >
            {ETIQUETA_ESTADO[donacion.estado]}
          </span>
        </div>
        {esSuperAdmin && (
          <div className="flex gap-2">
            <Link
              href={`/donaciones/${donacion.id}/editar`}
              className="rounded bg-torat-moshe-navy px-4 py-2 text-sm font-medium text-white hover:bg-torat-moshe-navy-dark"
            >
              Editar
            </Link>
            <form
              action={async () => {
                'use server';
                await eliminarDonacion(donacion.id);
              }}
            >
              <button
                type="submit"
                className="rounded border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Eliminar
              </button>
            </form>
          </div>
        )}
      </div>

      {error && (
        <p className="mb-4 max-w-lg rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <dl className="grid max-w-lg grid-cols-2 gap-4 rounded-lg border border-torat-moshe-gray/30 p-6">
        <div className="col-span-2">
          <Campo
            etiqueta="Persona"
            valor={persona ? `${persona.nombre} ${persona.apellidos}` : null}
          />
        </div>
        <Campo etiqueta="Fecha" valor={donacion.fecha} />
        <Campo etiqueta="Método de pago" valor={donacion.metodo_pago} />
        <div className="col-span-2">
          <Campo etiqueta="Concepto" valor={donacion.concepto} />
        </div>
        <Campo etiqueta="Cobro / Campaña" valor={cobro?.nombre} />
        <Campo etiqueta="Institución" valor={institucion?.nombre} />
        <div className="col-span-2">
          <Campo etiqueta="Notas" valor={donacion.notas} />
        </div>
      </dl>

      <div className="mt-6 flex max-w-lg gap-3">
        {donacion.estado === 'pendiente' && (
          <Link
            href={`/donaciones/${donacion.id}/pagar`}
            className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Marcar como pagada
          </Link>
        )}
        {donacion.estado !== 'cancelado' && (
          <Link
            href={`/donaciones/${donacion.id}/cancelar`}
            className="rounded border border-torat-moshe-gray/40 px-4 py-2 text-sm font-medium text-torat-moshe-gray hover:bg-torat-moshe-gray/10"
          >
            Cancelar donación
          </Link>
        )}
      </div>
    </main>
  );
}
