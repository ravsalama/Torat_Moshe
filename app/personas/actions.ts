'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { crearClienteServidor } from '@/lib/supabase/server';
import { fechaGregorianaAHebrea } from '@/lib/hebcal';

/**
 * Lee un campo de texto del formulario y lo normaliza: recorta espacios
 * y convierte cadenas vacías en null (para columnas opcionales).
 */
function campoTexto(formData: FormData, campo: string): string | null {
  const valor = (formData.get(campo) as string | null)?.trim();
  return valor ? valor : null;
}

export async function crearPersona(formData: FormData) {
  const nombre = (formData.get('nombre') as string).trim();
  const apellidos = (formData.get('apellidos') as string).trim();
  const fechaNacimientoStr = campoTexto(formData, 'fecha_nacimiento');

  const fecha_nacimiento_hebrea = fechaNacimientoStr
    ? fechaGregorianaAHebrea(new Date(`${fechaNacimientoStr}T12:00:00`))
    : null;

  const supabase = await crearClienteServidor();
  const { error } = await supabase.from('personas').insert({
    nombre,
    apellidos,
    email: campoTexto(formData, 'email'),
    telefono: campoTexto(formData, 'telefono'),
    direccion: campoTexto(formData, 'direccion'),
    fecha_nacimiento: fechaNacimientoStr,
    fecha_nacimiento_hebrea,
    notas: campoTexto(formData, 'notas'),
  });

  if (error) {
    redirect(`/personas/nueva?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/personas');
  redirect('/personas');
}

export async function actualizarPersona(id: string, formData: FormData) {
  const nombre = (formData.get('nombre') as string).trim();
  const apellidos = (formData.get('apellidos') as string).trim();
  const fechaNacimientoStr = campoTexto(formData, 'fecha_nacimiento');
  const activo = formData.get('activo') === 'on';

  const fecha_nacimiento_hebrea = fechaNacimientoStr
    ? fechaGregorianaAHebrea(new Date(`${fechaNacimientoStr}T12:00:00`))
    : null;

  const supabase = await crearClienteServidor();
  const { error } = await supabase
    .from('personas')
    .update({
      nombre,
      apellidos,
      email: campoTexto(formData, 'email'),
      telefono: campoTexto(formData, 'telefono'),
      direccion: campoTexto(formData, 'direccion'),
      fecha_nacimiento: fechaNacimientoStr,
      fecha_nacimiento_hebrea,
      notas: campoTexto(formData, 'notas'),
      activo,
    })
    .eq('id', id);

  if (error) {
    redirect(`/personas/${id}/editar?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/personas');
  redirect(`/personas/${id}`);
}

export async function cambiarActivo(id: string, activo: boolean) {
  const supabase = await crearClienteServidor();
  const { error } = await supabase.from('personas').update({ activo }).eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/personas');
}

export async function eliminarPersona(id: string) {
  const supabase = await crearClienteServidor();
  const { error } = await supabase.from('personas').delete().eq('id', id);

  if (error) {
    throw new Error(
      error.code === '23503'
        ? 'No se puede eliminar: esta persona tiene donaciones u otros registros asociados. Desactívala en su lugar.'
        : error.message
    );
  }

  revalidatePath('/personas');
  redirect('/personas');
}
