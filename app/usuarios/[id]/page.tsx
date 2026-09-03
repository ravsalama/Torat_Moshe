import Link from 'next/link';
import { notFound } from 'next/navigation';
import { crearClienteAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const ETIQUETA_ROL: Record<string, string> = {
  super_admin: 'Super administrador',
  gestor: 'Gestor',
  parnas: 'Parnas',
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

export default async function PaginaFichaUsuario({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabaseAdmin = crearClienteAdmin();
  const { data: perfil } = await supabaseAdmin
    .from('perfiles')
    .select('id, nombre_completo, rol, activo, created_at')
    .eq('id', id)
    .single();

  if (!perfil) {
    notFound();
  }

  const { data: usuarioAuth } = await supabaseAdmin.auth.admin.getUserById(id);

  const ultimoAcceso = usuarioAuth.user?.last_sign_in_at
    ? new Date(usuarioAuth.user.last_sign_in_at).toLocaleString('es-ES')
    : null;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/usuarios" className="text-sm text-torat-moshe-gray hover:underline">
            ← Volver a usuarios
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-torat-moshe-navy">
            {perfil.nombre_completo}
          </h1>
          <span
            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
              perfil.activo ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {perfil.activo ? 'Activo' : 'Inactivo'}
          </span>
        </div>
        <Link
          href={`/usuarios/${perfil.id}/editar`}
          className="rounded bg-torat-moshe-navy px-4 py-2 text-sm font-medium text-white hover:bg-torat-moshe-navy-dark"
        >
          Editar
        </Link>
      </div>

      <dl className="grid max-w-lg grid-cols-2 gap-4 rounded-lg border border-torat-moshe-gray/30 p-6">
        <Campo etiqueta="Email" valor={usuarioAuth.user?.email} />
        <Campo etiqueta="Rol" valor={ETIQUETA_ROL[perfil.rol] ?? perfil.rol} />
        <Campo
          etiqueta="Usuario creado el"
          valor={new Date(perfil.created_at).toLocaleDateString('es-ES')}
        />
        <Campo etiqueta="Último acceso" valor={ultimoAcceso} />
      </dl>
    </div>
  );
}
