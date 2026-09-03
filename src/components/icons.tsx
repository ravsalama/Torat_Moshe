type IconProps = { className?: string };

const base = 'h-5 w-5';

export function IconDashboard({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className}>
      <path d="M4 13h6V4H4v9Zm10 7h6V4h-6v16ZM4 20h6v-4H4v4Z" strokeLinejoin="round" />
    </svg>
  );
}

export function IconPersonas({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
      <path d="M16 5.2a3 3 0 0 1 0 5.6M20 20c0-2.8-1.9-5.1-4.5-5.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconDonaciones({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className}>
      <path d="M12 21s-7-4.35-9.5-8.8C.8 8.7 2.4 5 6 5c2 0 3.4 1.1 4 2 .6-.9 2-2 4-2 3.6 0 5.2 3.7 3.5 7.2C19 16.65 12 21 12 21Z" strokeLinejoin="round" />
    </svg>
  );
}

export function IconCobros({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className}>
      <circle cx="8" cy="8" r="5" />
      <circle cx="15" cy="15" r="5" />
      <path d="M8 8h.01M15 15h.01" strokeLinecap="round" />
    </svg>
  );
}

export function IconInstituciones({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className}>
      <path d="M4 21V9l8-5 8 5v12" strokeLinejoin="round" />
      <path d="M9 21v-6h6v6M4 21h16" strokeLinecap="round" />
    </svg>
  );
}

export function IconUsuarios({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className}>
      <path d="M12 3 5 6v5c0 4.5 3 7.7 7 9 4-1.3 7-4.5 7-9V6l-7-3Z" strokeLinejoin="round" />
      <path d="m9.5 12 1.8 1.8L14.5 10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconSalir({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconCalendario({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  );
}

export function IconVela({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className}>
      <path d="M12 3c1.5 2 1.5 3-.2 4.5C10 9 10 10.3 12 11.5c2-1.2 2-2.5.2-4a5 5 0 0 1-.2-4.5Z" strokeLinejoin="round" />
      <path d="M9 11h6v8a3 3 0 0 1-3 3 3 3 0 0 1-3-3v-8Z" strokeLinejoin="round" />
    </svg>
  );
}

export function IconTarta({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className}>
      <path d="M4 21v-7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 21h16M8 12V8M12 12V8M16 12V8" strokeLinecap="round" />
      <path d="M8 5c0-1 .5-1.5.5-2S8 2 8 2M12 5c0-1 .5-1.5.5-2S12 2 12 2M16 5c0-1 .5-1.5.5-2S16 2 16 2" strokeLinecap="round" />
    </svg>
  );
}

export function IconMonedas({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className}>
      <ellipse cx="9" cy="7" rx="6" ry="3" />
      <path d="M3 7v10c0 1.7 2.7 3 6 3s6-1.3 6-3V7" strokeLinecap="round" />
      <path d="M15 10.3c2.9.4 5 1.6 5 3s-2.1 2.6-5 3M15 14.3c2.9.4 5 1.6 5 3" strokeLinecap="round" />
    </svg>
  );
}

export function IconReloj({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconVer({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function IconEditar({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className}>
      <path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5.5 16.5 4 20Z" strokeLinejoin="round" />
      <path d="m14.5 6.5 3 3" strokeLinecap="round" />
    </svg>
  );
}

export function IconEliminar({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className}>
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 11v6M14 11v6" strokeLinecap="round" />
    </svg>
  );
}
