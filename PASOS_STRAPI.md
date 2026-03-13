# Pasos para Ver Productos de Strapi

## 🔧 Paso 1: Crear archivo .env

Crea un archivo llamado `.env` en la raíz del proyecto (al mismo nivel que `package.json`):

```env
PUBLIC_STRAPI_URL=http://localhost:1337
```

## 🚀 Paso 2: Iniciar Strapi

Abre una terminal y ejecuta:

```bash
cd catalogo
npm run develop
```

Espera a que veas el mensaje:
```
┌────────────────────────────────────────────────────┐
│ Strapi is running at http://localhost:1337/admin  │
└────────────────────────────────────────────────────┘
```

## 🔐 Paso 3: Configurar Permisos (MUY IMPORTANTE)

1. Abre tu navegador en: `http://localhost:1337/admin`
2. Si es la primera vez, crea tu cuenta de administrador
3. Una vez dentro, ve a:
   - **Settings** (⚙️ en la barra lateral izquierda)
   - **Users & Permissions Plugin**
   - **Roles**
   - Click en **Public**
4. En la sección **Permissions**, busca **Producto** y expándelo
5. Marca estas casillas:
   - ✅ **find** (para obtener todos los productos)
   - ✅ **findOne** (para obtener un producto específico)
6. Click en **Save** (arriba a la derecha)

**⚠️ SIN ESTE PASO, LA API NO SERÁ ACCESIBLE Y VERÁS DATOS DE RESPALDO**

## 📦 Paso 4: Agregar Productos

1. En el panel de Strapi, ve a:
   - **Content Manager** (📝 en la barra lateral)
   - **Producto**
2. Click en **Create new entry**
3. Completa los campos:
   - **nombre**: Ej. "Válvula de Compuerta Modelo 1000"
   - **descripcionCorta**: Ej. "Diseñada para control de flujo con cierre hermético"
   - **descripcion**: Ej. "Válvula de compuerta de alta calidad diseñada para aplicaciones industriales..."
   - **imagen**: Click en "Add new assets" y sube una imagen
   - **caracteristicas**: Click en "Add an entry" y escribe en formato JSON:
     ```json
     ["Alta durabilidad", "Cierre hermético", "Bajo mantenimiento"]
     ```
   - **orden**: 1 (los productos se ordenan por este número)
4. Click en **Save**
5. **MUY IMPORTANTE**: Click en **Publish** (arriba a la derecha)

Repite para agregar más productos.

## 🌐 Paso 5: Iniciar Astro

Abre OTRA terminal (mantén Strapi corriendo) y ejecuta:

```bash
npm run dev
```

## ✅ Paso 6: Verificar

1. Abre `http://localhost:4321` en tu navegador
2. Revisa la consola del servidor (terminal de Astro) - deberías ver:
   ```
   [Strapi] Intentando conectar a: http://localhost:1337/api/productos
   [Strapi] ✓ Se obtuvieron X productos desde Strapi
   ```

Si ves:
```
[Strapi] ✗ Error al conectar con Strapi
[Products] ⚠ No se obtuvieron productos de Strapi, usando datos de respaldo
```

Entonces hay un problema. Revisa:
- ✅ Strapi está corriendo en `http://localhost:1337`
- ✅ Los permisos públicos están configurados (Paso 3)
- ✅ Los productos están publicados (no en draft)
- ✅ El archivo `.env` existe con `PUBLIC_STRAPI_URL=http://localhost:1337`

## 🔄 Actualizar Productos

Cuando agregues o modifiques productos en Strapi:

1. Guarda y publica el producto en Strapi
2. **Astro reconstruirá automáticamente** las páginas en modo desarrollo
3. Recarga la página en el navegador para ver los cambios

## 🐛 Troubleshooting

### Error 403 Forbidden
- **Causa**: Permisos no configurados
- **Solución**: Repite el Paso 3

### Error ECONNREFUSED
- **Causa**: Strapi no está corriendo
- **Solución**: Inicia Strapi (Paso 2)

### Se ven productos de respaldo
- **Causa**: La API no está respondiendo o no hay productos publicados
- **Solución**: Verifica todos los pasos anteriores

### Las imágenes no se muestran
- **Causa**: Las imágenes se sirven desde Strapi
- **Solución**: Asegúrate de que Strapi esté corriendo y que las imágenes estén subidas correctamente
