import Link from 'next/link';
import type { RolUsuario } from '@/types/database.types';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import {
  IconDashboard,
  IconPersonas,
  IconDonaciones,
  IconCobros,
  IconInstituciones,
  IconUsuarios,
} from './icons';

function construirEnlaces(rol: RolUsuario | null) {
  const esStaff = rol === 'super_admin' || rol === 'gestor';
  const esSuperAdmin = rol === 'super_admin';

  const enlaces = [{ href: '/', etiqueta: 'Panel', icono: IconDashboard }];

  if (esStaff) {
    enlaces.push(
      { href: '/personas', etiqueta: 'Congregantes', icono: IconPersonas },
      { href: '/donaciones', etiqueta: 'Donaciones', icono: IconDonaciones },
      { href: '/cobros', etiqueta: 'Cobros', icono: IconCobros },
      { href: '/instituciones', etiqueta: 'Instituciones', icono: IconInstituciones }
    );
  }

  if (esSuperAdmin) {
    enlaces.push({ href: '/usuarios', etiqueta: 'Usuarios', icono: IconUsuarios });
  }

  return enlaces;
}

export function AppShell({
  rol,
  nombre,
  pathname,
  children,
}: {
  rol: RolUsuario | null;
  nombre: string;
  pathname: string;
  children: React.ReactNode;
}) {
  const enlaces = construirEnlaces(rol);

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar rol={rol} pathname={pathname} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar nombre={nombre} rol={rol} />

        {/* Navegación móvil: la barra lateral solo aparece en pantallas md+ */}
        <nav className="flex gap-1 overflow-x-auto border-b border-torat-moshe-gray/20 bg-white px-3 py-2 md:hidden">
          {enlaces.map((enlace) => {
            const activo =
              enlace.href === '/' ? pathname === '/' : pathname.startsWith(enlace.href);
            return (
              <Link
                key={enlace.href}
                href={enlace.href}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
                  activo
                    ? 'bg-torat-moshe-navy text-white'
                    : 'bg-torat-moshe-gray/10 text-torat-moshe-gray'
                }`}
              >
                {enlace.etiqueta}
              </Link>
            );
          })}
        </nav>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
