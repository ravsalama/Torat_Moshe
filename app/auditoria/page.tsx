import Link from 'next/link';
import { redirect } from 'next/navigation';
import { crearClienteServidor } from '@/lib/supabase/server';
import { obtenerPerfilActual } from '@/lib/auth-helpers';

const ETIQUETA_ACCION: Record<string, string> = {
  INSERT: 'Creado',
  UPDATE: 'Modificado',
  DELETE: 'Eliminado',
};

const COLOR_ACCION: Record<string, string> = {
  INSERT: 'bg-green-50 text-green-700',
  UPDATE: 'bg-amber-50 text-amber-700',
  DELETE: 'bg-red-50 text-red-700',
};

export default async function PaginaAuditoria({
  searchParams,
}: {
  searchParams: Promise<{ tabla?: string; accion?: string }>;
}) {
  const { tabla, accion } = await searchParams;

  const perfil = await obtenerPerfilActual();
  if (perfil?.rol !== 'super_admin') {
    redirect('/');
  }

  const supabase = await crearClienteServidor();

  // Opciones de filtro: se derivan de los últimos registros existentes.
  const { data: filtrosDisponibles } = await supabase
    .from('audit_logs')
    .select('tabla_afectada, accion')
    .order('created_at', { ascending: false })
    .limit(1000);

  const tablasDisponibles = [
    ...new Set((filtrosDisponibles ?? []).map((f) => f.tabla_afectada)),
  ].sort();
  const accionesDisponibles = [
    ...new Set((filtrosDisponibles ?? []).map((f) => f.accion)),
  ].sort();

  let consulta = supabase
    .from('audit_logs')
    .select('id, usuario_id, accion, tabla_afectada, registro_id, datos_anteriores, datos_nuevos, created_at')
    .order('created_at', { ascending: false })
    .limit(200);

  if (tabla) consulta = consulta.eq('tabla_afectada', tabla);
  if (accion) consulta = consulta.eq('accion', accion);

  const { data: registros, error } = await consulta;

  const usuarioIds = [
    ...new Set((registros ?? []).map((r) => r.usuario_id).filter((v): v is string => !!v)),
  ];
  const { data: perfiles } = usuarioIds.length
    ? await supabase.from('perfiles').select('id, nombre_completo').in('id', usuarioIds)
    : { data: [] };
  const nombrePorUsuario = new Map((perfiles ?? []).map((p) => [p.id, p.nombre_completo]));

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <Link href="/" className="text-sm text-torat-moshe-gray hover:underline">
          ← Volver al dashboard
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-torat-moshe-navy">Auditoría</h1>
        <p className="mt-1 text-sm text-torat-moshe-gray">
          Registro de altas, cambios y borrados en el sistema. Últimos 200 movimientos.
        </p>
      </div>

      <form className="mb-4 flex flex-wrap gap-3" action="/auditoria">
        <select
          name="tabla"
          defaultValue={tabla ?? ''}
          className="rounded border border-torat-moshe-gray/40 p-2 text-sm"
        >
          <option value="">Todas las tablas</option>
          {tablasDisponibles.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          name="accion"
          defaultValue={accion ?? ''}
          className="rounded border border-torat-moshe-gray/40 p-2 text-sm"
        >
          <option value="">Todas las acciones</option>
          {accionesDisponibles.map((a) => (
            <option key={a} value={a}>
              {ETIQUETA_ACCION[a] ?? a}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded bg-torat-moshe-navy px-4 py-2 text-sm font-medium text-white hover:bg-torat-moshe-navy-dark"
        >
          Filtrar
        </button>
        {(tabla || accion) && (
          <Link
            href="/auditoria"
            className="rounded border border-torat-moshe-gray/40 px-4 py-2 text-sm text-torat-moshe-gray hover:bg-torat-moshe-gray/10"
          >
            Limpiar
          </Link>
        )}
      </form>

      {error && (
        <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">
          Error al cargar la auditoría: {error.message}
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border border-torat-moshe-gray/30">
        <table className="min-w-full divide-y divide-torat-moshe-gray/20 text-sm">
          <thead className="bg-torat-moshe-navy/5">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-torat-moshe-navy">Fecha</th>
              <th className="px-4 py-2 text-left font-medium text-torat-moshe-navy">Usuario</th>
              <th className="px-4 py-2 text-left font-medium text-torat-moshe-navy">Acción</th>
              <th className="px-4 py-2 text-left font-medium text-torat-moshe-navy">Tabla</th>
              <th className="px-4 py-2 text-left font-medium text-torat-moshe-navy">Detalle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-torat-moshe-gray/10">
            {registros?.map((r) => (
              <tr key={r.id}>
                <td className="whitespace-nowrap px-4 py-2 text-torat-moshe-gray">
                  {new Date(r.created_at).toLocaleString('es-ES')}
                </td>
                <td className="px-4 py-2">
                  {r.usuario_id ? nombrePorUsuario.get(r.usuario_id) ?? r.usuario_id : '—'}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      COLOR_ACCION[r.accion] ?? 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {ETIQUETA_ACCION[r.accion] ?? r.accion}
                  </span>
                </td>
                <td className="px-4 py-2 text-torat-moshe-gray">{r.tabla_afectada}</td>
                <td className="px-4 py-2">
                  {r.datos_anteriores || r.datos_nuevos ? (
                    <details>
                      <summary className="cursor-pointer text-torat-moshe-navy hover:underline">
                        Ver cambios
                      </summary>
                      <div className="mt-2 space-y-2 text-xs">
                        {r.datos_anteriores && (
                          <div>
                            <p className="font-medium text-torat-moshe-gray">Antes:</p>
                            <pre className="overflow-x-auto rounded bg-gray-50 p-2">
                              {JSON.stringify(r.datos_anteriores, null, 2)}
                            </pre>
                          </div>
                        )}
                        {r.datos_nuevos && (
                          <div>
                            <p className="font-medium text-torat-moshe-gray">Después:</p>
                            <pre className="overflow-x-auto rounded bg-gray-50 p-2">
                              {JSON.stringify(r.datos_nuevos, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </details>
                  ) : (
                    <span className="text-torat-moshe-gray">—</span>
                  )}
                </td>
              </tr>
            ))}

            {registros?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-torat-moshe-gray">
                  No hay movimientos registrados{tabla || accion ? ' con estos filtros' : ''}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
