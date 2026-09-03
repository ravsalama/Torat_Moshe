import Link from 'next/link';
import { notFound } from 'next/navigation';
import { crearClienteAdmin } from '@/lib/supabase/server';
import { actualizarUsuario } from '../../actions';

export default async function PaginaEditarUsuario({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabaseAdmin = crearClienteAdmin();
  const { data: perfil } = await supabaseAdmin
    .from('perfiles')
    .select('id, nombre_completo, rol')
    .eq('id', id)
    .single();

  if (!perfil) {
    notFound();
  }

  const { data: usuarioAuth } = await supabaseAdmin.auth.admin.getUserById(id);

  const actualizarConId = actualizarUsuario.bind(null, perfil.id);

  return (
    <div className="p-6 md:p-8">
      <Link href="/usuarios" className="text-sm text-torat-moshe-gray hover:underline">
        ← Volver a usuarios
      </Link>
      <h1 className="mt-1 mb-1 text-2xl font-semibold text-torat-moshe-navy">Editar usuario</h1>
      <p className="mb-6 text-sm text-torat-moshe-gray">{usuarioAuth.user?.email}</p>

      {error && (
        <p className="mb-4 max-w-lg rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <form action={actualizarConId} className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm text-gray-700">Nombre completo *</label>
          <input
            name="nombre_completo"
            required
            defaultValue={perfil.nombre_completo}
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Rol *</label>
          <select
            name="rol"
            required
            defaultValue={perfil.rol}
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          >
            <option value="super_admin">Super administrador</option>
            <option value="gestor">Gestor</option>
            <option value="parnas">Parnas</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700">Nueva contraseña</label>
          <input
            type="password"
            name="nueva_password"
            minLength={8}
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          />
          <p className="mt-1 text-xs text-torat-moshe-gray">
            Déjalo vacío para no cambiarla. Mínimo 8 caracteres si la rellenas.
          </p>
        </div>

        <button
          type="submit"
          className="rounded bg-torat-moshe-navy px-4 py-2 text-sm font-medium text-white hover:bg-torat-moshe-navy-dark"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
