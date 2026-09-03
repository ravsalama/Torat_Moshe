import Link from 'next/link';
import type { DiaCalendario } from '@/lib/hebcal';

const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MESES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

function mesAnterior(anio: number, mes: number) {
  return mes === 1 ? { anio: anio - 1, mes: 12 } : { anio, mes: mes - 1 };
}

function mesSiguiente(anio: number, mes: number) {
  return mes === 12 ? { anio: anio + 1, mes: 1 } : { anio, mes: mes + 1 };
}

export function CalendarioMes({
  anio,
  mes,
  dias,
}: {
  anio: number;
  mes: number;
  dias: DiaCalendario[];
}) {
  const hoy = new Date();
  const esMesActual = hoy.getFullYear() === anio && hoy.getMonth() + 1 === mes;

  // Offset para que la semana empiece en lunes (getDay(): 0=domingo).
  const offset = (dias[0].fecha.getDay() + 6) % 7;
  const celdas: (DiaCalendario | null)[] = [
    ...Array(offset).fill(null),
    ...dias,
  ];

  const anterior = mesAnterior(anio, mes);
  const siguiente = mesSiguiente(anio, mes);

  return (
    <div className="rounded-lg border border-torat-moshe-gray/20 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-torat-moshe-navy">
          {MESES[mes - 1]} {anio}
        </h2>
        <div className="flex gap-1 text-sm">
          <Link
            href={`/?mes=${anterior.anio}-${String(anterior.mes).padStart(2, '0')}`}
            className="rounded px-2 py-1 text-torat-moshe-gray hover:bg-torat-moshe-gray/10"
          >
            ←
          </Link>
          <Link
            href="/"
            className="rounded px-2 py-1 text-torat-moshe-gray hover:bg-torat-moshe-gray/10"
          >
            Hoy
          </Link>
          <Link
            href={`/?mes=${siguiente.anio}-${String(siguiente.mes).padStart(2, '0')}`}
            className="rounded px-2 py-1 text-torat-moshe-gray hover:bg-torat-moshe-gray/10"
          >
            →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-torat-moshe-gray">
        {DIAS_SEMANA.map((d) => (
          <div key={d} className="pb-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {celdas.map((dia, i) => {
          if (!dia) return <div key={`vacio-${i}`} />;
          const esHoy = esMesActual && dia.diaGregoriano === hoy.getDate();
          return (
            <div
              key={dia.diaGregoriano}
              className={`min-h-[64px] rounded-md border p-1.5 text-left ${
                dia.esShabat
                  ? 'border-torat-moshe-navy/20 bg-torat-moshe-navy/5'
                  : 'border-transparent'
              } ${esHoy ? 'ring-2 ring-torat-moshe-navy' : ''}`}
            >
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-gray-900">{dia.diaGregoriano}</span>
                <span className="text-[10px] text-torat-moshe-gray">
                  {dia.diaHebreo} {dia.mesHebreo.slice(0, 3)}
                </span>
              </div>
              {dia.parasha && (
                <p className="mt-1 text-[10px] leading-tight text-torat-moshe-navy">
                  {dia.parasha}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
