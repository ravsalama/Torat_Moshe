import Link from 'next/link';
import { redirect } from 'next/navigation';
import { crearClienteServidor } from '@/lib/supabase/server';
import {
  fechaGregorianaADiaYMesHebreo,
  proximaFechaNajalot,
  parashaDeLaSemana,
  calendarioDelMes,
} from '@/lib/hebcal';
import { IconPersonas, IconMonedas, IconReloj, IconUsuarios, IconVela, IconTarta } from '@/components/icons';
import { CalendarioMes } from '@/components/calendario-mes';

function formatoEuros(n: number) {
  return `${n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
}

function formatoFecha(fecha: Date) {
  return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
}

function enDias(fecha: Date) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const objetivo = new Date(fecha);
  objetivo.setHours(0, 0, 0, 0);
  const dias = Math.round((objetivo.getTime() - hoy.getTime()) / 86_400_000);
  if (dias === 0) return 'hoy';
  if (dias === 1) return 'mañana';
  return `en ${dias} días`;
}

function StatCard({
  icono,
  etiqueta,
  valor,
  colorIcono,
}: {
  icono: React.ReactNode;
  etiqueta: string;
  valor: string;
  colorIcono: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-torat-moshe-gray/20 bg-white p-5">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${colorIcono}`}>
        {icono}
      </div>
      <div>
        <p className="text-2xl font-semibold text-gray-900">{valor}</p>
        <p className="text-sm text-torat-moshe-gray">{etiqueta}</p>
      </div>
    </div>
  );
}

export default async function PaginaInicio({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string }>;
}) {
  const { mes: mesParam } = await searchParams;

  const supabase = await crearClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('nombre_completo, rol')
    .eq('id', user.id)
    .single();

  const esStaff = perfil?.rol === 'super_admin' || perfil?.rol === 'gestor';
  const esSuperAdmin = perfil?.rol === 'super_admin';
  const parasha = parashaDeLaSemana();

  const hoy = new Date();
  let anioCalendario = hoy.getFullYear();
  let mesCalendario = hoy.getMonth() + 1;
  if (mesParam && /^\d{4}-\d{2}$/.test(mesParam)) {
    const [a, m] = mesParam.split('-').map(Number);
    anioCalendario = a;
    mesCalendario = m;
  }
  const diasDelMes = calendarioDelMes(anioCalendario, mesCalendario);

  // --- Datos solo para staff (RLS impide a "parnas" leer estas tablas) ---
  let totalCongregantes = 0;
  let totalRecaudadoMes = 0;
  let totalPendiente = 0;
  let totalUsuariosActivos: number | null = null;
  let proximosNajalot: { etiqueta: string; fecha: Date }[] = [];
  let proximosCumpleanos: { etiqueta: string; fecha: Date }[] = [];

  if (esStaff) {
    const primerDiaMes = new Date();
    primerDiaMes.setDate(1);
    const primerDiaMesStr = primerDiaMes.toISOString().slice(0, 10);
    const primerDiaMesSiguiente = new Date(primerDiaMes);
    primerDiaMesSiguiente.setMonth(primerDiaMesSiguiente.getMonth() + 1);
    const primerDiaMesSiguienteStr = primerDiaMesSiguiente.toISOString().slice(0, 10);

    const enUnMes = new Date();
    enUnMes.setMonth(enUnMes.getMonth() + 1);
    const enQuinceDias = new Date();
    enQuinceDias.setDate(enQuinceDias.getDate() + 15);

    const [
      { count: countPersonas },
      { data: donacionesMes },
      { data: donacionesPendientes },
      { data: najalotRows },
      { data: personasCumple },
    ] = await Promise.all([
      supabase.from('personas').select('id', { count: 'exact', head: true }).eq('activo', true),
      supabase
        .from('donaciones')
        .select('monto')
        .eq('estado', 'pagado')
        .gte('fecha', primerDiaMesStr)
        .lt('fecha', primerDiaMesSiguienteStr),
      supabase.from('donaciones').select('monto').eq('estado', 'pendiente'),
      supabase.from('najalot').select('nombre_familiar, relacion_familiar, dia_hebreo, mes_hebreo'),
      supabase
        .from('personas')
        .select('nombre, apellidos, fecha_nacimiento')
        .eq('activo', true)
        .not('fecha_nacimiento', 'is', null),
    ]);

    totalCongregantes = countPersonas ?? 0;
    totalRecaudadoMes = (donacionesMes ?? []).reduce((s, d) => s + Number(d.monto), 0);
    totalPendiente = (donacionesPendientes ?? []).reduce((s, d) => s + Number(d.monto), 0);

    // Próximos Najalot: solo dentro del próximo mes.
    proximosNajalot = (najalotRows ?? [])
      .map((n) => ({
        etiqueta: `${n.nombre_familiar} (${n.relacion_familiar})`,
        fecha: proximaFechaNajalot(n.dia_hebreo, n.mes_hebreo),
      }))
      .filter((n) => n.fecha <= enUnMes)
      .sort((a, b) => a.fecha.getTime() - b.fecha.getTime());

    // Próximos cumpleaños: solo dentro de los próximos 15 días.
    proximosCumpleanos = (personasCumple ?? [])
      .filter((p) => p.fecha_nacimiento)
      .map((p) => {
        const { dia, mes } = fechaGregorianaADiaYMesHebreo(new Date(`${p.fecha_nacimiento}T12:00:00`));
        return {
          etiqueta: `${p.nombre} ${p.apellidos}`,
          fecha: proximaFechaNajalot(dia, mes),
        };
      })
      .filter((c) => c.fecha <= enQuinceDias)
      .sort((a, b) => a.fecha.getTime() - b.fecha.getTime());

    if (esSuperAdmin) {
      const { count } = await supabase
        .from('perfiles')
        .select('id', { count: 'exact', head: true })
        .eq('activo', true);
      totalUsuariosActivos = count ?? 0;
    }
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-torat-moshe-navy">
            Shalom, {perfil?.nombre_completo ?? user.email}
          </h1>
          <p className="mt-1 text-sm text-torat-moshe-gray">Parashá de esta semana: {parasha}</p>
        </div>
      </div>

      {esStaff ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/personas">
              <StatCard
                icono={<IconPersonas className="h-5 w-5 text-torat-moshe-navy" />}
                colorIcono="bg-torat-moshe-navy/10"
                etiqueta="Congregantes activos"
                valor={String(totalCongregantes)}
              />
            </Link>
            <Link href="/donaciones?estado=pagado">
              <StatCard
                icono={<IconMonedas className="h-5 w-5 text-green-700" />}
                colorIcono="bg-green-50"
                etiqueta="Recaudado este mes"
                valor={formatoEuros(totalRecaudadoMes)}
              />
            </Link>
            <Link href="/donaciones?estado=pendiente">
              <StatCard
                icono={<IconReloj className="h-5 w-5 text-amber-700" />}
                colorIcono="bg-amber-50"
                etiqueta="Pendiente de cobro"
                valor={formatoEuros(totalPendiente)}
              />
            </Link>
            {esSuperAdmin && (
              <Link href="/usuarios">
                <StatCard
                  icono={<IconUsuarios className="h-5 w-5 text-torat-moshe-navy" />}
                  colorIcono="bg-torat-moshe-navy/10"
                  etiqueta="Usuarios activos"
                  valor={String(totalUsuariosActivos)}
                />
              </Link>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <CalendarioMes anio={anioCalendario} mes={mesCalendario} dias={diasDelMes} />
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-lg border border-torat-moshe-gray/20 bg-white p-5">
                <div className="mb-3 flex items-center gap-2">
                  <IconVela className="h-5 w-5 text-torat-moshe-navy" />
                  <h2 className="text-sm font-semibold text-torat-moshe-navy">
                    Najalot (próximo mes)
                  </h2>
                </div>
                {proximosNajalot.length > 0 ? (
                  <ul className="divide-y divide-torat-moshe-gray/10">
                    {proximosNajalot.map((n, i) => (
                      <li key={i} className="flex items-center justify-between py-2 text-sm">
                        <span className="text-gray-900">{n.etiqueta}</span>
                        <span className="text-right text-xs text-torat-moshe-gray">
                          {formatoFecha(n.fecha)}
                          <br />
                          {enDias(n.fecha)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-torat-moshe-gray">
                    No hay Najalot en el próximo mes.
                  </p>
                )}
              </div>

              <div className="rounded-lg border border-torat-moshe-gray/20 bg-white p-5">
                <div className="mb-3 flex items-center gap-2">
                  <IconTarta className="h-5 w-5 text-torat-moshe-navy" />
                  <h2 className="text-sm font-semibold text-torat-moshe-navy">
                    Cumpleaños (15 días)
                  </h2>
                </div>
                {proximosCumpleanos.length > 0 ? (
                  <ul className="divide-y divide-torat-moshe-gray/10">
                    {proximosCumpleanos.map((c, i) => (
                      <li key={i} className="flex items-center justify-between py-2 text-sm">
                        <span className="text-gray-900">{c.etiqueta}</span>
                        <span className="text-right text-xs text-torat-moshe-gray">
                          {formatoFecha(c.fecha)}
                          <br />
                          {enDias(c.fecha)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-torat-moshe-gray">
                    Ningún cumpleaños en los próximos 15 días.
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <CalendarioMes anio={anioCalendario} mes={mesCalendario} dias={diasDelMes} />
          <div className="rounded-lg border border-torat-moshe-gray/20 bg-white p-6">
            <p className="text-sm text-torat-moshe-gray">
              Tu rol actual es <span className="font-medium">{perfil?.rol ?? 'sin asignar'}</span>.
              La lista de próximos Najalot y cumpleaños para este rol está en camino.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
