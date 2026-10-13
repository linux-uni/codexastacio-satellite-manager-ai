# CodeXaStacio Satellite Manager AI

MVP PRO inicial de U.N.O. para gestión de receptores satelitales. Interfaz responsive, login, catálogo de clientes, inventario, enlace WhatsApp, edición auditada e importación original del PDF.

## Puesta en marcha

1. `npm install`
2. Copiar `.env.example` a `.env.local` y completar `DATABASE_URL` (Neon, **pooled**), `SESSION_SECRET` (mínimo 32 caracteres), `ADMIN_EMAIL` y `ADMIN_PASSWORD` (mínimo 12 caracteres). Nunca subir estos secretos a GitHub.
3. Cargar las variables en la terminal para los scripts (por ejemplo, `set -a; source .env.local; set +a` en bash/zsh si los valores están entrecomillados correctamente).
4. `npm run db:setup`
5. `npm run db:import` (idempotente; registra 61 filas, 60 receptores únicos, 1 duplicado).
6. `npm run admin:create`
7. `npm run dev` y visitar `http://localhost:3000`.

## Publicación

Subir el proyecto a un repositorio GitHub **privado**. Importar el repositorio en Vercel, configurar `DATABASE_URL` y `SESSION_SECRET` en Environment Variables, ejecutar el esquema/importación/alta de administrador desde un entorno seguro, y desplegar. `ADMIN_PASSWORD` solo es necesario para el script de alta, no en Vercel.

## Arquitectura

- Next.js App Router + TypeScript; rutas API protegidas con cookie de sesión firmada HMAC y httpOnly.
- PostgreSQL de Neon; tablas para usuarios, cadenas, clientes, departamentos, contactos, receptores, movimientos, facturas e incidencias.
- Solo el Super Admin se crea mediante script; no hay registro público.
- Inventario: un número de serie por equipo. `STOCK` se interpreta como disponible; los demás como instalados **según la clasificación documental**, pendiente de verificación física.
- La cadena hotelera no se infiere automáticamente. Ubicación y contacto faltantes permanecen sin completar.
- WhatsApp: enlaces `wa.me` para apertura manual, no envíos masivos automáticos.

## Alcance y próximos pasos

Este primer MVP **no** implementa todavía generación de facturas, cobros, envíos WhatsApp API, IA ni órdenes técnicas. El esquema deja preparadas las tablas de facturas. Antes de producción: protección contra fuerza bruta/rate limit en login, MFA, recuperación segura de contraseña, gestión granular de usuarios, backups, pruebas automatizadas, consentimiento para mensajes comerciales, validación fiscal de facturas y monitoreo.

El archivo `data/import-original.json` conserva los 61 registros transcritos de la tabla PDF, incluidos teléfonos. Es información comercial sensible: mantener repositorio privado y controlar acceso.
