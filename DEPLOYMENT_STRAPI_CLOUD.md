# Deployment: Strapi Cloud + Vercel

Guía paso a paso para desplegar Strapi en Strapi Cloud y conectarlo con tu frontend en Vercel.

---

## 🚀 Paso 1: Preparar el Proyecto Strapi

### A. Asegúrate de que tu código esté en Git

```bash
# Desde la raíz del proyecto
git add .
git commit -m "Preparar Strapi para deployment"
git push origin main
```

### B. Verifica la estructura del proyecto

Tu carpeta `catalogo` debe tener:
- ✅ `package.json`
- ✅ `src/api/producto/` (content-type creado)
- ✅ `config/` (configuraciones)
- ✅ `.gitignore` (debe incluir `.env`, `node_modules`, etc.)

---

## ☁️ Paso 2: Crear Cuenta en Strapi Cloud

1. Ve a [cloud.strapi.io](https://cloud.strapi.io)
2. Click en **"Start Free Trial"** o **"Sign Up"**
3. Puedes registrarte con:
   - GitHub (recomendado)
   - GitLab
   - Email

---

## 📦 Paso 3: Crear Nuevo Proyecto en Strapi Cloud

### A. Conectar Repositorio

1. En el dashboard de Strapi Cloud, click en **"Create Project"**
2. Selecciona **"Import from Git"**
3. Autoriza a Strapi Cloud para acceder a tu repositorio de GitHub
4. Selecciona tu repositorio
5. **IMPORTANTE:** En "Root Directory", especifica: `catalogo`
   - Esto le dice a Strapi Cloud que tu proyecto está en la carpeta `catalogo`

### B. Configurar el Proyecto

1. **Project Name:** Elige un nombre (ej: `valvulas-vcj`)
2. **Region:** Selecciona la más cercana a tus usuarios
   - US East (Virginia) - Para América
   - EU West (Frankfurt) - Para Europa
3. **Plan:** Selecciona el plan (hay plan gratuito disponible)

### C. Variables de Entorno

Strapi Cloud te pedirá configurar algunas variables. **Deja las que genera automáticamente** (APP_KEYS, JWT_SECRET, etc.)

**Solo necesitas agregar:**

```env
NODE_ENV=production
```

Las demás (DATABASE_*, APP_KEYS, etc.) las genera Strapi Cloud automáticamente.

4. Click en **"Deploy"**

---

## ⏳ Paso 4: Esperar el Deployment

El proceso toma entre 5-10 minutos:

1. Strapi Cloud clonará tu repositorio
2. Instalará dependencias (`npm install`)
3. Construirá el proyecto (`npm run build`)
4. Configurará la base de datos (PostgreSQL incluida)
5. Iniciará el servidor

Verás el progreso en tiempo real. Cuando termine, verás:
- ✅ **Status: Running**
- 🌐 **URL:** `https://tu-proyecto.strapiapp.com`

---

## 🔐 Paso 5: Configurar Admin y Permisos

### A. Crear Cuenta de Administrador

1. Click en **"Open Admin Panel"** o ve a: `https://tu-proyecto.strapiapp.com/admin`
2. Crea tu cuenta de administrador:
   - Nombre
   - Email
   - Password (seguro)
3. Click en **"Let's start"**

### B. Configurar Permisos Públicos (CRÍTICO)

1. En el panel de Strapi, ve a:
   - **Settings** (⚙️ en la barra lateral)
   - **Users & Permissions Plugin**
   - **Roles**
   - Click en **"Public"**

2. Baja hasta la sección **"Permissions"**

3. Busca **"Producto"** y expándelo

4. Marca estas casillas:
   - ✅ **find** (para obtener todos los productos)
   - ✅ **findOne** (para obtener un producto específico)

5. Click en **"Save"** (arriba a la derecha)

⚠️ **Sin este paso, tu frontend no podrá acceder a los productos**

---

## 📝 Paso 6: Agregar Productos

1. En el panel de Strapi, ve a:
   - **Content Manager** (📝 en la barra lateral)
   - **Producto**

2. Click en **"Create new entry"**

3. Completa los campos:
   - **nombre:** "Válvula Modelo 1000"
   - **descripcionCorta:** "Descripción breve para las tarjetas"
   - **descripcion:** "Descripción completa del producto..."
   - **imagen:** Click en "Add new assets" y sube una imagen
   - **caracteristicas:** Click en "Add an entry" y escribe:
     ```json
     ["Alta durabilidad", "Cierre hermético", "Bajo mantenimiento"]
     ```
   - **orden:** 1

4. **MUY IMPORTANTE:** Click en **"Publish"** (arriba a la derecha)
   - Los productos en "Draft" NO aparecen en la API

5. Repite para agregar más productos

---

## 🔗 Paso 7: Conectar Vercel con Strapi Cloud

### A. Obtener URL de Strapi

En Strapi Cloud, copia tu URL del proyecto:
```
https://tu-proyecto.strapiapp.com
```

### B. Configurar Variable de Entorno en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Selecciona tu proyecto
3. Ve a **Settings** → **Environment Variables**
4. Agrega una nueva variable:
   - **Name:** `PUBLIC_STRAPI_URL`
   - **Value:** `https://tu-proyecto.strapiapp.com`
   - **Environment:** Marca todas (Production, Preview, Development)
5. Click en **"Save"**

### C. Redeploy el Frontend

1. Ve a la pestaña **"Deployments"**
2. Click en los tres puntos del último deployment
3. Click en **"Redeploy"**

O simplemente haz un nuevo commit:
```bash
git commit --allow-empty -m "Update Strapi URL"
git push origin main
```

Vercel redesplegará automáticamente.

---

## 🔧 Paso 8: Configurar CORS en Strapi

Para que Vercel pueda conectarse a Strapi Cloud, necesitas configurar CORS.

### A. Actualizar middlewares.ts

En tu proyecto local, edita `catalogo/config/middlewares.ts`:

```typescript
import type { Core } from '@strapi/strapi';

const config: Core.Config.Middlewares = [
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
            'https://tu-proyecto.vercel.app', // Tu dominio de Vercel
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'dl.airtable.com',
            'https://tu-proyecto.vercel.app', // Tu dominio de Vercel
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
        'http://localhost:4321', // Desarrollo local
        'https://tu-proyecto.vercel.app', // Tu dominio de Vercel
        'https://tu-dominio-custom.com', // Si tienes dominio personalizado
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

export default config;
```

### B. Hacer Commit y Push

```bash
git add catalogo/config/middlewares.ts
git commit -m "Configurar CORS para Vercel"
git push origin main
```

Strapi Cloud detectará el cambio y redesplegará automáticamente (toma ~2-3 minutos).

---

## ✅ Paso 9: Verificar que Todo Funcione

### A. Probar la API de Strapi

Abre en tu navegador:
```
https://tu-proyecto.strapiapp.com/api/productos
```

Deberías ver un JSON con tus productos:
```json
{
  "data": [
    {
      "id": 1,
      "nombre": "Válvula Modelo 1000",
      "descripcionCorta": "...",
      ...
    }
  ]
}
```

Si ves `403 Forbidden`: Los permisos públicos no están configurados (vuelve al Paso 5B)

### B. Probar el Frontend en Vercel

1. Abre tu sitio en Vercel: `https://tu-proyecto.vercel.app`
2. Abre las DevTools (F12)
3. Ve a la pestaña **"Network"**
4. Recarga la página
5. Busca la petición a `/api/productos`
6. Verifica:
   - ✅ Status: `200 OK`
   - ✅ Response: Array con tus productos

### C. Verificar que los Productos se Muestren

Navega a la sección de productos en tu sitio. Deberías ver las tarjetas con los productos de Strapi.

---

## 🔄 Workflow de Actualización

### Para Actualizar Contenido (Productos):
1. Ve a `https://tu-proyecto.strapiapp.com/admin`
2. Content Manager → Producto
3. Edita/Agrega productos
4. Click en **"Publish"**
5. Los cambios aparecen inmediatamente en tu sitio

### Para Actualizar Código de Strapi:
1. Haz cambios en tu proyecto local (carpeta `catalogo`)
2. Commit y push:
   ```bash
   git add .
   git commit -m "Descripción de cambios"
   git push origin main
   ```
3. Strapi Cloud redespliega automáticamente (~2-3 minutos)

### Para Actualizar Frontend:
1. Haz cambios en tu proyecto Astro
2. Commit y push:
   ```bash
   git add .
   git commit -m "Descripción de cambios"
   git push origin main
   ```
3. Vercel redespliega automáticamente (~1-2 minutos)

---

## 🆘 Troubleshooting

### "No se ven los productos en el sitio"

**Checklist:**
- [ ] ¿Los permisos públicos están configurados? (Paso 5B)
- [ ] ¿Los productos están publicados (no en draft)?
- [ ] ¿La variable `PUBLIC_STRAPI_URL` está configurada en Vercel?
- [ ] ¿Redesplegaste Vercel después de configurar la variable?
- [ ] ¿CORS está configurado con tu dominio de Vercel? (Paso 8)

**Verificar en DevTools:**
1. F12 → Network
2. Busca la petición a Strapi
3. Si ves error 403: Permisos no configurados
4. Si ves error CORS: Actualiza `middlewares.ts` con tu dominio

### "Error 403 Forbidden"

**Solución:**
1. Ve a Strapi Admin: `https://tu-proyecto.strapiapp.com/admin`
2. Settings → Users & Permissions → Roles → Public
3. Marca `find` y `findOne` en Producto
4. Save

### "Error de CORS"

**Solución:**
1. Verifica que `catalogo/config/middlewares.ts` tenga tu dominio de Vercel
2. Haz commit y push
3. Espera 2-3 minutos a que Strapi Cloud redesplegue
4. Limpia caché del navegador (Ctrl+Shift+R)

### "Las imágenes no se cargan"

**Causa:** Las imágenes se sirven desde Strapi Cloud

**Verificación:**
1. Abre la URL de la imagen en el navegador
2. Debería ser algo como: `https://tu-proyecto.strapiapp.com/uploads/...`
3. Si no carga, verifica que la imagen esté subida en Strapi

---

## 💰 Costos de Strapi Cloud

**Plan Gratuito:**
- ✅ 1 proyecto
- ✅ Base de datos PostgreSQL incluida
- ✅ 1GB de almacenamiento
- ✅ SSL automático
- ✅ Backups automáticos
- ⚠️ Límite de 1000 entradas

**Plan Pro ($99/mes):**
- Proyectos ilimitados
- 10GB de almacenamiento
- 100,000 entradas
- Soporte prioritario

Para la mayoría de sitios pequeños/medianos, el plan gratuito es suficiente.

---

## 📚 Recursos Útiles

- [Documentación de Strapi Cloud](https://docs.strapi.io/cloud/intro)
- [Documentación de Vercel](https://vercel.com/docs)
- [Strapi Cloud Dashboard](https://cloud.strapi.io)

---

## ✨ Resumen

**Tu setup final:**
- 🎨 **Frontend (Astro):** Vercel
- 🔧 **Backend (Strapi):** Strapi Cloud
- 🗄️ **Base de datos:** PostgreSQL (incluida en Strapi Cloud)
- 🔗 **Conexión:** API REST
- 🚀 **Deployment:** Automático con Git push

**Ventajas:**
- ✅ Sin configuración de servidor
- ✅ SSL automático
- ✅ Backups automáticos
- ✅ Escalabilidad automática
- ✅ Deployment con un click
- ✅ Sin problemas de conectividad
