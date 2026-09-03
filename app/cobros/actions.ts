'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { crearClienteServidor } from '@/lib/supabase/server';

function campoTexto(formData: FormData, campo: string): string | null {
  const valor = (formData.get(campo) as string | null)?.trim();
  return valor ? valor : null;
}

function campoNumero(formData: FormData, campo: string): number | null {
  const valor = campoTexto(formData, campo);
  return valor ? Number(valor) : null;
}

export async function crearCobro(formData: FormData) {
  const nombre = (formData.get('nombre') as string).trim();

  const supabase = await crearClienteServidor();
  const { error } = await supabase.from('cobros').insert({
    nombre,
    descripcion: campoTexto(formData, 'descripcion'),
    fecha_inicio: campoTexto(formData, 'fecha_inicio'),
    fecha_fin: campoTexto(formData, 'fecha_fin'),
    meta_monto: campoNumero(formData, 'meta_monto'),
  });

  if (error) {
    redirect(`/cobros/nueva?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/cobros');
  redirect('/cobros');
}

export async function actualizarCobro(id: string, formData: FormData) {
  const nombre = (formData.get('nombre') as string).trim();

  const supabase = await crearClienteServidor();
  const { error } = await supabase
    .from('cobros')
    .update({
      nombre,
      descripcion: campoTexto(formData, 'descripcion'),
      fecha_inicio: campoTexto(formData, 'fecha_inicio'),
      fecha_fin: campoTexto(formData, 'fecha_fin'),
      meta_monto: campoNumero(formData, 'meta_monto'),
    })
    .eq('id', id);

  if (error) {
    redirect(`/cobros/${id}/editar?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/cobros');
  redirect(`/cobros/${id}`);
}

export async function cambiarActivoCobro(id: string, activo: boolean) {
  const supabase = await crearClienteServidor();
  const { error } = await supabase.from('cobros').update({ activo }).eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/cobros');
}
