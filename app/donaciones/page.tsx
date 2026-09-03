import Link from 'next/link';
import { crearClienteServidor } from '@/lib/supabase/server';
import { obtenerPerfilActual } from '@/lib/auth-helpers';
import { eliminarDonacion } from './actions';
import { IconLink } from '@/components/icon-link';
import { BotonEliminarConfirmacion } from '@/components/boton-eliminar-confirmacion';
import { IconVer, IconEditar } from '@/components/icons';
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

const ESTADOS: EstadoDonacion[] = ['pendiente', 'pagado', 'cancelado'];

export default async function PaginaDonaciones({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; cobro?: string }>;
}) {
  const { estado, cobro } = await searchParams;
  const supabase = await crearClienteServidor();

  let consulta = supabase
    .from('donaciones')
    .select('id, persona_id, cobro_id, monto, moneda, concepto, estado, fecha')
    .order('fecha', { ascending: false });

  if (estado && ESTADOS.includes(estado as EstadoDonacion)) {
    consulta = consulta.eq('estado', estado as EstadoDonacion);
  }
  if (cobro) {
    consulta = consulta.eq('cobro_id', cobro);
  }

  const { data: donaciones, error } = await consulta;
  const perfil = await obtenerPerfilActual();
  const esSuperAdmin = perfil?.rol === 'super_admin';

  const personaIds = [...new Set((donaciones ?? []).map((d) => d.persona_id))];
  const cobroIds = [
    ...new Set((donaciones ?? []).map((d) => d.cobro_id).filter((v): v is string => !!v)),
  ];

  const { data: personas } = personaIds.length
    ? await supabase.from('personas').select('id, nombre, apellidos').in('id', personaIds)
    : { data: [] };
  const { data: cobros } = cobroIds.length
    ? await supabase.from('cobros').select('id, nombre').in('id', cobroIds)
    : { data: [] };

  const nombrePorPersona = new Map(
    (personas ?? []).map((p) => [p.id, `${p.nombre} ${p.apellidos}`])
  );
  const nombrePorCobro = new Map((cobros ?? []).map((c) => [c.id, c.nombre]));

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/" className="text-sm text-torat-moshe-gray hover:underline">
            ← Volver al dashboard
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-torat-moshe-navy">Donaciones</h1>
        </div>
        <Link
          href="/donaciones/nueva"
          className="rounded bg-torat-moshe-navy px-4 py-2 text-sm font-medium text-white hover:bg-torat-moshe-navy-dark"
        >
          + Nueva donación
        </Link>
      </div>

      <div className="mb-4 flex gap-2 text-sm">
        <Link
          href="/donaciones"
          className={`rounded-full px-3 py-1 ${!estado ? 'bg-torat-moshe-navy text-white' : 'bg-torat-moshe-gray/10 text-torat-moshe-gray'}`}
        >
          Todas
        </Link>
        {ESTADOS.map((e) => (
          <Link
            key={e}
            href={`/donaciones?estado=${e}`}
            className={`rounded-full px-3 py-1 ${estado === e ? 'bg-torat-moshe-navy text-white' : 'bg-torat-moshe-gray/10 text-torat-moshe-gray'}`}
          >
            {ETIQUETA_ESTADO[e]}
          </Link>
        ))}
      </div>

      {error && (
        <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">
          Error al cargar donaciones: {error.message}
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border border-torat-moshe-gray/30">
        <table className="min-w-full divide-y divide-torat-moshe-gray/20 text-sm">
          <thead className="bg-torat-moshe-navy/5">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-torat-moshe-navy">Persona</th>
              <th className="px-4 py-2 text-left font-medium text-torat-moshe-navy">Concepto</th>
              <th className="px-4 py-2 text-left font-medium text-torat-moshe-navy">Cobro</th>
              <th className="px-4 py-2 text-right font-medium text-torat-moshe-navy">Importe</th>
              <th className="px-4 py-2 text-left font-medium text-torat-moshe-navy">Fecha</th>
              <th className="px-4 py-2 text-left font-medium text-torat-moshe-navy">Estado</th>
              <th className="px-4 py-2 text-right font-medium text-torat-moshe-navy">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-torat-moshe-gray/10">
            {donaciones?.map((don) => (
              <tr key={don.id}>
                <td className="px-4 py-2">{nombrePorPersona.get(don.persona_id) ?? '—'}</td>
                <td className="px-4 py-2 text-torat-moshe-gray">{don.concepto ?? '—'}</td>
                <td className="px-4 py-2 text-torat-moshe-gray">
                  {don.cobro_id ? nombrePorCobro.get(don.cobro_id) ?? '—' : '—'}
                </td>
                <td className="px-4 py-2 text-right">
                  {don.monto} {don.moneda}
                </td>
                <td className="px-4 py-2 text-torat-moshe-gray">{don.fecha}</td>
                <td className="px-4 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${COLOR_ESTADO[don.estado]}`}
                  >
                    {ETIQUETA_ESTADO[don.estado]}
                  </span>
                </td>
                <td className="px-4 py-2 text-right">
                  <div className="flex justify-end gap-1">
                    <IconLink href={`/donaciones/${don.id}`} title="Ver">
                      <IconVer className="h-4 w-4" />
                    </IconLink>
                    {esSuperAdmin && (
                      <>
                        <IconLink href={`/donaciones/${don.id}/editar`} title="Editar">
                          <IconEditar className="h-4 w-4" />
                        </IconLink>
                        <form
                          action={async () => {
                            'use server';
                            await eliminarDonacion(don.id);
                          }}
                        >
                          <BotonEliminarConfirmacion
                            mensaje="¿Eliminar esta donación? Esta acción no se puede deshacer."
                          />
                        </form>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {donaciones?.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-torat-moshe-gray">
                  No hay donaciones que coincidan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
