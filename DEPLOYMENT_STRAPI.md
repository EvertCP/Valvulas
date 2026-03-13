# Guía de Deployment: Strapi + Astro

Esta guía te ayudará a desplegar tu proyecto con Strapi (backend) y Astro (frontend) en producción.

## 📋 Resumen

- **Strapi (Backend)**: Necesita un servidor Node.js y una base de datos
- **Astro (Frontend)**: Se puede desplegar como sitio estático en cualquier hosting
- **Conexión**: Astro se conecta a Strapi mediante la API REST

---

## 🚀 Opción 1: Deployment Recomendado (Separado)

### A. Desplegar Strapi (Backend)

#### Opciones de Hosting para Strapi:

**1. Railway (Recomendado - Fácil y Gratis para empezar)**
- ✅ Deployment automático desde Git
- ✅ Base de datos PostgreSQL incluida
- ✅ SSL automático
- ✅ Plan gratuito disponible

**Pasos:**
1. Crea cuenta en [Railway.app](https://railway.app)
2. Click en "New Project" → "Deploy from GitHub repo"
3. Selecciona tu repositorio y la carpeta `catalogo`
4. Railway detectará automáticamente que es un proyecto Strapi
5. Agrega una base de datos PostgreSQL:
   - Click en "+ New" → "Database" → "Add PostgreSQL"
6. Configura las variables de entorno (ver sección abajo)
7. Deploy automático

**2. Render.com (Alternativa)**
- ✅ Plan gratuito
- ✅ Fácil configuración
- ⚠️ Se duerme después de inactividad (plan gratis)

**3. DigitalOcean App Platform**
- ✅ Muy confiable
- ⚠️ Requiere tarjeta de crédito
- 💰 Desde $5/mes

**4. Heroku**
- ✅ Conocido y estable
- 💰 Ya no tiene plan gratuito

---

#### Variables de Entorno para Strapi en Producción

En tu plataforma de hosting, configura estas variables:

```env
# Base de datos (Railway/Render te darán estas automáticamente)
DATABASE_CLIENT=postgres
DATABASE_HOST=tu-host-db.railway.app
DATABASE_PORT=5432
DATABASE_NAME=railway
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=tu-password-seguro
DATABASE_SSL=true

# Strapi
HOST=0.0.0.0
PORT=1337
APP_KEYS=genera-claves-aleatorias-largas-aqui,otra-clave-aleatoria
API_TOKEN_SALT=genera-salt-aleatorio-aqui
ADMIN_JWT_SECRET=genera-secret-aleatorio-aqui
TRANSFER_TOKEN_SALT=genera-salt-aleatorio-aqui
JWT_SECRET=genera-secret-aleatorio-aqui

# URL pública de tu Strapi
PUBLIC_URL=https://tu-strapi.railway.app

# Node
NODE_ENV=production
```

**⚠️ IMPORTANTE: Genera claves seguras**

Ejecuta esto en tu terminal para generar claves aleatorias:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Ejecuta el comando 5 veces y usa cada resultado para:
1. Primera parte de APP_KEYS
2. Segunda parte de APP_KEYS
3. API_TOKEN_SALT
4. ADMIN_JWT_SECRET
5. JWT_SECRET

---

#### Configuración de CORS en Strapi

Antes de desplegar, actualiza `catalogo/config/middlewares.ts`:

```typescript
export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'dl.airtable.com',
            'https://tu-dominio-astro.com', // Reemplaza con tu dominio de Astro
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'dl.airtable.com',
            'https://tu-dominio-astro.com',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: [
        'http://localhost:4321',
        'https://tu-dominio-astro.com', // Reemplaza con tu dominio de Astro
        'https://tu-dominio-astro.netlify.app', // Si usas Netlify
        'https://tu-dominio-astro.vercel.app', // Si usas Vercel
      ],
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

---

### B. Desplegar Astro (Frontend)

#### Opciones de Hosting para Astro:

**1. Netlify (Recomendado)**
**2. Vercel**
**3. Cloudflare Pages**

Todos son gratuitos y excelentes para sitios estáticos.

#### Pasos para Netlify:

1. **Prepara tu proyecto:**

Crea `netlify.toml` en la raíz del proyecto:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. **Configura la variable de entorno:**

En Netlify (Site settings → Environment variables):
```
PUBLIC_STRAPI_URL=https://tu-strapi.railway.app
```

3. **Deploy:**
- Conecta tu repositorio de GitHub
- Netlify detectará automáticamente que es un proyecto Astro
- Click en "Deploy"

---

## 🔐 Configurar Permisos en Strapi (Producción)

Después del primer deploy de Strapi:

1. Accede al admin: `https://tu-strapi.railway.app/admin`
2. Crea tu cuenta de administrador (primera vez)
3. Ve a **Settings** → **Users & Permissions** → **Roles** → **Public**
4. En **Producto**, marca:
   - ✅ `find`
   - ✅ `findOne`
5. **Save**

---

## 📝 Checklist de Deployment

### Antes de Desplegar:

- [ ] Generar claves seguras para Strapi
- [ ] Configurar CORS en `catalogo/config/middlewares.ts`
- [ ] Crear `netlify.toml` (si usas Netlify)
- [ ] Commit y push de todos los cambios

### Strapi (Backend):

- [ ] Crear cuenta en Railway/Render
- [ ] Conectar repositorio
- [ ] Agregar base de datos PostgreSQL
- [ ] Configurar todas las variables de entorno
- [ ] Verificar que el deploy sea exitoso
- [ ] Acceder al admin y crear cuenta
- [ ] Configurar permisos públicos para Producto
- [ ] Agregar productos y publicarlos

### Astro (Frontend):

- [ ] Crear cuenta en Netlify/Vercel
- [ ] Conectar repositorio
- [ ] Configurar `PUBLIC_STRAPI_URL` con la URL de producción de Strapi
- [ ] Verificar que el build sea exitoso
- [ ] Verificar que los productos se muestren correctamente

---

## 🧪 Probar la Conexión

1. Abre tu sitio Astro en producción
2. Abre las DevTools del navegador (F12)
3. Ve a la pestaña "Network"
4. Recarga la página
5. Busca la petición a `/api/productos`
6. Verifica que:
   - Status: `200 OK`
   - Response: Array con tus productos

Si ves errores:
- **403 Forbidden**: Permisos no configurados en Strapi
- **CORS error**: Actualiza `middlewares.ts` con el dominio correcto
- **404**: URL de Strapi incorrecta en `PUBLIC_STRAPI_URL`

---

## 🔄 Workflow de Desarrollo

### Desarrollo Local:
```bash
# Terminal 1 - Strapi
cd catalogo
npm run develop

# Terminal 2 - Astro
npm run dev
```

### Producción:
- Strapi corre en Railway/Render
- Astro se despliega en Netlify/Vercel
- Cada push a `main` despliega automáticamente

---

## 💡 Tips Importantes

1. **Nunca commitees archivos `.env`** - Están en `.gitignore`
2. **Usa variables de entorno diferentes** para desarrollo y producción
3. **Haz backup de tu base de datos** regularmente
4. **Actualiza CORS** cada vez que cambies de dominio
5. **Los uploads de Strapi** se guardan en el servidor - considera usar S3/Cloudinary para producción

---

## 🆘 Troubleshooting

### "No se ven los productos en producción"

1. Verifica que `PUBLIC_STRAPI_URL` esté configurada correctamente
2. Verifica que los permisos públicos estén habilitados en Strapi
3. Verifica que los productos estén publicados (no en draft)
4. Revisa los logs de Netlify/Vercel para errores de build

### "Error de CORS"

1. Actualiza `catalogo/config/middlewares.ts` con tu dominio de producción
2. Redeploy Strapi
3. Limpia caché del navegador

### "Imágenes no se cargan"

1. Las imágenes se sirven desde Strapi
2. Verifica que Strapi esté corriendo
3. Considera usar un servicio de almacenamiento externo (S3, Cloudinary)

---

## 📚 Recursos Adicionales

- [Documentación de Strapi Deployment](https://docs.strapi.io/dev-docs/deployment)
- [Documentación de Astro Deployment](https://docs.astro.build/en/guides/deploy/)
- [Railway Docs](https://docs.railway.app/)
- [Netlify Docs](https://docs.netlify.com/)
