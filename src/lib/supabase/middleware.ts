import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/types/database.types';

/**
 * Refresca la sesión de Supabase en cada petición (necesario con
 * @supabase/ssr para que las cookies de auth no caduquen). Se invoca
 * desde middleware.ts en la raíz del proyecto.
 */
export async function actualizarSesion(request: NextRequest) {
  let respuesta = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          respuesta = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            respuesta.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANTE: no eliminar esta línea. getUser() revalida el token
  // contra Supabase Auth (a diferencia de getSession(), que solo lee
  // la cookie local sin verificarla).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { respuesta, user };
}
