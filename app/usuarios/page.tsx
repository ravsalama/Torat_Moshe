import Link from 'next/link';
import { crearClienteAdmin, crearClienteServidor } from '@/lib/supabase/server';
import { eliminarUsuario } from './actions';
import { IconLink } from '@/components/icon-link';
import { BotonEliminarConfirmacion } from '@/components/boton-eliminar-confirmacion';
import { IconVer, IconEditar } from '@/components/icons';

// Esta página usa la clave de servicio (service_role) para listar todos
// los usuarios: debe ejecutarse en cada petición, nunca prerenderizarse
// en el build (donde solo hay variables de entorno de ejemplo).
export const dynamic = 'force-dynamic';

const ETIQUETA_ROL: Record<string, string> = {
  super_admin: 'Super administrador',
  gestor: 'Gestor',
  parnas: 'Parnas',
};

export default async function PaginaUsuarios() {
  const supabaseAdmin = crearClienteAdmin();

  const supabase = await crearClienteServidor();
  const {
    data: { user: usuarioActual },
  } = await supabase.auth.getUser();

  const { data: perfiles, error } = await supabaseAdmin
    .from('perfiles')
    .select('id, nombre_completo, rol, activo')
    .order('nombre_completo', { ascending: true });

  const {
    data: { users: usuariosAuth },
  } = await supabaseAdmin.auth.admin.listUsers();

  const emailPorId = new Map(usuariosAuth.map((u) => [u.id, u.email]));

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/" className="text-sm text-torat-moshe-gray hover:underline">
            ← Volver al dashboard
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-torat-moshe-navy">Usuarios</h1>
        </div>
        <Link
          href="/usuarios/nueva"
          className="rounded bg-torat-moshe-navy px-4 py-2 text-sm font-medium text-white hover:bg-torat-moshe-navy-dark"
        >
          + Nuevo usuario
        </Link>
      </div>

      {error && (
        <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">
          Error al cargar usuarios: {error.message}
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border border-torat-moshe-gray/30">
        <table className="min-w-full divide-y divide-torat-moshe-gray/20 text-sm">
          <thead className="bg-torat-moshe-navy/5">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-torat-moshe-navy">Nombre</th>
              <th className="px-4 py-2 text-left font-medium text-torat-moshe-navy">Email</th>
              <th className="px-4 py-2 text-left font-medium text-torat-moshe-navy">Rol</th>
              <th className="px-4 py-2 text-left font-medium text-torat-moshe-navy">Estado</th>
              <th className="px-4 py-2 text-right font-medium text-torat-moshe-navy">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-torat-moshe-gray/10">
            {perfiles?.map((perfil) => (
              <tr key={perfil.id}>
                <td className="px-4 py-2">{perfil.nombre_completo}</td>
                <td className="px-4 py-2 text-torat-moshe-gray">
                  {emailPorId.get(perfil.id) ?? '—'}
                </td>
                <td className="px-4 py-2">{ETIQUETA_ROL[perfil.rol] ?? perfil.rol}</td>
                <td className="px-4 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      perfil.activo
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {perfil.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-2 text-right">
                  <div className="flex justify-end gap-1">
                    <IconLink href={`/usuarios/${perfil.id}`} title="Ver">
                      <IconVer className="h-4 w-4" />
                    </IconLink>
                    <IconLink href={`/usuarios/${perfil.id}/editar`} title="Editar">
                      <IconEditar className="h-4 w-4" />
                    </IconLink>
                    {perfil.id !== usuarioActual?.id && (
                      <form
                        action={async () => {
                          'use server';
                          await eliminarUsuario(perfil.id);
                        }}
                      >
                        <BotonEliminarConfirmacion
                          mensaje={`¿Eliminar el usuario "${perfil.nombre_completo}"? Perderá el acceso permanentemente. Esta acción no se puede deshacer.`}
                        />
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {perfiles?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-torat-moshe-gray">
                  Aún no hay usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
