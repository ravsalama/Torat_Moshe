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
      'id, nombre, apellidos, email, telefono, direccion, fecha_nacimiento, fecha_nacimiento_hebrea, najalot_dia_hebreo, najalot_mes_hebreo, notas, activo, created_at'
    )
    .eq('id', id)
    .single();

  if (!persona) {
    notFound();
  }

  const najalot =
    persona.najalot_dia_hebreo && persona.najalot_mes_hebreo
      ? `${persona.najalot_dia_hebreo} de ${persona.najalot_mes_hebreo}`
      : null;

  return (
    <main className="min-h-screen bg-white p-8">
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
        <Link
          href={`/personas/${persona.id}/editar`}
          className="rounded bg-torat-moshe-navy px-4 py-2 text-sm font-medium text-white hover:bg-torat-moshe-navy-dark"
        >
          Editar
        </Link>
      </div>

      <dl className="grid max-w-lg grid-cols-2 gap-4 rounded-lg border border-torat-moshe-gray/30 p-6">
        <Campo etiqueta="Email" valor={persona.email} />
        <Campo etiqueta="Teléfono" valor={persona.telefono} />
        <div className="col-span-2">
          <Campo etiqueta="Dirección" valor={persona.direccion} />
        </div>
        <Campo etiqueta="Fecha de nacimiento" valor={persona.fecha_nacimiento} />
        <Campo etiqueta="Fecha hebrea de nacimiento" valor={persona.fecha_nacimiento_hebrea} />
        <Campo etiqueta="Najalot" valor={najalot} />
        <div className="col-span-2">
          <Campo etiqueta="Notas" valor={persona.notas} />
        </div>
      </dl>
    </main>
  );
}
