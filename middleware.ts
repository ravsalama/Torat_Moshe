import { type NextRequest, NextResponse } from 'next/server';
import { actualizarSesion } from '@/lib/supabase/middleware';
import { crearClienteServidor } from '@/lib/supabase/server';

// Rutas que requieren rol 'gestor' o 'super_admin' (parnas no puede entrar)
const RUTAS_STAFF = ['/personas', '/donaciones', '/cobros', '/plantillas'];
// Rutas exclusivas de super_admin
const RUTAS_SUPER_ADMIN = ['/configuracion', '/auditoria', '/usuarios'];
// Rutas públicas (no requieren sesión)
const RUTAS_PUBLICAS = ['/login'];

export async function middleware(request: NextRequest) {
  const { respuesta, user } = await actualizarSesion(request);
  const { pathname } = request.nextUrl;

  const esRutaPublica = RUTAS_PUBLICAS.some((ruta) => pathname.startsWith(ruta));

  if (!user && !esRutaPublica) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (user && esRutaPublica) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // Comprobación de rol solo si hace falta (evita una consulta extra en rutas públicas)
  const requiereStaff = RUTAS_STAFF.some((ruta) => pathname.startsWith(ruta));
  const requiereSuperAdmin = RUTAS_SUPER_ADMIN.some((ruta) => pathname.startsWith(ruta));

  if (user && (requiereStaff || requiereSuperAdmin)) {
    const supabase = await crearClienteServidor();
    const { data: perfil } = await supabase
      .from('perfiles')
      .select('rol')
      .eq('id', user.id)
      .single();

    const rol = perfil?.rol;
    const autorizado = requiereSuperAdmin
      ? rol === 'super_admin'
      : rol === 'super_admin' || rol === 'gestor';

    if (!autorizado) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return respuesta;
}

export const config = {
  matcher: [
    /*
     * Aplica el middleware a todo excepto archivos estáticos y de imagen.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
