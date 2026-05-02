# SecureElite — Sitio Web Negocio de Seguridad

Stack: **Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion**

## Estructura del proyecto

```
├── app/
│   ├── layout.tsx          # Layout principal con fuentes Google
│   ├── globals.css         # Estilos globales + Tailwind
│   └── page.tsx            # Página principal (ensambla todas las secciones)
│
├── components/
│   ├── ui/
│   │   └── container-scroll-animation.tsx   # Componente de 21st.dev
│   ├── Navbar.tsx
│   ├── HeroSection.tsx        # Hero con ContainerScroll
│   ├── ServicesSection.tsx    # Servicios destacados
│   ├── WorksSection.tsx       # Trabajos previos con filtro
│   ├── TestimonialsSection.tsx # Testimonios + estadísticas
│   ├── StoreSection.tsx       # Tienda con carrito
│   ├── ContactSection.tsx     # Formulario de contacto
│   └── Footer.tsx
```

## Setup desde cero

### 1. Crear proyecto Next.js con shadcn
```bash
npx create-next-app@latest security-site --typescript --tailwind --app --src-dir=false
cd security-site
npx shadcn@latest init
```

### 2. Instalar dependencias
```bash
npm install framer-motion lucide-react
```

### 3. Copiar archivos
Copia todos los archivos de este proyecto respetando la estructura de carpetas.

### 4. Ejecutar
```bash
npm run dev
```

## Secciones incluidas

| Sección | ID | Descripción |
|---|---|---|
| Hero | `#inicio` | Scroll animation con panel de monitoreo falso |
| Servicios | `#servicios` | 6 servicios con hover effects |
| Trabajos | `#trabajos` | Portfolio con filtro por categoría |
| Testimonios | `#testimonios` | Carrusel + estadísticas |
| Tienda | `#tienda` | 6 productos con carrito |
| Contacto | `#contacto` | Formulario + info de contacto |

## Personalización rápida

- **Nombre del negocio**: busca `SecureElite` en todos los archivos
- **Colores**: el dorado es `#c8a96e` y el fondo negro es `#0a0a0a`
- **Productos**: edita el array `products` en `StoreSection.tsx`
- **Trabajos**: edita el array `projects` en `WorksSection.tsx`
- **Testimonios**: edita el array `testimonials` en `TestimonialsSection.tsx`
