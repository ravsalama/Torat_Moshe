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

export default async function PaginaFichaInstitucion({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await crearClienteServidor();
  const { data: institucion } = await supabase
    .from('instituciones')
    .select('id, nombre, email_contacto, notas, activo')
    .eq('id', id)
    .single();

  if (!institucion) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/instituciones" className="text-sm text-torat-moshe-gray hover:underline">
            ← Volver a instituciones
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-torat-moshe-navy">
            {institucion.nombre}
          </h1>
          <span
            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
              institucion.activo ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {institucion.activo ? 'Activa' : 'Inactiva'}
          </span>
        </div>
        <Link
          href={`/instituciones/${institucion.id}/editar`}
          className="rounded bg-torat-moshe-navy px-4 py-2 text-sm font-medium text-white hover:bg-torat-moshe-navy-dark"
        >
          Editar
        </Link>
      </div>

      <dl className="grid max-w-lg grid-cols-2 gap-4 rounded-lg border border-torat-moshe-gray/30 p-6">
        <div className="col-span-2">
          <Campo etiqueta="Email de contacto" valor={institucion.email_contacto} />
        </div>
        <div className="col-span-2">
          <Campo etiqueta="Notas" valor={institucion.notas} />
        </div>
      </dl>
    </main>
  );
}
