import { crearClienteServidor } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

async function iniciarSesion(formData: FormData) {
  'use server';

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = await crearClienteServidor();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect('/');
}

export default async function PaginaLogin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <form
        action={iniciarSesion}
        className="w-full max-w-sm space-y-4 rounded-lg border border-torat-moshe-gray/30 p-8"
      >
        <h1 className="text-xl font-semibold text-torat-moshe-navy">Sinagoga Torat Moshe</h1>

        {error && (
          <p className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>
        )}

        <div>
          <label htmlFor="email" className="block text-sm text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm text-gray-700">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded bg-torat-moshe-navy p-2 text-white hover:bg-torat-moshe-navy-dark"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}
