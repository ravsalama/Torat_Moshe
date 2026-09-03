import { redirect } from 'next/navigation';
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

  return (
    <main className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-semibold text-torat-moshe-navy">
        Bienvenido, {perfil?.nombre_completo ?? user.email}
      </h1>
      <p className="mt-2 text-torat-moshe-gray">
        Rol actual: <span className="font-medium">{perfil?.rol ?? 'sin asignar'}</span>
      </p>

      {/* TODO: Dashboard real — calendario dual, próximos cumpleaños,
          próximos Najalot, Parashá de la semana. Contenido y accesos
          visibles varían según el rol (ver middleware.ts). */}
    </main>
  );
}
