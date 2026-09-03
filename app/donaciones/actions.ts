'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { crearClienteServidor } from '@/lib/supabase/server';
import { obtenerPerfilActual } from '@/lib/auth-helpers';
import type { MetodoPago } from '@/types/database.types';

function campoTexto(formData: FormData, campo: string): string | null {
  const valor = (formData.get(campo) as string | null)?.trim();
  return valor ? valor : null;
}

export async function crearDonacion(formData: FormData) {
  const persona_id = formData.get('persona_id') as string;
  const monto = Number(formData.get('monto'));
  const moneda = ((formData.get('moneda') as string) || 'EUR').trim();
  const fecha = formData.get('fecha') as string;
  const cobro_id = campoTexto(formData, 'cobro_id');
  const institucion_id = campoTexto(formData, 'institucion_id');

  const supabase = await crearClienteServidor();
  const { error } = await supabase.from('donaciones').insert({
    persona_id,
    cobro_id,
    institucion_id,
    monto,
    moneda,
    concepto: campoTexto(formData, 'concepto'),
    estado: 'pendiente',
    fecha,
    notas: campoTexto(formData, 'notas'),
  });

  if (error) {
    redirect(`/donaciones/nueva?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/donaciones');
  redirect('/donaciones');
}

/**
 * Marca una donación como pagada. Usa la función de BD
 * marcar_donacion_pagada(), disponible tanto para gestor como para
 * super_admin (a diferencia de una edición libre, que es solo para
 * super_admin).
 */
export async function marcarDonacionPagada(donacionId: string, formData: FormData) {
  const metodo_pago = formData.get('metodo_pago') as MetodoPago;

  const supabase = await crearClienteServidor();
  const { error } = await supabase.rpc('marcar_donacion_pagada', {
    p_donacion_id: donacionId,
    p_metodo_pago: metodo_pago,
  });

  if (error) {
    redirect(`/donaciones/${donacionId}/pagar?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/donaciones/${donacionId}`);
  revalidatePath('/donaciones');
  redirect(`/donaciones/${donacionId}`);
}

/**
 * Cancela una donación. Usa la función de BD cancelar_donacion(),
 * disponible tanto para gestor como para super_admin.
 */
export async function cancelarDonacion(donacionId: string, formData: FormData) {
  const motivo = (formData.get('motivo') as string).trim();

  const supabase = await crearClienteServidor();
  const { error } = await supabase.rpc('cancelar_donacion', {
    p_donacion_id: donacionId,
    p_motivo: motivo,
  });

  if (error) {
    redirect(`/donaciones/${donacionId}/cancelar?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/donaciones/${donacionId}`);
  revalidatePath('/donaciones');
  redirect(`/donaciones/${donacionId}`);
}

/**
 * Edición libre de una donación (cualquier campo, incluido el estado a
 * mano). Solo super_admin — comprobado aquí además de confiar en RLS,
 * porque no tenemos certeza de que las políticas de BD ya reflejen esta
 * regla exactamente.
 */
export async function actualizarDonacion(id: string, formData: FormData) {
  const perfil = await obtenerPerfilActual();
  if (perfil?.rol !== 'super_admin') {
    redirect(
      `/donaciones/${id}?error=${encodeURIComponent('Solo un super administrador puede editar una donación directamente.')}`
    );
  }

  const persona_id = formData.get('persona_id') as string;
  const monto = Number(formData.get('monto'));
  const moneda = ((formData.get('moneda') as string) || 'EUR').trim();
  const fecha = formData.get('fecha') as string;
  const estado = formData.get('estado') as 'pendiente' | 'pagado' | 'cancelado';
  const metodo_pago = (formData.get('metodo_pago') as MetodoPago | '') || null;
  const cobro_id = campoTexto(formData, 'cobro_id');
  const institucion_id = campoTexto(formData, 'institucion_id');

  const supabase = await crearClienteServidor();
  const { error } = await supabase
    .from('donaciones')
    .update({
      persona_id,
      cobro_id,
      institucion_id,
      monto,
      moneda,
      concepto: campoTexto(formData, 'concepto'),
      estado,
      metodo_pago,
      fecha,
      notas: campoTexto(formData, 'notas'),
    })
    .eq('id', id);

  if (error) {
    redirect(`/donaciones/${id}/editar?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/donaciones/${id}`);
  revalidatePath('/donaciones');
  redirect(`/donaciones/${id}`);
}

export async function eliminarDonacion(id: string) {
  const perfil = await obtenerPerfilActual();
  if (perfil?.rol !== 'super_admin') {
    throw new Error('Solo un super administrador puede eliminar una donación.');
  }

  const supabase = await crearClienteServidor();
  const { error } = await supabase.from('donaciones').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/donaciones');
  redirect('/donaciones');
}
