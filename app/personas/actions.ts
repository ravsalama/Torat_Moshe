'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { crearClienteServidor } from '@/lib/supabase/server';
import { fechaGregorianaAHebrea, fechaGregorianaADiaYMesHebreo } from '@/lib/hebcal';

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
  const fechaNajalotStr = campoTexto(formData, 'fecha_najalot');

  const fecha_nacimiento_hebrea = fechaNacimientoStr
    ? fechaGregorianaAHebrea(new Date(`${fechaNacimientoStr}T12:00:00`))
    : null;

  let najalot_dia_hebreo: number | null = null;
  let najalot_mes_hebreo: string | null = null;
  if (fechaNajalotStr) {
    const { dia, mes } = fechaGregorianaADiaYMesHebreo(new Date(`${fechaNajalotStr}T12:00:00`));
    najalot_dia_hebreo = dia;
    najalot_mes_hebreo = mes;
  }

  const supabase = await crearClienteServidor();
  const { error } = await supabase.from('personas').insert({
    nombre,
    apellidos,
    email: campoTexto(formData, 'email'),
    telefono: campoTexto(formData, 'telefono'),
    direccion: campoTexto(formData, 'direccion'),
    fecha_nacimiento: fechaNacimientoStr,
    fecha_nacimiento_hebrea,
    najalot_dia_hebreo,
    najalot_mes_hebreo,
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
  const fechaNajalotStr = campoTexto(formData, 'fecha_najalot');

  const fecha_nacimiento_hebrea = fechaNacimientoStr
    ? fechaGregorianaAHebrea(new Date(`${fechaNacimientoStr}T12:00:00`))
    : null;

  const camposNajalot: { najalot_dia_hebreo?: number; najalot_mes_hebreo?: string } = {};
  if (fechaNajalotStr) {
    const { dia, mes } = fechaGregorianaADiaYMesHebreo(new Date(`${fechaNajalotStr}T12:00:00`));
    camposNajalot.najalot_dia_hebreo = dia;
    camposNajalot.najalot_mes_hebreo = mes;
  }

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
      ...camposNajalot,
    })
    .eq('id', id);

  if (error) {
    redirect(`/personas/${id}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/personas');
  redirect('/personas');
}

export async function cambiarActivo(id: string, activo: boolean) {
  const supabase = await crearClienteServidor();
  const { error } = await supabase.from('personas').update({ activo }).eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/personas');
}
