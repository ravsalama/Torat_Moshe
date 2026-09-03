'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { crearClienteAdmin, crearClienteServidor } from '@/lib/supabase/server';
import type { RolUsuario } from '@/types/database.types';

export async function crearUsuario(formData: FormData) {
  const email = (formData.get('email') as string).trim();
  const password = formData.get('password') as string;
  const nombre_completo = (formData.get('nombre_completo') as string).trim();
  const rol = formData.get('rol') as RolUsuario;

  if (password.length < 8) {
    redirect(
      `/usuarios/nueva?error=${encodeURIComponent('La contraseña debe tener al menos 8 caracteres.')}`
    );
  }

  const supabaseAdmin = crearClienteAdmin();

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error || !data.user) {
    redirect(
      `/usuarios/nueva?error=${encodeURIComponent(error?.message ?? 'No se pudo crear el usuario.')}`
    );
  }

  const { error: errorPerfil } = await supabaseAdmin
    .from('perfiles')
    .upsert(
      { id: data.user.id, nombre_completo, rol, activo: true },
      { onConflict: 'id' }
    );

  if (errorPerfil) {
    // Evitar dejar un usuario de Auth huérfano sin perfil.
    await supabaseAdmin.auth.admin.deleteUser(data.user.id);
    redirect(`/usuarios/nueva?error=${encodeURIComponent(errorPerfil.message)}`);
  }

  revalidatePath('/usuarios');
  redirect('/usuarios');
}

export async function actualizarUsuario(id: string, formData: FormData) {
  const nombre_completo = (formData.get('nombre_completo') as string).trim();
  const rol = formData.get('rol') as RolUsuario;
  const nuevaPassword = (formData.get('nueva_password') as string | null)?.trim();

  const supabaseAdmin = crearClienteAdmin();

  const { error } = await supabaseAdmin
    .from('perfiles')
    .update({ nombre_completo, rol })
    .eq('id', id);

  if (error) {
    redirect(`/usuarios/${id}/editar?error=${encodeURIComponent(error.message)}`);
  }

  if (nuevaPassword) {
    if (nuevaPassword.length < 8) {
      redirect(
        `/usuarios/${id}/editar?error=${encodeURIComponent(
          'La nueva contraseña debe tener al menos 8 caracteres.'
        )}`
      );
    }
    const { error: errorPassword } = await supabaseAdmin.auth.admin.updateUserById(id, {
      password: nuevaPassword,
    });
    if (errorPassword) {
      redirect(`/usuarios/${id}/editar?error=${encodeURIComponent(errorPassword.message)}`);
    }
  }

  revalidatePath('/usuarios');
  redirect('/usuarios');
}

export async function cambiarActivoUsuario(id: string, activo: boolean) {
  const supabase = await crearClienteServidor();
  const {
    data: { user: usuarioActual },
  } = await supabase.auth.getUser();

  if (usuarioActual?.id === id && !activo) {
    throw new Error('No puedes desactivar tu propio usuario.');
  }

  const supabaseAdmin = crearClienteAdmin();

  const { error: errorPerfil } = await supabaseAdmin
    .from('perfiles')
    .update({ activo })
    .eq('id', id);

  if (errorPerfil) {
    throw new Error(errorPerfil.message);
  }

  // Además de marcarlo inactivo en perfiles, se bloquea/desbloquea el
  // login real en Supabase Auth.
  const { error: errorBan } = await supabaseAdmin.auth.admin.updateUserById(id, {
    ban_duration: activo ? 'none' : '876000h', // ~100 años
  });

  if (errorBan) {
    throw new Error(errorBan.message);
  }

  revalidatePath('/usuarios');
}
