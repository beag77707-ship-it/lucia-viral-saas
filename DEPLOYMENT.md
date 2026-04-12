# Guía de Despliegue - SaaS de Contenido Viral

Esta guía describe cómo desplegar la plataforma completa (Frontend, Backend, Base de datos y n8n).

## 1. Base de Datos (Supabase / Neon)
1. Crea una cuenta en Supabase.com y crea un nuevo proyecto.
2. Ve a la configuración de la Base de Datos y copia la "Connection String (URI)".
3. Pega esa cadena en la variable `DATABASE_URL` de tu `.env`.

> [!NOTE]
> Es posible que debas añadir `?pgbouncer=true` al final de la URL si usas Supabase.

## 2. Inicialización de Prisma
Una vez tengas la URL de la base de datos configurada, en la terminal de tu proyecto ejecuta:
```bash
npx prisma generate
npx prisma db push
```
Esto creará las tablas de `User` y `Project`.

## 3. Despliegue del Frontend/Backend (Vercel)
Como el proyecto usa `Next.js` con el App Router, API Routes y Pages se despliegan fácilmente en Vercel.
1. Sube tu código a GitHub.
2. Inicia sesión en Vercel con GitHub y dale a "Add New Project".
3. Selecciona tu repositorio.
4. En las variables de entorno de Vercel (Environment Variables), asegúrate de añadir:
   - `DATABASE_URL` (Tu string de Supabase)
   - `NEXTAUTH_SECRET` (Genera una string aleatoria larga)
   - `NEXTAUTH_URL` (La URL pública de tu Vercel, ej: `https://tu-proyecto.vercel.app`)
   - `N8N_WEBHOOK_URL` (La URL del Webhook de tu n8n que recibe el trigger)
5. Haz clic en "Deploy".

## 4. Despliegue y Configuración de n8n
1. Importa el archivo `n8n-workflow-apify-openai.json` en tu instancia de n8n.
2. **Webhook Trigger**: Apunta la variable `N8N_WEBHOOK_URL` de Vercel a la URL pública que te da el nodo *Webhook Trigger* en n8n (asegúrate de cambiarlo a *Production URL*, no Test URL).
3. **Apify API Key**: En el nodo "Apify Run Actor", necesitas usar tu token de Apify. Reemplaza `{{$env.APIFY_API_TOKEN}}` o configúralo en los parámetros del nodo.
4. **OpenAI API Key**: En el nodo "OpenAI", necesitas añadir tus credenciales reales (OpenAI node config -> Create New Credential -> Pega tu clave de API).
5. **Next.js Webhook Return**: El último nodo que hace la petición HTTP para devolver el resultado al backend necesita saber tu `NEXT_PUBLIC_APP_URL`. Cámbialo a tu dominio en Vercel, por ejemplo: `https://tu-proyecto.vercel.app/api/webhooks/n8n`.

## 5. ¡Listo!
Verifica creando una cuenta en tu plataforma. El sistema completo está configurado de manera end-to-end con seguridad NextAuth, base de datos PostgreSQL en Prisma, Next.js Frontend y la lógica de delegación hacia Apify con n8n.
