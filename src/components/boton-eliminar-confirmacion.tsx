'use client';

export function BotonEliminarConfirmacion({
  mensaje,
  titulo = 'Eliminar',
}: {
  mensaje: string;
  titulo?: string;
}) {
  return (
    <button
      type="submit"
      title={titulo}
      onClick={(e) => {
        if (!confirm(mensaje)) {
          e.preventDefault();
        }
      }}
      className="flex h-8 w-8 items-center justify-center rounded text-red-600 hover:bg-red-50"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4">
        <path
          d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M10 11v6M14 11v6" strokeLinecap="round" />
      </svg>
    </button>
  );
}
