import Link from 'next/link';
import { crearUsuario } from '../actions';

export default async function PaginaNuevoUsuario({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen bg-white p-8">
      <Link href="/usuarios" className="text-sm text-torat-moshe-gray hover:underline">
        ← Volver a usuarios
      </Link>
      <h1 className="mt-1 mb-6 text-2xl font-semibold text-torat-moshe-navy">Nuevo usuario</h1>

      {error && (
        <p className="mb-4 max-w-lg rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <form action={crearUsuario} className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm text-gray-700">Nombre completo *</label>
          <input
            name="nombre_completo"
            required
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Email *</label>
          <input
            type="email"
            name="email"
            required
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Contraseña inicial *</label>
          <input
            type="password"
            name="password"
            required
            minLength={8}
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          />
          <p className="mt-1 text-xs text-torat-moshe-gray">
            Mínimo 8 caracteres. Compártesela tú mismo con la persona; podrá cambiarla luego.
          </p>
        </div>

        <div>
          <label className="block text-sm text-gray-700">Rol *</label>
          <select
            name="rol"
            required
            defaultValue="parnas"
            className="mt-1 w-full rounded border border-torat-moshe-gray/40 p-2 text-sm"
          >
            <option value="super_admin">Super administrador</option>
            <option value="gestor">Gestor</option>
            <option value="parnas">Parnas</option>
          </select>
        </div>

        <button
          type="submit"
          className="rounded bg-torat-moshe-navy px-4 py-2 text-sm font-medium text-white hover:bg-torat-moshe-navy-dark"
        >
          Crear usuario
        </button>
      </form>
    </main>
  );
}
