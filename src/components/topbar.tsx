import Image from 'next/image';
import { cerrarSesion } from '@/lib/auth-actions';
import { IconSalir } from './icons';

const ETIQUETA_ROL: Record<string, string> = {
  super_admin: 'Super administrador',
  gestor: 'Gestor',
  parnas: 'Parnas',
};

export function Topbar({
  nombre,
  rol,
}: {
  nombre: string;
  rol: string | null;
}) {
  const iniciales = nombre
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="flex items-center justify-between border-b border-torat-moshe-gray/20 bg-white px-6 py-3">
      <div className="flex items-center gap-2 md:hidden">
        <Image src="/logo.png" alt="Torat Moshe" width={28} height={28} className="rounded" />
        <span className="text-sm text-torat-moshe-gray">Torat Moshe</span>
      </div>
      <div className="hidden text-sm text-torat-moshe-gray md:block" />

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{nombre}</p>
          {rol && <p className="text-xs text-torat-moshe-gray">{ETIQUETA_ROL[rol] ?? rol}</p>}
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-torat-moshe-navy text-xs font-semibold text-white">
          {iniciales || '?'}
        </div>
        <form action={cerrarSesion}>
          <button
            type="submit"
            title="Cerrar sesión"
            className="flex h-9 w-9 items-center justify-center rounded-full text-torat-moshe-gray hover:bg-torat-moshe-gray/10 hover:text-torat-moshe-navy"
          >
            <IconSalir className="h-4 w-4" />
          </button>
        </form>
      </div>
    </header>
  );
}
