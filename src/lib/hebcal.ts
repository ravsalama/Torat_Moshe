import { HDate, HebrewCalendar, Sedra, gematriya, months } from '@hebcal/core';

/**
 * Configuración de diáspora/Israel para todos los cálculos de @hebcal/core.
 * Sinagoga Rambam está en Madrid -> false (diáspora).
 * Debe coincidir con configuracion.hebcal_israel en la base de datos.
 */
export const IL = process.env.NEXT_PUBLIC_HEBCAL_ISRAEL === 'true';

/**
 * Convierte una fecha gregoriana a su equivalente hebreo, devuelto como
 * texto legible en español (p.ej. "15 de Nisán"). Se usa al crear/editar
 * una persona, para rellenar personas.fecha_nacimiento_hebrea.
 */
export function fechaGregorianaAHebrea(fecha: Date): string {
  const hdate = new HDate(fecha);
  return `${hdate.getDate()} de ${nombreMesEnEspanol(hdate)}`;
}

/**
 * Devuelve día y mes hebreo (sin año) a partir de una fecha gregoriana.
 * Útil para inicializar najalot_dia_hebreo / najalot_mes_hebreo cuando
 * el usuario solo tiene la fecha gregoriana del fallecimiento.
 */
export function fechaGregorianaADiaYMesHebreo(fecha: Date): {
  dia: number;
  mes: string;
} {
  const hdate = new HDate(fecha);
  return { dia: hdate.getDate(), mes: nombreMesEnEspanol(hdate) };
}

/**
 * Nombre del mes hebreo en español. Contempla Adar I / Adar II en años
 * embolísmicos (13 meses), relevante para el Najalot.
 */
function nombreMesEnEspanol(hdate: HDate): string {
  const nombresEs: Record<number, string> = {
    [months.NISAN]: 'Nisán',
    [months.IYYAR]: 'Iyar',
    [months.SIVAN]: 'Siván',
    [months.TAMUZ]: 'Tamuz',
    [months.AV]: 'Av',
    [months.ELUL]: 'Elul',
    [months.TISHREI]: 'Tishrei',
    [months.CHESHVAN]: 'Jeshván',
    [months.KISLEV]: 'Kislev',
    [months.TEVET]: 'Tevet',
    [months.SHVAT]: 'Shevat',
    [months.ADAR_I]: 'Adar I',
    [months.ADAR_II]: 'Adar II',
  };
  return nombresEs[hdate.getMonth()] ?? hdate.getMonthName();
}

/**
 * Calcula la próxima fecha gregoriana en la que caerá un Najalot dado
 * (día + mes hebreo, sin año), a partir de "hoy". Si ya pasó este año
 * hebreo, calcula la del año siguiente. Maneja automáticamente el caso
 * de Adar en años no embolísmicos (@hebcal/core resuelve Adar I/II).
 */
export function proximaFechaNajalot(diaHebreo: number, mesHebreoEs: string): Date {
  const hoy = new HDate();
  const anioActual = hoy.getFullYear();

  const nombreHebcal = mesEsANombreHebcal(mesHebreoEs);

  const intentar = (anio: number) => {
    try {
      return new HDate(diaHebreo, nombreHebcal, anio);
    } catch {
      return null;
    }
  };

  let candidata = intentar(anioActual);
  if (!candidata || candidata.abs() < hoy.abs()) {
    candidata = intentar(anioActual + 1);
  }

  return candidata ? candidata.greg() : new Date();
}

function mesEsANombreHebcal(mesEs: string): number {
  const mapa: Record<string, number> = {
    'Nisán': months.NISAN,
    Iyar: months.IYYAR,
    'Siván': months.SIVAN,
    Tamuz: months.TAMUZ,
    Av: months.AV,
    Elul: months.ELUL,
    Tishrei: months.TISHREI,
    'Jeshván': months.CHESHVAN,
    Kislev: months.KISLEV,
    Tevet: months.TEVET,
    Shevat: months.SHVAT,
    'Adar I': months.ADAR_I,
    'Adar II': months.ADAR_II,
    Adar: months.ADAR_I,
  };
  return mapa[mesEs] ?? months.NISAN;
}

/**
 * Parashá de la semana para una fecha dada (por defecto, hoy).
 * Devuelve el nombre en inglés de @hebcal/core; puedes mapearlo a
 * español con un pequeño diccionario si se quiere mostrar traducido.
 */
export function parashaDeLaSemana(fecha: Date = new Date()): string {
  const hdate = new HDate(fecha);
  const sedra = new Sedra(hdate.getFullYear(), IL);
  return sedra.getString(hdate);
}

/**
 * Devuelve los eventos del calendario hebreo (festividades, Rosh Jodesh,
 * etc.) entre dos fechas gregorianas, respetando la config diáspora/Israel.
 */
export function eventosHebreosEnRango(desde: Date, hasta: Date) {
  return HebrewCalendar.calendar({
    start: desde,
    end: hasta,
    il: IL,
    sedrot: true,
    candlelighting: false,
  });
}

export { gematriya };
