# Plan de Migración: Firefly III de Monolito a Laravel + InertiaJS + Vue 3 + Vite

## Resumen Ejecutivo

Este documento detalla un plan integral de migración para transformar Firefly III desde su arquitectura monolítica actual hacia una arquitectura moderna utilizando Laravel 12 como backend, InertiaJS como capa de integración, Vue 3 con Vite como framework frontend, y un stack tecnológico moderno que incluye Pinia para state management, PrimeVue para componentes, FormKit para formularios, vue-i18n para internacionalización, y Day.js para fechas. La migración se realizará de forma incremental preservando la funcionalidad existente mientras se moderniza la experiencia de usuario.

## Análisis del Estado Actual

### Arquitectura Actual
- **Backend**: Laravel 12 con PHP 8.4+
- **Frontend Dual**:
  - **v1 (Legacy)**: Laravel 8 + Vue 2 + Bootstrap 3
  - **v2 (Moderno)**: Vite + AlpineJS + Bootstrap 5
- **Base de Datos**: MySQL/PostgreSQL/SQLite
- **Autenticación**: Laravel Sanctum + Passport
- **API**: REST JSON API completa

### Stack Tecnológico Propuesto para v3 (Vue.js)
- **Frontend Framework**: Vue 3 + Vite
- **State Management**: Pinia (composable stores)
- **UI Components**: PrimeVue (comprehensive Vue UI library)
- **Date Handling**: Day.js (lightweight date library)
- **Internationalization**: vue-i18n (i18next for Vue)
- **Forms**: FormKit (declarative form building & validation)
- **Animations**: framer-motion (via motion-vue)
- **Styling**: Tailwind CSS + CSS Modules (or PrimeVue's built-in theming)
- **Build Tool**: Vite 7
- **Type Safety**: TypeScript (opcional pero recomendado, especialmente si se usa Vue 3 con `<script setup>`)

### Estructura de Frontend Actual (Asumiendo una estructura similar a la anterior)
```
resources/assets/
├── v1/ (Legacy - Vue 2)
│   ├── webpack.mix.js
│   ├── src/
│   │   ├── app.js (jQuery/Bootstrap)
│   │   ├── app_vue.js (Vue 2)
│   │   └── components/ (Vue 2 components)
├── v2/ (Modern - AlpineJS)
│   ├── vite.config.js
│   ├── src/
│   │   ├── pages/ (AlpineJS pages)
│   │   ├── api/ (API clients)
│   │   └── store/ (State management)
└── v3/ (Nuevo - Vue 3 + Vite + Modern Stack)
    ├── package.json (Vue 3 + modern dependencies)
    ├── vite.config.ts (or .js)
    ├── src/
    │   ├── main.ts (entry point)
    │   ├── components/ (PrimeVue + custom components)
    │   ├── pages/ (Inertia pages)
    │   ├── router/ (Vue Router config, if not using Inertia's default routing)
    │   ├── stores/ (Pinia stores)
    │   ├── plugins/ (Vue plugins: i18n, PrimeVue)
    │   ├── layouts/ (App layout components)
    │   ├── services/ (API services)
    │   ├── utils/ (utilities: dayjs, etc.)
    │   └── assets/ (images, etc.)
    └── styles/
        ├── globals.css
        └── components.css
```

### Controladores y Rutas
- Similar a la arquitectura actual, los controladores de Laravel servirán las vistas de Inertia.

## Objetivos de la Migración

### Objetivos Principales
1. **Unificar frontend** a una única base moderna (Vue 3 + Vite).
2. **Modernizar experiencia de usuario** con Vue 3, PrimeVue y animaciones.
3. **Mantener compatibilidad** con la API existente.
4. **Preservar funcionalidad** durante la transición incremental.
5. **Mejorar mantenibilidad** y desarrollo futuro con un stack moderno.

### Beneficios Esperados
- **Developer Experience**: Mejor autocompletado y refactoring con Vue 3 Composition API.
- **Performance**: Vite ofrece compilación y HMR ultrarrápidos; PrimeVue es optimizado.
- **UX**: Componentes UI consistentes y accesibles con PrimeVue, animaciones fluidas.
- **Maintainability**: Código más predecible y testeable con Pinia y FormKit.
- **Internationalization**: Soporte nativo para múltiples idiomas con vue-i18n.
- **Forms**: Validación robusta y declarativa con FormKit.
- **Date Handling**: Manejo eficiente de fechas con Day.js.

## Plan de Migración Detallado

### Fase 1: Preparación e Infraestructura (Semanas 1-3)

#### 1.1 Configuración de InertiaJS 2 y Stack Moderno (Vue 3)
```bash
# Instalar dependencias de InertiaJS para Vue 3
composer require inertiajs/inertia-vue3

# Agregar v3 al workspace principal (package.json) si se usa
# Agregar "resources/assets/v3" al array de workspaces

# Instalar dependencias completas para v3
cd resources/assets/v3
npm install vue @vitejs/plugin-vue vue-router primevue
npm install pinia
npm install @formkit/vue
npm install vue-i18n
npm install dayjs
npm install framer-motion # Instalar para usar 'motion-vue'
npm install -D @vitejs/plugin-vue-jsx # Si se requiere JSX

# Comandos de desarrollo para v3
npm run dev    # Servidor de desarrollo con Vite
npm run build  # Build de producción
```

#### 1.2 Configuración de Vite para Vue 3
```typescript
// resources/assets/v3/vite.config.ts
import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import vue from '@vitejs/plugin-vue' // Plugin para Vue 3
// import vueJsx from '@vitejs/plugin-vue-jsx' // Si se usa JSX

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/assets/v3/src/main.ts'], // Punto de entrada principal
      refresh: true,
    }),
    vue({
      // Opciones de configuración para Vue 3
      // template: {
      //   transformAssetUrls: {
      //     base: null,
      //     includeAbsolute: false,
      //   },
      // },
    }),
    // vueJsx(), // Habilitar si se usa JSX
  ],
  resolve: {
    alias: {
      '@': '/resources/assets/v3/src',
    },
  },
})
```

#### 1.3 Configuración de vue-i18n
```typescript
// resources/assets/v3/src/plugins/i18n.ts
import { createI18n } from 'vue-i18n'
import enLocale from '@/locales/en.json' // Cargar archivos JSON de traducción
import esLocale from '@/locales/es.json'

const messages = {
  en: {
    ...enLocale,
    // Mergear otras traducciones como 'accounts', 'transactions', etc.
  },
  es: {
    ...esLocale,
    // Mergear otras traducciones
  },
}

const i18n = createI18n({
  locale: 'en', // Idioma por defecto
  fallbackLocale: 'en',
  messages,
})

export default i18n
```
*   **Locales**: Crear `resources/assets/v3/src/locales/en.json` y `es.json` con las traducciones.

#### 1.4 Configuración de Pinia Stores
```typescript
// resources/assets/v3/src/stores/appStore.ts
import { defineStore } from 'pinia'

interface AppState {
  user: User | null
  preferences: UserPreferences
  isLoading: boolean
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    user: null,
    preferences: {
      theme: 'light',
      currency: 'USD',
      dateFormat: 'YYYY-MM-DD',
      language: 'en',
    },
    isLoading: false,
  }),
  actions: {
    setUser(user: User | null) {
      this.user = user;
    },
    updatePreferences(preferences: Partial<UserPreferences>) {
      this.preferences = { ...this.preferences, ...preferences };
    },
    setLoading(loading: boolean) {
      this.isLoading = loading;
    },
  },
  // Persistencia opcional con persist middleware
  // persist: true,
});

// Ejemplo de otro store para cuentas
interface AccountState {
  accounts: Account[]
  // ... other account related state and actions
}

export const useAccountsStore = defineStore('accounts', {
  state: (): AccountState => ({
    accounts: [],
  }),
  actions: {
    async loadAccounts() {
      // Lógica para fetch de cuentas vía API
      // const response = await axios.get('/api/v1/accounts')
      // this.accounts = response.data
    },
    // ... otras acciones
  },
});
```

#### 1.5 Configuración de PrimeVue
```typescript
// resources/assets/v3/src/plugins/primevue.ts
import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
// Importar temas si es necesario (ej. 'primevue/resources/themes/saga-blue/theme.css')
// Importar estilos de componentes si se usan individualmente.

// Idiomas para PrimeVue
import en from 'primevue/locale/en.json'
import es from 'primevue/locale/es.json'

const app = createApp({}) // Asumimos que 'app' ya está instanciado o pasamos el que corresponda

app.use(PrimeVue, {
  unstyled: true, // O false si se usa el sistema de temas de PrimeVue
  locale: {
    en,
    es,
  },
  // Configuración de temas y otros componentes
})

// Exportar la instancia de i18n si se usará globalmente
export default PrimeVue;
```
*   Configurar el tema principal en `resources/assets/v3/styles/globals.css`.

#### 1.6 Configuración de FormKit
```typescript
// resources/assets/v3/src/plugins/formkit.ts
import { defineFormKitConfig } from '@formkit/vue'
import { createProPlugin } from '@formkit/pro'
import { rootClasses } from './formkitTheme' // Archivo para clases personalizadas

// Asumiendo que tienes un tema personalizado para FormKit
// import '@formkit/themes/genesis'

const config = defineFormKitConfig({
  // plugins: [createProPlugin('', { /* Free Pro features */ })], // Opcional
  config: {
    classes: rootClasses, // Cargar clases personalizadas
  },
})

export default config
```
*   Definir `rootClasses` en `resources/assets/v3/src/plugins/formkitTheme.ts` para integrar con Tailwind CSS.

#### 1.7 Integración de motion-vue (framer-motion para Vue)
- Instalar `framer-motion`.
- Si se usa Vue 3 con `<script setup>`, se pueden importar directamente las utilidades.
```vue
<script setup>
import { motion } from 'framer-motion'
</script>

<template>
  <motion.div
    :initial="{ opacity: 0 }"
    :animate="{ opacity: 1 }"
    :transition="{ duration: 0.3 }"
  >
    <!-- Contenido animado -->
  </motion.div>
</template>
```

#### 1.8 Estructura de Directorios Vue + Vite
```
resources/assets/v3/
├── package.json
├── tsconfig.json (si se usa TypeScript)
├── vite.config.ts
├── src/
│   ├── main.ts (entry point)
│   ├── App.vue (root component)
│   ├── router/
│   │   └── index.ts (Vue Router config)
│   ├── stores/
│   │   ├── index.ts (Pinia setup)
│   │   ├── appStore.ts
│   │   └── accountsStore.ts
│   ├── components/
│   │   ├── ui/ (PrimeVue components wrapped or custom)
│   │   │   ├── Btn.vue
│   │   │   ├── Card.vue
│   │   │   └── ...
│   │   ├── forms/ (FormKit integrations)
│   │   │   ├── AccountForm.vue
│   │   │   └── ...
│   │   ├── charts/ (If needed, e.g., using a Vue chart library)
│   │   └── layout/ (Layout components like Header, Sidebar, Footer)
│   ├── pages/ (Inertia pages)
│   │   ├── Dashboard/
│   │   │   └── Index.vue
│   │   ├── Accounts/
│   │   │   └── Index.vue
│   │   └── ...
│   ├── plugins/
│   │   ├── i18n.ts
│   │   ├── primevue.ts
│   │   └── formkit.ts
│   ├── services/ (API clients using axios or similar)
│   │   ├── accountService.ts
│   │   └── transactionService.ts
│   ├── utils/
│   │   ├── date.ts (Day.js utilities)
│   │   └── validation.ts (FormKit schemas or direct validation)
│   └── assets/ (images, fonts, etc.)
└── styles/
    ├── globals.css
    └── components.css
```

### Fase 2: Migración de Componentes Core (Semanas 3-10)

#### 2.1 Componentes de Layout con PrimeVue y Vue 3
- Migrar `AppLayout.vue` usando PrimeVue's `Panel`, `Toolbar`, `Breadcrumb`, etc.
- Integrar `motion-vue` para transiciones de página.

#### 2.2 Dashboard con Pinia y PrimeVue
- Crear el componente `Dashboard/Index.vue`.
- Usar `useAppStore`, `useAccountsStore` (y otros stores relevantes) para obtener datos.
- Mostrar gráficos y listas utilizando componentes de PrimeVue (ej: `Chart`, `DataTable`, `Card`).
- Implementar `motion-vue` para animaciones de elementos del dashboard.

#### 2.3 Adaptación de Controladores de Laravel
- Los controladores existentes que devuelven vistas de Blade para renderizar páginas ahora devolverán respuestas para `Inertia::render()` con el componente Vue 3.
```php
// app/Http/Controllers/DashboardController.php (Ejemplo)
use Inertia\Inertia;
use App\Models\Account; // Asegúrate de que los modelos estén disponibles

class DashboardController extends Controller
{
    public function index()
    {
        $startDate = session('start', today()->startOfMonth());
        $endDate = session('end', today()->endOfMonth());

        // Fetch data similar a los ejemplos anteriores
        $accounts = Account::getSomeAccounts(); // Usar métodos de modelo o repositorios
        $budgets = ...;
        $categories = ...;

        return Inertia::render('Dashboard/Index', [
            'accounts' => $accounts,
            'budgets' => $budgets,
            'categories' => $categories,
            'startDate' => $startDate->format('Y-m-d'),
            'endDate' => $endDate->format('Y-m-d'),
        ]);
    }
}
```

### Fase 3: Migración de Funcionalidades Principales (Semanas 9-18)

#### 3.1 Gestión de Cuentas con Vue 3, PrimeVue y FormKit
- **Componentes**: `AccountList.vue`, `AccountForm.vue`, `AccountShow.vue`.
- **State Management**: `useAccountsStore` con Pinia.
- **Formularios**: `AccountForm.vue` usando FormKit para schema y validación declarativa.
- **UI**: Componentes de PrimeVue (`DataTable`, `Dialog`, `InputText`, `Dropdown`, `Button`).
- **Funcionalidades**: CRUD, reconciliación, estados de cuenta.

#### 3.2 Gestión de Transacciones Avanzada
- **Componentes**: `TransactionList.vue`, `TransactionForm.vue`, `TransactionShow.vue`.
- **Formularios Complejos**: Manejo de splits con FormKit.
- **Animaciones**: `motion-vue` para transiciones de lista y elementos individuales.
- **Internacionalización**: `vue-i18n` para todos los textos de la interfaz.
- **Funcionalidades**: Creación, edición, división (con manejo de splits), conversión.

#### 3.3 Presupuestos y Categorías
- **Componentes**: `BudgetList.vue`, `BudgetForm.vue`, `CategoryManager.vue`.
- **Validación**: Esquemas FormKit para datos financieros.
- **Fechas**: Day.js para cálculos de periodos presupuestarios.
- **Funcionalidades**: Límites presupuestarios, reportes visuales.

#### 3.4 Reportes y Gráficos
- Integrar una librería de gráficos compatible con Vue 3 (ej: Chart.js con `vue-chartjs`, o PrimeVue's `Chart`).
- Aplicar animaciones con `motion-vue`.
- Asegurar la internacionalización del formato de números y fechas.

### Fase 4: Funcionalidades Avanzadas (Semanas 19-26)

#### 4.1 Reglas y Automatización
- **Componentes**: `RuleBuilder.vue`, `RuleExecutor.vue`.
- **State Management**: Pinia para la gestión de reglas y triggers.
- **Formularios**: FormKit para la creación de reglas complejas.

#### 4.2 Importación y Exportación
- **UI**: `ImportWizard.vue`, `ExportManager.vue` utilizando componentes de PrimeVue y FormKit.
- **Validación**: FormKit para datos de importación.

#### 4.3 Administración y Configuración
- **State Management**: `useAppStore` para preferencias de usuario.
- **Internacionalización**: Soporte multi-idioma completo en la interfaz de administración.

### Fase 5: Optimización y Testing (Semanas 27-32)

#### 5.1 Optimización de Rendimiento
- **Lazy loading** de componentes con `Suspense` de Vue 3 y `defineAsyncComponent`.
- **Code splitting** automático con Vite.
- Optimización de bundles y código.
- Uso eficiente de `motion-vue` para transiciones sin afectar el rendimiento.

#### 5.2 Testing Integral
- **Unit tests**: Componentes Vue con Vitest (integrado con Vite).
- **Integration tests**: Flujos completos utilizando Pinia stores.
- **E2E tests**: Cypress o Playwright con configuración para Vite.

#### 5.3 Migración Final
- Deshabilitar/ocultar los frontends legacy (v1, v2).
- Configurar redirecciones si es necesario.
- Limpieza de código antiguo y dependencias no utilizadas.
- Documentación completa de la nueva arquitectura.

## Diagrama de Flujo de Migración (Adaptado a Vue 3)

```mermaid
graph TD
    A[Backend Laravel] --> B{InertiaJS Middleware};
    B --> C[Frontend Vue 3 + Vite];
    C --> D[State: Pinia];
    C --> E[UI: PrimeVue];
    C --> F[Forms: FormKit];
    C --> G[Internationalization: vue-i18n];
    C --> H[Animations: motion-vue];
    C --> I[Dates: Day.js];
    C --> J[Pages: Inertia Views];

    D --> K[AppStore, AccountsStore, etc.];
    E --> L[DataTable, Dialog, Input...];
    F --> M[Declarative Validation];
    G --> N[Multi-language Support];
    H --> O[Page Transitions, List Animations];
    I --> P[Date Formatting & Calculation];

    J --> Q{Data Fetching via API};
    K --> Q;
    L --> Q;
    M --> Q;
    N --> Q;
    O --> Q;
    P --> Q;

    Q --> A; % Bidirectional data flow

    subgraph "Frontend Stack"
        C
        D
        E
        F
        G
        H
        I
        J
        K
        L
        M
        N
        O
        P
    end
```

## Consideraciones Técnicas

### Compatibilidad con API Existente
- Los endpoints API de Laravel deben ser preservados. El frontend Vue 3 interactuará con ellos, idealmente a través de servicios o stores Pinia que actúen como clientes API.

### Estado y Gestión de Datos con Pinia
```javascript
// Ejemplo: Hook personalizado para obtener y gestionar datos del dashboard
// En una tienda Pinia: resources/assets/v3/src/stores/dashboardStore.ts
import { defineStore } from 'pinia'
// import axios from 'axios' // Usar el cliente API configurado

interface DashboardData {
  totalRevenue: number;
  expenseBreakdown: any[]; // Tipar adecuadamente
  // ... other data
}

interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => ({
    data: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchDashboardData(startDate: string, endDate: string) {
      this.loading = true;
      this.error = null;
      try {
        // Asumiendo un servicio API configurado
        // const response = await apiService.get('/api/v1/dashboard', {
        //   params: { start_date: startDate, end_date: endDate }
        // });
        const response = { data: { totalRevenue: 1000, expenseBreakdown: [] } }; // Simulación
        this.data = response.data as DashboardData;
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch dashboard data';
        console.error('Dashboard fetch error:', err);
      } finally {
        this.loading = false;
      }
    },
  },
});
```

### Migración de Transiciones CSS/AlpineJS a `motion-vue`
- Las animaciones y transiciones de AlpineJS deberán ser reescritas usando la sintaxis de `framer-motion` y la integración `motion-vue`.

### Manejo de Formularios Complejos con FormKit
- FormKit permite definir esquemas de validación declarativamente, simplificando la lógica de formularios complejos. Se pueden integrar componentes PrimeVue dentro de los inputs de FormKit.

## Estrategia de Implementación

### Desarrollo por Funcionalidad y Pruebas Continuas
- Migrar funcionalidades módulo por módulo.
- Implementar pruebas unitarias (Vitest), de integración (Pinia) y E2E (Cypress/Playwright) en cada etapa.

### Preservación de Datos
- Migración cero de base de datos. La API de Laravel seguirá gestionando el acceso a los datos.

### Comunicación y Documentación
- Mantener la documentación actualizada en `CLAUDE.md` y `README.md`.
- Asegurar que todos los textos de la UI sean internacionalizados con `vue-i18n`.

## Riesgos y Mitigación

### Riesgos Identificados
- **Curva de aprendizaje**: Equipo con menos experiencia en Vue 3 o PrimeVue.
- **Complejidad de FormKit**: Configuración inicial de temas y validaciones avanzadas.
- **Migración de animaciones**: Reimplementación de transiciones de AlpineJS a `motion-vue`.

### Estrategias de Mitigación
- **Formación externa/interna**: Sesiones de capacitación para el equipo.
- **Prototipado temprano**: Probar FormKit y PrimeVue en componentes clave.
- **Documentación detallada**: Crear guías específicas para la configuración del nuevo stack.

## Métricas de Éxito

### Métricas Técnicas
- **Tiempo de carga** del frontend reducido (Vite + Vue 3).
- **Bundle size** optimizado.
- **Cobertura de tests** > 85%.
- **Zero regressions** en funcionalidades migradas.

### Métricas de Usuario
- **Satisfacción** mejorada con la nueva UI moderna.
- **Feedback positivo** sobre la usabilidad y el rendimiento.

## Conclusión

La migración a Laravel + InertiaJS + Vue 3 + Vite con un stack moderno (Pinia, PrimeVue, FormKit, vue-i18n, Day.js, motion-vue) es un avance estratégico para Firefly III. Proporcionará una base robusta, mantenible y de alto rendimiento, mejorando significativamente la experiencia del desarrollador y del usuario final.

### Beneficios Clave de la Nueva Arquitectura
- **Developer Experience**: Vue 3 Composition API, Vite, Pinia, FormKit.
- **Performance**: Vite para desarrollo y builds, PrimeVue optimizado.
- **UX Moderna**: Componentes accesibles y animaciones fluidas.
- **Mantenibilidad**: Código organizado, testeable y con fácil internacionalización.

### Stack Tecnológico Final
- **Frontend**: Vue 3 + TypeScript (opcional) + Vite
- **State Management**: Pinia
- **UI Components**: PrimeVue
- **Internationalization**: vue-i18n
- **Forms**: FormKit
- **Dates**: Day.js
- **Animations**: framer-motion (motion-vue)
- **Backend**: Laravel 12

**Timeline Estimado**: 32 semanas (aproximadamente 8 meses)
**Equipo Recomendado**: 3-4 desarrolladores full-stack con experiencia en Vue.js y Laravel.
**Riesgo General**: Medio (requiere ajustes en el equipo y configuración de frameworks).

Este plan proporciona una hoja de ruta clara y factible para la modernización de Firefly III, asegurando la continuidad de su funcionalidad y la mejora de su base tecnológica.
