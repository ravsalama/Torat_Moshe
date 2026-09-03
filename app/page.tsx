import { redirect } from 'next/navigation';
import Link from 'next/link';
import { crearClienteServidor } from '@/lib/supabase/server';

export default async function PaginaInicio() {
  const supabase = await crearClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('nombre_completo, rol')
    .eq('id', user.id)
    .single();

  const esStaff = perfil?.rol === 'super_admin' || perfil?.rol === 'gestor';
  const esSuperAdmin = perfil?.rol === 'super_admin';

  return (
    <main className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-semibold text-torat-moshe-navy">
        Bienvenido, {perfil?.nombre_completo ?? user.email}
      </h1>
      <p className="mt-2 text-torat-moshe-gray">
        Rol actual: <span className="font-medium">{perfil?.rol ?? 'sin asignar'}</span>
      </p>

      {(esStaff || esSuperAdmin) && (
        <nav className="mt-6 flex flex-wrap gap-4">
          {esStaff && (
            <>
              <Link
                href="/personas"
                className="rounded bg-torat-moshe-navy px-4 py-2 text-sm font-medium text-white hover:bg-torat-moshe-navy-dark"
              >
                Personas / Congregantes
              </Link>
              <Link
                href="/donaciones"
                className="rounded bg-torat-moshe-navy px-4 py-2 text-sm font-medium text-white hover:bg-torat-moshe-navy-dark"
              >
                Donaciones
              </Link>
              <Link
                href="/cobros"
                className="rounded bg-torat-moshe-navy px-4 py-2 text-sm font-medium text-white hover:bg-torat-moshe-navy-dark"
              >
                Cobros / Campañas
              </Link>
              <Link
                href="/instituciones"
                className="rounded bg-torat-moshe-navy px-4 py-2 text-sm font-medium text-white hover:bg-torat-moshe-navy-dark"
              >
                Instituciones
              </Link>
            </>
          )}
          {esSuperAdmin && (
            <Link
              href="/usuarios"
              className="rounded bg-torat-moshe-navy px-4 py-2 text-sm font-medium text-white hover:bg-torat-moshe-navy-dark"
            >
              Usuarios
            </Link>
          )}
        </nav>
      )}

      {/* TODO: Dashboard real — calendario dual, próximos cumpleaños,
          próximos Najalot, Parashá de la semana. Contenido y accesos
          visibles varían según el rol (ver middleware.ts). */}
    </main>
  );
}
