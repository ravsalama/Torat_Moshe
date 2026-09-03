'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { crearClienteServidor } from '@/lib/supabase/server';

function campoTexto(formData: FormData, campo: string): string | null {
  const valor = (formData.get(campo) as string | null)?.trim();
  return valor ? valor : null;
}

export async function crearInstitucion(formData: FormData) {
  const nombre = (formData.get('nombre') as string).trim();

  const supabase = await crearClienteServidor();
  const { error } = await supabase.from('instituciones').insert({
    nombre,
    email_contacto: campoTexto(formData, 'email_contacto'),
    notas: campoTexto(formData, 'notas'),
  });

  if (error) {
    redirect(`/instituciones/nueva?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/instituciones');
  redirect('/instituciones');
}

export async function actualizarInstitucion(id: string, formData: FormData) {
  const nombre = (formData.get('nombre') as string).trim();

  const supabase = await crearClienteServidor();
  const { error } = await supabase
    .from('instituciones')
    .update({
      nombre,
      email_contacto: campoTexto(formData, 'email_contacto'),
      notas: campoTexto(formData, 'notas'),
    })
    .eq('id', id);

  if (error) {
    redirect(`/instituciones/${id}/editar?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/instituciones');
  redirect(`/instituciones/${id}`);
}

export async function cambiarActivoInstitucion(id: string, activo: boolean) {
  const supabase = await crearClienteServidor();
  const { error } = await supabase.from('instituciones').update({ activo }).eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/instituciones');
}
