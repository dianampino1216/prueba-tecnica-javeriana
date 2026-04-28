# Plan de pruebas unitarias — prueba-tecnica-javerina

**Modo:** G — Retrofit (código existente sin tests)
**Runner:** Rstest `@rstest/core@0.9.9` · `happy-dom` · `@testing-library/react`
**Scope aprobado:** `validators.ts`, `normalizer.ts`, `use-lead-storage.ts`

---

## Lo que NO se testea y por qué

| Excluido | Razón |
|---|---|
| Componentes React (`modal`, `navbar`, `button`, etc.) | Más valor en E2E |
| Páginas (`home-page`, `admin-leads-page`, etc.) | Integración completa, mejor en E2E |
| `services/` (api-client, programs, leads, events) | Wrappers HTTP, valor real en tests de integración con mock de `fetch` |
| `assets/icons/` | Sin lógica |
| `constants/index.ts` | Sin lógica que romper |

---

## validators.ts — `validateJaverianaEmail`

| # | Título | Nivel | Setup | Act | Assert | Regresión que previene |
|---|--------|-------|-------|-----|--------|----------------------|
| V1 | Email vacío retorna inválido | Unit | — | `validateJaverianaEmail('')` | `isValid: false`, mensaje de obligatoriedad | Formulario enviado con campo en blanco |
| V2 | Email con solo espacios retorna inválido | Unit | — | `validateJaverianaEmail('   ')` | `isValid: false`, mensaje de obligatoriedad | Espacios bypasseando validación |
| V3 | Formato sin @ retorna inválido | Unit | — | `validateJaverianaEmail('noatsign')` | `isValid: false`, mensaje de formato | Email malformado aceptado |
| V4 | Dominio incorrecto retorna inválido | Unit | — | `validateJaverianaEmail('user@gmail.com')` | `isValid: false`, mensaje de dominio | Email externo aceptado en registro |
| V5 | Subdominio javeriana retorna inválido | Unit | — | `validateJaverianaEmail('user@posgrados.javeriana.edu.co')` | `isValid: false` | Subdominio no autorizado aceptado |
| V6 | Dominio en mayúsculas retorna válido | Unit | — | `validateJaverianaEmail('user@JAVERIANA.EDU.CO')` | `isValid: true`, `errorMessage: null` | Case-sensitivity bloqueando usuarios legítimos |
| V7 | Email válido retorna válido | Unit | — | `validateJaverianaEmail('juan.perez@javeriana.edu.co')` | `isValid: true`, `errorMessage: null` | Regresión en el happy path |
| V8 | Email con espacios alrededor retorna válido | Unit | — | `validateJaverianaEmail('  user@javeriana.edu.co  ')` | `isValid: true` | Trim no aplicado antes de validar |

---

## normalizer.ts — `normalizeName`, `normalizeLeadData`, `removeAccents`

| # | Título | Nivel | Setup | Act | Assert | Regresión que previene |
|---|--------|-------|-------|-----|--------|----------------------|
| N1 | String vacío retorna vacío (`normalizeName`) | Unit | — | `normalizeName('')` | `''` | Crash en split de string vacío |
| N2 | Nombre con espacios extras queda en Title Case | Unit | — | `normalizeName('  juan   pérez  ')` | `'Juan Pérez'` | Nombres con espacios dobles malformados |
| N3 | Una sola letra queda en mayúscula | Unit | — | `normalizeName('o')` | `'O'` | Nombre de una letra procesado incorrectamente |
| N4 | Tildes se preservan en el nombre | Unit | — | `normalizeName('ángela')` | `'Ángela'` | Pérdida de tildes en normalización |
| N5 | `removeAccents` elimina tildes | Unit | — | `removeAccents('ángela')` | `'angela'` | Búsqueda fallando por tildes |
| N6 | `removeAccents` con string vacío retorna vacío | Unit | — | `removeAccents('')` | `''` | Crash en normalize de string vacío |
| N7 | `normalizeLeadData` normaliza email a lowercase | Unit | — | `normalizeLeadData({ email: 'USER@Javeriana.edu.co', ... })` | `email: 'user@javeriana.edu.co'` | Email con mayúsculas duplicado en base |
| N8 | `normalizeLeadData` limpia guiones y espacios del teléfono | Unit | — | `normalizeLeadData({ telefono: '310-555 1234', ... })` | `telefono: '3105551234'` | Teléfono con formato inconsistente guardado |
| N9 | `normalizeLeadData` aplica Title Case al nombre | Unit | — | `normalizeLeadData({ nombre: 'maria camila', ... })` | `nombre: 'Maria Camila'` | Nombre en minúsculas guardado en DB |

---

## use-lead-storage.ts — `useLeadsStorage`

| # | Título | Nivel | Setup | Act | Assert | Regresión que previene |
|---|--------|-------|-------|-----|--------|----------------------|
| H1 | Sin datos previos, `leads` inicia vacío | Unit | `localStorage` vacío | `renderHook(useLeadsStorage)` | `result.current.leads` es `[]` | Hook crasheando en primera visita |
| H2 | Carga leads existentes de `localStorage` | Unit | Seed en `localStorage` con un lead | `renderHook(useLeadsStorage)` | `leads` tiene 1 elemento con los datos sembrados | Leads no persistiendo entre recargas |
| H3 | `localStorage` corrupto retorna array vacío | Unit | `localStorage.setItem(key, 'invalid json')` | `renderHook(useLeadsStorage)` | `leads` es `[]` sin lanzar | Crash al visitar con storage corrupto |
| H4 | `addLead` agrega lead al estado y persiste | Unit | Hook renderizado, `crypto.randomUUID` mockeado | `act(() => addLead(inputData))` | `leads` tiene 1 elemento; `localStorage` contiene el lead; retorna `true` | Lead se muestra en UI pero no persiste |
| H5 | `addLead` acumula múltiples leads | Unit | 1 lead previo en storage | `act(() => addLead(secondLead))` | `leads.length === 2` | Segundo lead sobreescribiendo al primero |
| H6 | `addLead` retorna `false` si `localStorage` falla | Unit | `localStorage.setItem` mockeado para lanzar | `act(() => addLead(inputData))` | Retorna `false`; `leads` no cambia | Error silencioso perdiendo datos del usuario |
| H7 | `fecha_inscripcion` es un ISO string válido | Unit | `Date` controlada con `rstest.spyOn` | `act(() => addLead(inputData))` | `leads[0].fecha_inscripcion` parsea como fecha válida | Fecha inválida guardada en registro |
