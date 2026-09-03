import Link from 'next/link';
import { notFound } from 'next/navigation';
import { crearClienteServidor } from '@/lib/supabase/server';

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

export default async function PaginaFichaCobro({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await crearClienteServidor();
  const { data: cobro } = await supabase
    .from('cobros')
    .select('id, nombre, descripcion, fecha_inicio, fecha_fin, meta_monto, activo')
    .eq('id', id)
    .single();

  if (!cobro) {
    notFound();
  }

  const { data: donaciones } = await supabase
    .from('donaciones')
    .select('monto, estado')
    .eq('cobro_id', cobro.id);

  const totalPagado = (donaciones ?? [])
    .filter((d) => d.estado === 'pagado')
    .reduce((sum, d) => sum + Number(d.monto), 0);
  const totalPendiente = (donaciones ?? [])
    .filter((d) => d.estado === 'pendiente')
    .reduce((sum, d) => sum + Number(d.monto), 0);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/cobros" className="text-sm text-torat-moshe-gray hover:underline">
            ← Volver a cobros
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-torat-moshe-navy">{cobro.nombre}</h1>
          <span
            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
              cobro.activo ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {cobro.activo ? 'Activo' : 'Inactivo'}
          </span>
        </div>
        <Link
          href={`/cobros/${cobro.id}/editar`}
          className="rounded bg-torat-moshe-navy px-4 py-2 text-sm font-medium text-white hover:bg-torat-moshe-navy-dark"
        >
          Editar
        </Link>
      </div>

      <dl className="grid max-w-lg grid-cols-2 gap-4 rounded-lg border border-torat-moshe-gray/30 p-6">
        <div className="col-span-2">
          <Campo etiqueta="Descripción" valor={cobro.descripcion} />
        </div>
        <Campo etiqueta="Fecha de inicio" valor={cobro.fecha_inicio} />
        <Campo etiqueta="Fecha de fin" valor={cobro.fecha_fin} />
        <Campo etiqueta="Meta" valor={cobro.meta_monto ? `${cobro.meta_monto} €` : null} />
      </dl>

      <div className="mt-8 max-w-lg rounded-lg border border-torat-moshe-gray/30 p-6">
        <h2 className="mb-3 text-lg font-semibold text-torat-moshe-navy">
          Resumen de donaciones
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <Campo etiqueta="Recaudado (pagado)" valor={`${totalPagado.toFixed(2)} €`} />
          <Campo etiqueta="Pendiente de cobro" valor={`${totalPendiente.toFixed(2)} €`} />
        </div>
        <Link
          href={`/donaciones?cobro=${cobro.id}`}
          className="mt-4 inline-block text-sm text-torat-moshe-navy hover:underline"
        >
          Ver todas las donaciones de este cobro →
        </Link>
      </div>
    </div>
  );
}
