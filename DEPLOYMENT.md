# Checklist de despliegue

## Frontend en Vercel

El frontend de producción debe llamar al backend usando la ruta same-origin `/api`. No configures `VITE_API_BASE_URL` ni `VITE_API_URL` en el entorno de producción de Vercel apuntando a Railway, porque eso hace que el navegador llame a Railway directamente y puede disparar errores de preflight CORS.

Vercel debe usar uno de los `vercel.json` versionados, según el directorio raíz elegido en el proyecto de Vercel:

- Si el root del proyecto en Vercel es la raíz del repositorio, usa `/vercel.json`.
- Si el root del proyecto en Vercel es `front`, usa `/front/vercel.json`.

Ambas configuraciones deben mantener el rewrite de `/api/:path*` antes del fallback de la SPA.

## Backend en Railway

El dominio de Railway usado por Vercel debe apuntar al servicio Express del backend, no a un fallback ni a otro servicio. Prueba estas URLs después de cada despliegue del backend:

- `https://artistbook-production.up.railway.app/api/health`
- `https://artistbook-production.up.railway.app/api/users/profile`
- `https://artistbook-production.up.railway.app/api/entries`

Una petición a profile o entries sin token de Firebase puede devolver `401`, pero debe venir desde Express e incluir headers normales de CORS. Si Railway devuelve `x-railway-fallback: true`, la petición no llegó al servicio Express y hay que corregir el dominio o el mapeo del servicio en Railway.

Configura `CORS_ORIGIN` en Railway con el origen del frontend desplegado:

```txt
https://artist-book.vercel.app
```

Si usas previews de Vercel, el backend ya permite previews `https://*.vercel.app` en producción.

## Firebase

Firebase Auth no define las rutas de Express. Solo revisa que el dominio del frontend esté permitido para login y redirects:

- `artist-book.vercel.app`
- cualquier host local de desarrollo que uses, por ejemplo `localhost`
