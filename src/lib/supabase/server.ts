import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database.types';

/**
 * Cliente de Supabase para Server Components, Server Actions y Route
 * Handlers. Usa la anon key + la sesión del usuario (cookies): respeta
 * siempre RLS, igual que el cliente de navegador.
 *
 * Para operaciones que deliberadamente necesitan saltarse RLS (muy
 * poco frecuente, p.ej. un script administrativo puntual), usar
 * `crearClienteAdmin()` de este mismo módulo — nunca desde código que
 * responda directamente a una petición de un usuario no verificado.
 */
export async function crearClienteServidor() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Se puede ignorar si setAll() se llama desde un Server
            // Component: el middleware ya se encarga de refrescar la
            // sesión en ese caso.
          }
        },
      },
    }
  );
}

/**
 * Cliente ADMINISTRATIVO con service_role: bypasea RLS por completo.
 * Solo para uso en el servidor, en tareas de confianza total
 * (p.ej. Edge Functions de envío de email, scripts de migración de
 * datos). NUNCA importar esto en un Client Component ni en código que
 * procese input de usuario sin verificación de rol previa.
 */
export function crearClienteAdmin() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {
          // No aplica: este cliente no maneja sesión de usuario.
        },
      },
    }
  );
}
