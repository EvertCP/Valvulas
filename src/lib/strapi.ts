// Configuración para conectar con Strapi
// Usar 127.0.0.1 en lugar de localhost para forzar IPv4 y evitar problemas de conexión
const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';

// Strapi v5 estructura plana (sin wrapper 'attributes')
interface StrapiImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText?: string;
  url: string;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

interface StrapiProducto {
  id: number;
  documentId: string;
  nombre: string;
  descripcionCorta: string;
  descripcion: string;
  imagen: StrapiImage | null;
  caracteristicas: string[] | null;
  orden: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface StrapiResponse {
  data: StrapiProducto[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface Producto {
  id: number;
  name: string;
  shortDescription: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  features: string[];
}

/**
 * Obtiene la URL completa de una imagen de Strapi v5
 */
function getStrapiImageUrl(image: StrapiImage | null | undefined): string {
  if (!image || !image.url) {
    return '/productos/placeholder.jpg';
  }
  
  const url = image.url;
  
  // Si la URL ya es completa, devolverla tal cual
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Si es una ruta relativa, agregar la URL base de Strapi
  return `${STRAPI_URL}${url}`;
}

/**
 * Transforma un producto de Strapi v5 al formato usado en el frontend
 */
function transformProducto(strapiProducto: any): Producto {
  // Verificar campos requeridos
  if (!strapiProducto || !strapiProducto.nombre) {
    throw new Error(`Producto sin campo 'nombre'. Campos disponibles: ${Object.keys(strapiProducto || {}).join(', ')}`);
  }
  
  return {
    id: strapiProducto.id,
    name: strapiProducto.nombre,
    shortDescription: strapiProducto.descripcionCorta || '',
    description: strapiProducto.descripcion || '',
    imageSrc: getStrapiImageUrl(strapiProducto.imagen),
    imageAlt: strapiProducto.imagen?.alternativeText || strapiProducto.nombre,
    features: strapiProducto.caracteristicas || [],
  };
}

/**
 * Obtiene todos los productos publicados desde Strapi
 */
export async function getProductos(): Promise<Producto[]> {
  try {
    console.log(`[Strapi] Intentando conectar a: ${STRAPI_URL}/api/productos`);
    
    const response = await fetch(
      `${STRAPI_URL}/api/productos?populate=*&sort=orden:asc`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error(`[Strapi] Error al obtener productos: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`[Strapi] Respuesta de error:`, errorText);
      return [];
    }

    const data: any = await response.json();
    console.log(`[Strapi] ✓ Se obtuvieron ${data.data?.length || 0} productos desde Strapi`);
    
    if (!data.data || !Array.isArray(data.data)) {
      console.error('[Strapi] Respuesta sin data array');
      return [];
    }
    
    const productos = [];
    for (let i = 0; i < data.data.length; i++) {
      const item = data.data[i];
      console.log(`[Strapi] Producto ${i + 1} recibido:`, {
        id: item?.id,
        hasAttributes: !!item?.attributes,
        attributesType: typeof item?.attributes,
        keys: item?.attributes ? Object.keys(item.attributes) : 'NO ATTRIBUTES'
      });
      
      try {
        const producto = transformProducto(item);
        productos.push(producto);
        console.log(`[Strapi] ✓ Producto transformado: ${producto.name}`);
      } catch (error: any) {
        console.error(`[Strapi] ✗ Error en producto ${i + 1}:`, error.message);
        console.error(`[Strapi] Item completo:`, JSON.stringify(item, null, 2));
      }
    }
    
    console.log(`[Strapi] Total productos transformados: ${productos.length}`);
    return productos;
  } catch (error) {
    console.error('[Strapi] ✗ Error al conectar con Strapi:', error);
    console.error('[Strapi] Asegúrate de que Strapi esté corriendo en:', STRAPI_URL);
    return [];
  }
}

/**
 * Obtiene un producto específico por ID
 */
export async function getProducto(id: number): Promise<Producto | null> {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/productos/${id}?populate=*`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error(`Error al obtener producto ${id} de Strapi: ${response.status}`);
      return null;
    }

    const result = await response.json();
    return transformProducto(result.data);
  } catch (error) {
    console.error(`Error al obtener producto ${id}:`, error);
    return null;
  }
}
