'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { crearClienteServidor } from '@/lib/supabase/server';
import { gregorianoADiaMesAnioHebreo } from '@/lib/hebcal';

type CalendarioOrigen = 'hebreo' | 'gregoriano';

function campoTexto(formData: FormData, campo: string): string | null {
  const valor = (formData.get(campo) as string | null)?.trim();
  return valor ? valor : null;
}

function campoNumero(formData: FormData, campo: string): number | null {
  const valor = campoTexto(formData, campo);
  return valor ? Number(valor) : null;
}

/**
 * A partir de los datos del formulario (que siempre trae los dos
 * bloques, hebreo y gregoriano, pero solo uno relevante según
 * calendario_origen), calcula los campos a guardar en BD.
 */
function calcularCampos(formData: FormData) {
  const calendario_origen = formData.get('calendario_origen') as CalendarioOrigen;

  if (calendario_origen === 'hebreo') {
    const dia_hebreo = campoNumero(formData, 'dia_hebreo');
    const mes_hebreo = campoTexto(formData, 'mes_hebreo');
    const anio_hebreo = campoNumero(formData, 'anio_hebreo');

    if (!dia_hebreo || !mes_hebreo) {
      throw new Error('Faltan el día o el mes hebreo.');
    }

    return {
      calendario_origen,
      dia_hebreo,
      mes_hebreo,
      anio_hebreo,
      dia_gregoriano: null,
      mes_gregoriano: null,
      anio_gregoriano: null,
    };
  }

  const dia_gregoriano = campoNumero(formData, 'dia_gregoriano');
  const mes_gregoriano = campoNumero(formData, 'mes_gregoriano');
  const anio_gregoriano = campoNumero(formData, 'anio_gregoriano');

  if (!dia_gregoriano || !mes_gregoriano) {
    throw new Error('Faltan el día o el mes gregoriano.');
  }

  const conversion = gregorianoADiaMesAnioHebreo(
    dia_gregoriano,
    mes_gregoriano,
    anio_gregoriano ?? undefined
  );

  return {
    calendario_origen,
    dia_hebreo: conversion.dia,
    mes_hebreo: conversion.mes,
    anio_hebreo: conversion.anio,
    dia_gregoriano,
    mes_gregoriano,
    anio_gregoriano,
  };
}

export async function crearNajala(personaId: string, formData: FormData) {
  const nombre_familiar = (formData.get('nombre_familiar') as string).trim();
  const relacion_familiar = (formData.get('relacion_familiar') as string).trim();
  const notas = campoTexto(formData, 'notas');

  let campos;
  try {
    campos = calcularCampos(formData);
  } catch (e) {
    const mensaje = e instanceof Error ? e.message : 'Datos de fecha inválidos.';
    redirect(`/personas/${personaId}/najalot/nueva?error=${encodeURIComponent(mensaje)}`);
  }

  const supabase = await crearClienteServidor();
  const { error } = await supabase.from('najalot').insert({
    persona_id: personaId,
    nombre_familiar,
    relacion_familiar,
    notas,
    ...campos!,
  });

  if (error) {
    redirect(`/personas/${personaId}/najalot/nueva?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/personas/${personaId}`);
  redirect(`/personas/${personaId}`);
}

export async function actualizarNajala(personaId: string, najalaId: string, formData: FormData) {
  const nombre_familiar = (formData.get('nombre_familiar') as string).trim();
  const relacion_familiar = (formData.get('relacion_familiar') as string).trim();
  const notas = campoTexto(formData, 'notas');

  let campos;
  try {
    campos = calcularCampos(formData);
  } catch (e) {
    const mensaje = e instanceof Error ? e.message : 'Datos de fecha inválidos.';
    redirect(
      `/personas/${personaId}/najalot/${najalaId}/editar?error=${encodeURIComponent(mensaje)}`
    );
  }

  const supabase = await crearClienteServidor();
  const { error } = await supabase
    .from('najalot')
    .update({
      nombre_familiar,
      relacion_familiar,
      notas,
      ...campos!,
    })
    .eq('id', najalaId);

  if (error) {
    redirect(
      `/personas/${personaId}/najalot/${najalaId}/editar?error=${encodeURIComponent(error.message)}`
    );
  }

  revalidatePath(`/personas/${personaId}`);
  redirect(`/personas/${personaId}`);
}

export async function eliminarNajala(personaId: string, najalaId: string) {
  const supabase = await crearClienteServidor();
  const { error } = await supabase.from('najalot').delete().eq('id', najalaId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/personas/${personaId}`);
}
