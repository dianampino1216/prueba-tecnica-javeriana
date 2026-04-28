# Javeriana Lead & Events Manager

Presento mi solución para la prueba técnica de Desarrollo Frontend. Este proyecto es una Single Page Application (SPA) diseñada para visualizar la oferta académica y gestionar el registro de aspirantes (leads) de manera eficiente, robusta y con una excelente experiencia de usuario.

**[Ver Demo en Vivo del Proyecto][https://prueba-tecnica-javeriana.vercel.app]**
**[Página de Mercadeo][https://prueba-tecnica-javeriana.vercel.app/admin]**
**[Página de Aspirante][https://prueba-tecnica-javeriana.vercel.app]**

---

## Requisitos previos

- Node.js 18+
- npm 9+
- pnpm (opcional)

---

## Cómo ejecutar el proyecto localmente

### 1. Clonar el repositorio

```bash
git clone https://github.com/dianampino1216/prueba-tecnica-javeriana.git
cd prueba-tecnica-javeriana
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno

Copiar el archivo de plantilla y completar los valores:

```bash
cp .env-template .env
```

Editar `.env` con las credenciales que me puedes solicitar:

```env
VITE_MOCKAROO_API_URL=https://my.api.mockaroo.com
VITE_MOCKAROO_API_KEY=tu_api_key_aqui
```

> Si no tienes credenciales de Mockaroo, la app funciona con datos de respaldo (fallback) incorporados.

### 4. Iniciar el servidor de desarrollo

```bash
pnpm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

### 5. Build para producción

```bash
pnpm run build
```

---

## Stack Tecnológico Utilizado

### Framework y lenguaje
**React 19 + TypeScript** — Se eligió TypeScript por su tipado estático, que reduce errores en tiempo de compilación y mejora la mantenibilidad. Todas las entidades del dominio (Programa, Evento, Lead) están modeladas con interfaces estrictas sin uso de `any`.

### Estilos
**Tailwind CSS v4** — Permite construir interfaces responsivas directamente en el markup sin cambiar de contexto. Se definió una paleta de colores personalizada coherente con la identidad visual Javeriana.

### Gestión de estado
**Context API global** - Crea un estado global que permite que cualquier componente de la aplicación acceda a datos o configuraciones globales de forma directa. Esto garantiza una única fuente de verdad.

Considero que para esta prueba era suficiente Context API y no fue necesario añadir boilerplate al proyecto con librerías externas.

### Consumo de API
**API en Vercel** como fuente de datos REST, la cual se encarga de servir la información leyendo el contenido desde un archivo JSON. Cuenta con un diseño basado en un patrón de **fallback estático**: si la API de Vercel falla, demora en responder o presenta problemas de conexión, la aplicación intercepta el error y sirve datos de demostración (mock data) de manera transparente, asegurando que la experiencia del usuario nunca se rompa.

### Testing
* **Testing:** Vitest + React Testing Library + Happy DOM. 

Se realizaron tests unitarios a funciones y hooks (localStorage).

### Enrutamiento
* **Enrutamiento:** React Router v7.

---

## Arquitectura

1. **Estructura Modular:** El proyecto está dividido lógicamente en `components`, `pages`, `services`, `hooks`, `contexts`, `utils` y `types`. Esto facilita el mantenimiento a largo plazo.
2. **Custom Hooks para Lógica de Negocio:** Toda la lógica de guardado y persistencia de leads fue extraída al hook `useLeadsStorage`. Esto mantiene los componentes de React limpios y enfocados únicamente en la vista (UI).
3. **Performance (Renderizado Optimo):** Se utilizó `useMemo` en las secciones de filtrado para memorizar los resultados de búsqueda. Esto previene cálculos pesados en cada render de React mientras el usuario teclea.

---

## Vistas de la aplicación

| Ruta | Descripción |
|------|-------------|
| `/` | Home con programas destacados y próximos eventos |
| `/programas` | Catálogo completo con búsqueda y filtros |
| `/programa/:id` | Detalle del programa + formulario de inscripción |
| `/admin` | Dashboard de gestión de aspirantes registrados |

---

## Utilidades

### Normalización y validación
- **`validators.ts`**: valida formato de email y restringe el dominio a `@javeriana.edu.co`.
- **`normalizer.ts`**: capitaliza nombres (Title Case), elimina espacios extra y convierte el email a minúsculas antes de guardar.

### Funcionalidades extras
- **Modo oscuro** — toggle persistente vía `useTheme` hook.
- **Vista admin de leads** — tabla con búsqueda, filtro por facultad, modal de detalle y acceso directo a WhatsApp del aspirante.