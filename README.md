# Javeriana Lead & Events Manager

Aplicación SPA desarrollada como prueba técnica para la Dirección de Mercadeo de la **Pontificia Universidad Javeriana**. Permite visualizar la oferta académica y gestionar el registro de nuevos interesados (leads).

🔗 **Demo en producción:** [https://prueba-tecnica-javeriana.vercel.app](https://prueba-tecnica-javeriana.vercel.app)

---

## Requisitos previos

- Node.js 18+
- npm 9+

---

## Cómo ejecutar el proyecto localmente

### 1. Clonar el repositorio

```bash
git clone https://github.com/dianampino/prueba-tecnica-javeriana.git
cd prueba-tecnica-javeriana
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno

Copia el archivo de plantilla y completa los valores:

```bash
cp .env-template .env
```

Edita `.env` con las credenciales que me puedes solicitar:

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

## Vistas de la aplicación

| Ruta | Descripción |
|------|-------------|
| `/` | Home con programas destacados y próximos eventos |
| `/programas` | Catálogo completo con búsqueda y filtros |
| `/programa/:id` | Detalle del programa + formulario de inscripción |
| `/admin` | Dashboard de gestión de aspirantes registrados |

---

## Decisiones técnicas

### Framework y lenguaje
**React 19 + TypeScript** — Se eligió TypeScript por su tipado estático, que reduce errores en tiempo de compilación y mejora la mantenibilidad. Todas las entidades del dominio (Programa, Evento, Lead) están modeladas con interfaces estrictas sin uso de `any`.

### Estilos
**Tailwind CSS v4** — Permite construir interfaces responsivas directamente en el markup sin cambiar de contexto. Se definió una paleta de colores personalizada (`puj-blue`, `puj-gold`, `puj-cyan`) coherente con la identidad visual Javeriana.

### Gestión de estado
**Custom Hook (`useLeadsStorage`)** en lugar de Context API global — dado que el único estado compartido entre vistas son los leads (que viven en `localStorage`), un hook reutilizable es suficiente y evita la complejidad innecesaria de un contexto. Los contextos (`auth-context`, `ui-context`) están disponibles para futuras extensiones (autenticación, tema global).

### Consumo de API
**Mockaroo** como fuente de datos REST con un patrón de **fallback estático**: si la API falla o se agota la cuota, la app sirve datos de demostración sin romper la experiencia de usuario.

### Filtrado
Implementado con `useMemo` para evitar recálculos en cada render. El filtro por tipo de programa maneja agrupaciones semánticas: "Posgrado" incluye Maestría, Especialización y Doctorado. Los filtros viven en la URL (`useSearchParams`) para que sean compartibles.

### Normalización y validación
- **`validators.ts`**: valida formato de email y restringe el dominio a `@javeriana.edu.co`.
- **`normalizer.ts`**: capitaliza nombres (Title Case), elimina espacios extra y convierte el email a minúsculas antes de guardar.

### Funcionalidades extra (plus)
- **Modo oscuro** — toggle persistente vía `useTheme` hook.
- **Vista admin de leads** — tabla con búsqueda, filtro por facultad, modal de detalle y acceso directo a WhatsApp del aspirante.
