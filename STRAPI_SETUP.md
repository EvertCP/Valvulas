# Configuración de Strapi CMS

Este proyecto ahora está integrado con Strapi CMS para gestionar el catálogo de productos de forma dinámica.

## Estructura del Proyecto

- **`catalogo/`** - Instalación de Strapi CMS
- **`src/`** - Proyecto Astro (frontend)
- **`src/lib/strapi.ts`** - Utilidad para conectar con la API de Strapi

## Configuración Inicial

### 1. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con:

```env
PUBLIC_STRAPI_URL=http://localhost:1337
```

### 2. Iniciar Strapi

```bash
cd catalogo
npm run develop
```

Esto iniciará Strapi en `http://localhost:1337`

### 3. Configurar Strapi (Primera vez)

1. Abre `http://localhost:1337/admin`
2. Crea tu cuenta de administrador
3. El content-type "Producto" ya está creado con los siguientes campos:
   - **nombre** (Text, requerido)
   - **descripcionCorta** (Text largo, max 200 caracteres, requerido)
   - **descripcion** (Text largo, requerido)
   - **imagen** (Media, solo imágenes, requerido)
   - **caracteristicas** (JSON, opcional) - Array de strings
   - **orden** (Number, default: 0)

### 4. Configurar Permisos de API

**IMPORTANTE:** Debes configurar los permisos para que la API sea accesible públicamente:

1. Ve a **Settings** → **Users & Permissions Plugin** → **Roles**
2. Selecciona **Public**
3. En la sección **Permissions**, expande **Producto**
4. Marca las siguientes opciones:
   - ✅ `find` (para obtener todos los productos)
   - ✅ `findOne` (para obtener un producto específico)
5. Haz clic en **Save**

### 5. Agregar Productos

1. Ve a **Content Manager** → **Producto**
2. Haz clic en **Create new entry**
3. Completa los campos:
   - **nombre**: Ej. "Modelo 1000"
   - **descripcionCorta**: Descripción breve para las tarjetas
   - **descripcion**: Descripción completa para el modal
   - **imagen**: Sube una imagen del producto
   - **caracteristicas**: Ingresa un array JSON, ej:
     ```json
     ["Alta durabilidad", "Cierre hermético", "Bajo mantenimiento"]
     ```
   - **orden**: Número para ordenar los productos (menor = primero)
4. Haz clic en **Save**
5. Haz clic en **Publish** para que el producto sea visible

## Iniciar el Proyecto Completo

### Terminal 1 - Strapi (Backend)
```bash
cd catalogo
npm run develop
```

### Terminal 2 - Astro (Frontend)
```bash
npm run dev
```

## Cómo Funciona

1. **Strapi** proporciona una API REST en `http://localhost:1337/api/productos`
2. **Astro** obtiene los productos desde la API al construir las páginas
3. Si Strapi no está disponible, el sitio usa datos de respaldo (fallback)

## Archivos Modificados

- ✅ `catalogo/src/api/producto/` - Content-type de productos en Strapi
- ✅ `src/lib/strapi.ts` - Utilidad para conectar con Strapi
- ✅ `src/env.d.ts` - Tipos TypeScript para variables de entorno
- ✅ `src/components/Products.astro` - Obtiene productos de Strapi
- ✅ `src/pages/productos.astro` - Obtiene productos de Strapi
- ✅ `.env.example` - Ejemplo de configuración

## Endpoints de API

- **GET** `/api/productos` - Obtener todos los productos
- **GET** `/api/productos/:id` - Obtener un producto específico

Parámetros disponibles:
- `?populate=*` - Incluir relaciones (imágenes)
- `?sort=orden:asc` - Ordenar por campo orden

## Notas Importantes

- Los productos se obtienen en **build time** (cuando se construye el sitio)
- Para ver cambios en producción, debes reconstruir el sitio Astro
- En desarrollo, Astro reconstruye automáticamente las páginas
- Las imágenes de Strapi se sirven desde `http://localhost:1337/uploads/`

## Troubleshooting

### No se muestran los productos de Strapi

1. Verifica que Strapi esté corriendo en `http://localhost:1337`
2. Verifica que los permisos públicos estén configurados
3. Verifica que los productos estén publicados (no en draft)
4. Revisa la consola del navegador y del servidor para errores

### Error de CORS

Si ves errores de CORS, verifica la configuración en `catalogo/config/middlewares.ts`

### Imágenes no se muestran

1. Verifica que la imagen esté subida correctamente en Strapi
2. Verifica que `PUBLIC_STRAPI_URL` esté configurado correctamente
3. Las rutas de imágenes deben ser accesibles desde el navegador
