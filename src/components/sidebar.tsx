import Link from 'next/link';
import Image from 'next/image';
import type { RolUsuario } from '@/types/database.types';
import {
  IconDashboard,
  IconPersonas,
  IconDonaciones,
  IconInstituciones,
  IconUsuarios,
  IconReloj,
} from './icons';

type Enlace = {
  href: string;
  etiqueta: string;
  icono: (props: { className?: string }) => JSX.Element;
};

export function Sidebar({ rol, pathname }: { rol: RolUsuario | null; pathname: string }) {
  const esStaff = rol === 'super_admin' || rol === 'gestor';
  const esSuperAdmin = rol === 'super_admin';

  const enlaces: Enlace[] = [{ href: '/', etiqueta: 'Panel', icono: IconDashboard }];

  if (esStaff) {
    enlaces.push(
      { href: '/personas', etiqueta: 'Congregantes', icono: IconPersonas },
      { href: '/donaciones', etiqueta: 'Donaciones', icono: IconDonaciones },
      { href: '/instituciones', etiqueta: 'Instituciones', icono: IconInstituciones }
    );
  }

  if (esSuperAdmin) {
    enlaces.push(
      { href: '/usuarios', etiqueta: 'Usuarios', icono: IconUsuarios },
      { href: '/auditoria', etiqueta: 'Auditoría', icono: IconReloj }
    );
  }

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-torat-moshe-gray/20 bg-[#122744] md:flex">
      <div className="flex items-center gap-3 px-6 py-6">
        <Image
          src="/logo.png"
          alt="Torat Moshe"
          width={44}
          height={44}
          className="rounded-md"
        />
        <span className="text-xs font-normal text-white/50">Sistema de gestión</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {enlaces.map((enlace) => {
          const activo =
            enlace.href === '/' ? pathname === '/' : pathname.startsWith(enlace.href);
          const Icono = enlace.icono;
          return (
            <Link
              key={enlace.href}
              href={enlace.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                activo
                  ? 'bg-white/10 font-medium text-white'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icono className="h-5 w-5 shrink-0" />
              {enlace.etiqueta}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4 text-xs text-white/30">Torat Moshe · Madrid</div>
    </aside>
  );
}
