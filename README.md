# Sinagoga Rambam — Sistema de gestión de donativos

Next.js (App Router) + Supabase (Postgres, Auth, RLS, Vault) + `@hebcal/core`.

## Estructura

```
app/
  layout.tsx          Layout raíz
  page.tsx            Dashboard (placeholder, protegido por middleware)
  login/page.tsx       Login con email/password
middleware.ts          Protección de rutas por rol (staff / super_admin)
src/
  lib/
    supabase/
      client.ts        Cliente Supabase para Client Components
      server.ts         Cliente Supabase para Server Components/Actions + cliente admin
      middleware.ts      Helper de refresco de sesión
    hebcal.ts           Conversión de fechas, Parashá, cálculo de Najalot
  types/
    database.types.ts   Tipos TS del esquema (sustituir por `npm run types:generate`)
supabase/
  migrations/           Las 12 migraciones SQL (ver README de esa carpeta)
```

## Puesta en marcha local

```bash
npm install
cp .env.local.example .env.local   # y rellena con tus claves reales de Supabase
npm run dev
```

## Pendiente / próximos pasos

- Construir las páginas reales de `personas`, `donaciones`, `cobros`, `plantillas` (de momento solo existen `/` y `/login`)
- Añadir componentes de calendario dual (gregoriano/hebreo) usando `src/lib/hebcal.ts`
- Configurar Supabase Auth (email/password, o el proveedor que prefieras) en el panel de Supabase
- Una vez tengas la cuenta Gmail, completar la Edge Function de envío de emails y activar el Database Webhook correspondiente
- Verificar la API exacta de `@hebcal/core` contra la versión instalada: `src/lib/hebcal.ts` está escrito según la documentación de la librería, pero no ha podido ejecutarse en este entorno (sin acceso a npm/red). Antes de confiar en él en producción, ejecuta `npm install` y prueba las funciones con casos reales — puede que algún nombre de export difiera ligeramente entre versiones.

## Roles y permisos (resumen)

| Acción | super_admin | gestor | parnas |
|---|---|---|---|
| Ver personas/donaciones | ✅ | ✅ | ❌ |
| Crear personas/donaciones | ✅ | ✅ | ❌ |
| Editar/eliminar donaciones libremente | ✅ | ❌ (solo marcar pagada/cancelar vía función) | ❌ |
| Editar plantillas de email | ✅ | ✅ | ❌ |
| Configuración SMTP | ✅ | ❌ | ❌ |
| Audit logs | ✅ | ❌ | ❌ |
| Dashboard (calendario, cumpleaños, Najalot) | ✅ | ✅ | ✅ (solo esto) |

Ver `middleware.ts` para la protección de rutas y las migraciones `003`, `006`, `010` para el detalle de las políticas RLS y funciones.
