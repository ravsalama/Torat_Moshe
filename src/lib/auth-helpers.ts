import { crearClienteServidor } from './supabase/server';
import type { RolUsuario } from '@/types/database.types';

/**
 * Devuelve el id y rol del usuario autenticado actual, o null si no hay
 * sesión o no tiene perfil. Útil para comprobaciones de permisos dentro
 * de Server Actions, además de las que ya hace middleware.ts a nivel de
 * ruta (esto cubre acciones más finas, como "solo super_admin puede
 * editar una donación ya creada").
 */
export async function obtenerPerfilActual(): Promise<{ id: string; rol: RolUsuario } | null> {
  const supabase = await crearClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol')
    .eq('id', user.id)
    .single();

  if (!perfil) return null;

  return { id: user.id, rol: perfil.rol };
}
