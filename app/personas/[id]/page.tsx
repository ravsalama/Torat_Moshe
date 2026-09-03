import Link from 'next/link';
import { notFound } from 'next/navigation';
import { crearClienteServidor } from '@/lib/supabase/server';
import { eliminarNajala } from './najalot/actions';
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

export default async function PaginaFichaPersona({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await crearClienteServidor();
  const { data: persona } = await supabase
    .from('personas')
    .select(
      'id, nombre, apellidos, email, telefono, direccion, fecha_nacimiento, fecha_nacimiento_hebrea, notas, activo, created_at'
    )
    .eq('id', id)
    .single();

  if (!persona) {
    notFound();
  }

  const { data: najalot } = await supabase
    .from('najalot')
    .select('id, nombre_familiar, relacion_familiar, dia_hebreo, mes_hebreo, anio_hebreo')
    .eq('persona_id', persona.id)
    .order('nombre_familiar', { ascending: true });

  const { data: donaciones } = await supabase
    .from('donaciones')
    .select('id, monto, moneda, concepto, estado, fecha, es_matenat_yado')
    .eq('persona_id', persona.id)
    .order('fecha', { ascending: false });

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/personas" className="text-sm text-torat-moshe-gray hover:underline">
            ← Volver a personas
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-torat-moshe-navy">
            {persona.nombre} {persona.apellidos}
          </h1>
          <span
            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
              persona.activo ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {persona.activo ? 'Activo' : 'Inactivo'}
          </span>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/donaciones/nueva?persona=${persona.id}`}
            className="rounded border border-torat-moshe-navy px-4 py-2 text-sm font-medium text-torat-moshe-navy hover:bg-torat-moshe-navy/5"
          >
            + Donación
          </Link>
          <Link
            href={`/personas/${persona.id}/editar`}
            className="rounded bg-torat-moshe-navy px-4 py-2 text-sm font-medium text-white hover:bg-torat-moshe-navy-dark"
          >
            Editar
          </Link>
        </div>
      </div>

      <dl className="grid max-w-lg grid-cols-2 gap-4 rounded-lg border border-torat-moshe-gray/30 p-6">
        <Campo etiqueta="Email" valor={persona.email} />
        <Campo etiqueta="Teléfono" valor={persona.telefono} />
        <div className="col-span-2">
          <Campo etiqueta="Dirección" valor={persona.direccion} />
        </div>
        <Campo etiqueta="Fecha de nacimiento" valor={persona.fecha_nacimiento} />
        <Campo etiqueta="Fecha hebrea de nacimiento" valor={persona.fecha_nacimiento_hebrea} />
        <div className="col-span-2">
          <Campo etiqueta="Notas" valor={persona.notas} />
        </div>
      </dl>

      <div className="mt-8 max-w-3xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-torat-moshe-navy">Historial de donativos</h2>
          <Link
            href={`/donaciones/nueva?persona=${persona.id}`}
            className="text-sm text-torat-moshe-navy hover:underline"
          >
            + Nueva donación
          </Link>
        </div>

        {donaciones && donaciones.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-torat-moshe-gray/30">
            <table className="min-w-full divide-y divide-torat-moshe-gray/20 text-sm">
              <thead className="bg-torat-moshe-navy/5">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-torat-moshe-navy">Fecha</th>
                  <th className="px-4 py-2 text-left font-medium text-torat-moshe-navy">
                    Concepto
                  </th>
                  <th className="px-4 py-2 text-right font-medium text-torat-moshe-navy">
                    Importe
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-torat-moshe-navy">Estado</th>
                  <th className="px-4 py-2 text-right font-medium text-torat-moshe-navy">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-torat-moshe-gray/10">
                {donaciones.map((don) => (
                  <tr key={don.id}>
                    <td className="px-4 py-2 text-torat-moshe-gray">{don.fecha}</td>
                    <td className="px-4 py-2">
                      {don.concepto ?? '—'}
                      {don.es_matenat_yado && (
                        <span className="ml-2 inline-block rounded-full bg-torat-moshe-navy/10 px-2 py-0.5 text-xs font-medium text-torat-moshe-navy">
                          Matenat Yado
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {don.monto} {don.moneda}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${COLOR_ESTADO[don.estado]}`}
                      >
                        {ETIQUETA_ESTADO[don.estado]}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right">
                      <Link
                        href={`/donaciones/${don.id}`}
                        className="mr-3 text-torat-moshe-navy hover:underline"
                      >
                        Ver
                      </Link>
                      {don.estado === 'pendiente' && (
                        <Link
                          href={`/donaciones/${don.id}/pagar`}
                          className="mr-3 text-green-700 hover:underline"
                        >
                          Marcar pagada
                        </Link>
                      )}
                      {don.estado !== 'cancelado' && (
                        <Link
                          href={`/donaciones/${don.id}/cancelar`}
                          className="text-torat-moshe-gray hover:underline"
                        >
                          Cancelar
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-torat-moshe-gray">
            Aún no hay donativos registrados para esta persona.
          </p>
        )}
      </div>

      <div className="mt-8 max-w-lg">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-torat-moshe-navy">Najalot</h2>
          <Link
            href={`/personas/${persona.id}/najalot/nueva`}
            className="text-sm text-torat-moshe-navy hover:underline"
          >
            + Añadir Najalot
          </Link>
        </div>

        {najalot && najalot.length > 0 ? (
          <ul className="divide-y divide-torat-moshe-gray/20 rounded-lg border border-torat-moshe-gray/30">
            {najalot.map((n) => (
              <li key={n.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900">
                    {n.nombre_familiar}{' '}
                    <span className="font-normal text-torat-moshe-gray">
                      ({n.relacion_familiar})
                    </span>
                  </p>
                  <p className="text-torat-moshe-gray">
                    {n.dia_hebreo} de {n.mes_hebreo}
                    {n.anio_hebreo ? ` ${n.anio_hebreo}` : ''}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link
                    href={`/personas/${persona.id}/najalot/${n.id}/editar`}
                    className="text-torat-moshe-navy hover:underline"
                  >
                    Editar
                  </Link>
                  <form
                    action={async () => {
                      'use server';
                      await eliminarNajala(persona.id, n.id);
                    }}
                  >
                    <button type="submit" className="text-red-600 hover:underline">
                      Eliminar
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-torat-moshe-gray">
            Aún no hay ningún Najalot registrado para esta persona.
          </p>
        )}
      </div>
    </div>
  );
}
