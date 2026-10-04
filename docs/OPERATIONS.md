# Operación, despliegue y recuperación

## Despliegue del frontend

El archivo `vercel.json` compila el proyecto desde `frontend/`, conserva la navegación SPA y agrega cabeceras de seguridad. En Vercel:

1. Importa `ManuelElias1999/RideClub` y deja el directorio raíz del proyecto en la raíz del repositorio.
2. Agrega `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` para Production y Preview.
3. Despliega y copia la URL HTTPS asignada.
4. En Supabase abre **Authentication → URL Configuration**: usa esa URL como `Site URL` y agrega la misma URL y `https://tu-dominio/**` a Redirect URLs.
5. Prueba el enlace de acceso desde una ventana privada y confirma que regresa al sitio público, no a localhost.

Las claves `SUPABASE_SERVICE_ROLE_KEY`, `BOOTSTRAP_SECRET` e `INTEGRATION_API_KEY` nunca se configuran en Vercel ni con prefijo `VITE_`; pertenecen exclusivamente a Supabase Edge Functions.

## Lista de comprobación de producción

- `npx supabase db push` aplicado sin errores.
- `manage-user` e `integration-api` desplegadas; `bootstrap-admin` retirada o con secreto rotado después del alta inicial.
- Ingreso, cierre de sesión, bloqueo y baja probados con usuarios diferentes.
- RLS y pruebas de base ejecutadas con `npx supabase test db`.
- Navegación directa a `/`, `/#marketplace`, `/#rewards` y `/#club` verificada.
- API externa rechaza una clave incorrecta y no duplica una factura repetida.
- Ninguna service role, clave privada o secreto aparece en el navegador o repositorio.

## Respaldos y recuperación

El despliegue usa los respaldos administrados que muestre el proyecto en **Supabase Dashboard → Database → Backups**. La frecuencia y retención dependen del plan contratado; no debe marcarse este punto como operativo hasta ver un respaldo disponible en ese panel.

Una vez al mes, y antes de cambios importantes:

1. Confirma la fecha del último respaldo exitoso.
2. Exporta adicionalmente el esquema con `npx supabase db dump --linked --file backup-schema.sql` en un equipo seguro; no lo subas al repositorio si contiene datos.
3. Realiza la recuperación en un proyecto Supabase separado, nunca sobre producción durante una prueba.
4. Verifica conteos de empresas, perfiles, compras, movimientos y cupones, además de una sesión de cada rol.
5. Registra fecha, responsable, resultado y tiempo de recuperación.

Objetivos sugeridos para la presentación: pérdida máxima de 24 horas de datos (RPO) y recuperación en menos de 4 horas (RTO). Son objetivos operativos, no garantías, hasta completar un simulacro real.

## Monitoreo e incidentes

- Revisa errores de Edge Functions y PostgreSQL en los logs de Supabase.
- Usa `integration_logs.request_id` para correlacionar llamadas externas sin guardar el cuerpo o datos personales.
- Ante una clave expuesta, rótala con `npx supabase secrets set`, actualiza el sistema autorizado y revisa la bitácora.
- Ante un incidente, suspende la empresa afectada si hace falta, preserva auditoría y evita borrar compras o movimientos históricos.

## Mantenimiento

Las carpetas separan frontend, base, funciones, contratos y documentación. Cada cambio de esquema se añade como una migración nueva; no se modifica una migración ya aplicada en producción. Antes de publicar: pruebas, build, revisión del diff, commit y despliegue controlado.
