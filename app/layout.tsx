import type { Metadata } from 'next';
import { headers } from 'next/headers';
import './globals.css';
import { crearClienteServidor } from '@/lib/supabase/server';
import { AppShell } from '@/components/app-shell';

export const metadata: Metadata = {
  title: 'Sinagoga Torat Moshe',
  description: 'Gestión de donativos, congregantes y calendario de Sinagoga Torat Moshe',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') ?? '/';
  const esLogin = pathname.startsWith('/login');

  if (esLogin) {
    return (
      <html lang="es">
        <body>{children}</body>
      </html>
    );
  }

  const supabase = await crearClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // El middleware ya redirige a /login en este caso; esto es solo
    // una salvaguarda para no romper el render mientras eso ocurre.
    return (
      <html lang="es">
        <body>{children}</body>
      </html>
    );
  }

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('nombre_completo, rol')
    .eq('id', user.id)
    .single();

  return (
    <html lang="es">
      <body>
        <AppShell
          rol={perfil?.rol ?? null}
          nombre={perfil?.nombre_completo ?? user.email ?? 'Usuario'}
          pathname={pathname}
        >
          {children}
        </AppShell>
      </body>
    </html>
  );
}
