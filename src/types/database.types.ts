/**
 * Tipos generados manualmente a partir de las migraciones SQL
 * (supabase/migrations/). Cuando recuperes acceso a Supabase, sustituye
 * este archivo por el resultado real de:
 *
 *   npm run types:generate
 *
 * (usa `supabase gen types typescript`, ver script en package.json)
 * para asegurar que coincide exactamente con el esquema aplicado.
 */

export type RolUsuario = 'super_admin' | 'gestor' | 'parnas';
export type EstadoDonacion = 'pendiente' | 'pagado' | 'cancelado';
export type MetodoPago = 'efectivo' | 'transferencia' | 'tarjeta' | 'bizum' | 'otro';
export type TipoPlantilla =
  | 'donacion_nueva'
  | 'recordatorio_pago'
  | 'agradecimiento_pago'
  | 'notificacion_institucion';

export interface Database {
  public: {
    Tables: {
      perfiles: {
        Row: {
          id: string;
          nombre_completo: string;
          rol: RolUsuario;
          activo: boolean;
          created_at: string;
          updated_at: string;
        };
        Relationships: [];
        Insert: Partial<Database['public']['Tables']['perfiles']['Row']> & {
          id: string;
          nombre_completo: string;
        };
        Update: Partial<Database['public']['Tables']['perfiles']['Row']>;
      };
      personas: {
        Row: {
          id: string;
          nombre: string;
          apellidos: string;
          email: string | null;
          telefono: string | null;
          direccion: string | null;
          fecha_nacimiento: string | null;
          fecha_nacimiento_hebrea: string | null;
          notas: string | null;
          activo: boolean;
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Relationships: [];
        Insert: Partial<Database['public']['Tables']['personas']['Row']> & {
          nombre: string;
          apellidos: string;
        };
        Update: Partial<Database['public']['Tables']['personas']['Row']>;
      };
      cobros: {
        Row: {
          id: string;
          nombre: string;
          descripcion: string | null;
          fecha_inicio: string | null;
          fecha_fin: string | null;
          meta_monto: number | null;
          activo: boolean;
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Relationships: [];
        Insert: Partial<Database['public']['Tables']['cobros']['Row']> & { nombre: string };
        Update: Partial<Database['public']['Tables']['cobros']['Row']>;
      };
      instituciones: {
        Row: {
          id: string;
          nombre: string;
          email_contacto: string | null;
          notas: string | null;
          activo: boolean;
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Relationships: [];
        Insert: Partial<Database['public']['Tables']['instituciones']['Row']> & { nombre: string };
        Update: Partial<Database['public']['Tables']['instituciones']['Row']>;
      };
      donaciones: {
        Row: {
          id: string;
          persona_id: string;
          cobro_id: string | null;
          institucion_id: string | null;
          monto: number;
          moneda: string;
          concepto: string | null;
          estado: EstadoDonacion;
          metodo_pago: MetodoPago | null;
          fecha: string;
          notas: string | null;
          es_matenat_yado: boolean;
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Relationships: [];
        Insert: Partial<Database['public']['Tables']['donaciones']['Row']> & {
          persona_id: string;
          monto: number;
        };
        Update: Partial<Database['public']['Tables']['donaciones']['Row']>;
      };
      najalot: {
        Row: {
          id: string;
          persona_id: string;
          nombre_familiar: string;
          relacion_familiar: string;
          calendario_origen: 'hebreo' | 'gregoriano';
          dia_hebreo: number;
          mes_hebreo: string;
          anio_hebreo: number | null;
          dia_gregoriano: number | null;
          mes_gregoriano: number | null;
          anio_gregoriano: number | null;
          notas: string | null;
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Relationships: [];
        Insert: Partial<Database['public']['Tables']['najalot']['Row']> & {
          persona_id: string;
          nombre_familiar: string;
          relacion_familiar: string;
          calendario_origen: 'hebreo' | 'gregoriano';
          dia_hebreo: number;
          mes_hebreo: string;
        };
        Update: Partial<Database['public']['Tables']['najalot']['Row']>;
      };
      plantillas_email: {
        Row: {
          id: string;
          tipo: TipoPlantilla;
          asunto: string;
          cuerpo_html: string;
          clausula_lopd: string;
          activo: boolean;
          updated_by: string | null;
          updated_at: string;
        };
        Relationships: [];
        Insert: Partial<Database['public']['Tables']['plantillas_email']['Row']> & {
          tipo: TipoPlantilla;
          asunto: string;
          cuerpo_html: string;
        };
        Update: Partial<Database['public']['Tables']['plantillas_email']['Row']>;
      };
      audit_logs: {
        Row: {
          id: number;
          usuario_id: string | null;
          accion: string;
          tabla_afectada: string;
          registro_id: string | null;
          datos_anteriores: Record<string, unknown> | null;
          datos_nuevos: Record<string, unknown> | null;
          created_at: string;
        };
        Relationships: [];
        Insert: never; // Solo se inserta vía trigger fn_audit_log()
        Update: never;
      };
      configuracion: {
        Row: {
          clave: string;
          valor: unknown;
          descripcion: string | null;
          updated_by: string | null;
          updated_at: string;
        };
        Relationships: [];
        Insert: Partial<Database['public']['Tables']['configuracion']['Row']> & {
          clave: string;
          valor: unknown;
        };
        Update: Partial<Database['public']['Tables']['configuracion']['Row']>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      obtener_cumpleanos: {
        Args: Record<string, never>;
        Returns: {
          persona_id: string;
          nombre: string;
          apellidos: string;
          fecha_nacimiento: string;
        }[];
      };
      obtener_najalot: {
        Args: Record<string, never>;
        Returns: {
          persona_id: string;
          nombre: string;
          apellidos: string;
          najalot_dia_hebreo: number;
          najalot_mes_hebreo: string;
        }[];
      };
      marcar_donacion_pagada: {
        Args: { p_donacion_id: string; p_metodo_pago: MetodoPago; p_monto?: number };
        Returns: void;
      };
      cancelar_donacion: {
        Args: { p_donacion_id: string; p_motivo: string };
        Returns: void;
      };
    };
  };
}
