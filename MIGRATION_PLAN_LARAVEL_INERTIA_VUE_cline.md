# Plan de Migración: Firefly III de Monolito a Laravel + InertiaJS 2 + Vue + TypeScript

## Resumen Ejecutivo

Este documento detalla un plan integral de migración para transformar Firefly III desde su arquitectura monolítica actual hacia una arquitectura moderna utilizando Laravel 12 como backend, InertiaJS 2 como capa de integración, Vue 3 con TypeScript como framework frontend, y un stack tecnológico moderno que incluye Pinia para state management, PrimeVue para componentes, dayjs para fechas, vue-i18n para internacionalización, FormKit para formularios, y @vueuse/motion para animaciones. La migración se realizará de forma incremental preservando la funcionalidad existente mientras se moderniza la experiencia de usuario.

## Análisis del Estado Actual

### Arquitectura Actual
- **Backend**: Laravel 12 con PHP 8.4+
- **Frontend Dual**:
  - **v1 (Legacy)**: Laravel Mix + Vue 2 + Bootstrap 3
  - **v2 (Moderno)**: Vite + AlpineJS + Bootstrap 5
- **Base de Datos**: MySQL/PostgreSQL/SQLite
- **Autenticación**: Laravel Sanctum + Passport
- **API**: REST JSON API completa

### Stack Tecnológico Propuesto para v3
- **Frontend Framework**: Vue 3 + TypeScript
- **State Management**: Pinia (lightweight stores)
- **UI Components**: PrimeVue (accessible components)
- **Date Handling**: dayjs (lightweight date library)
- **Internationalization**: vue-i18n
- **Forms**: FormKit (form generation and validation)
- **Animations**: @vueuse/motion
- **Styling**: Tailwind CSS + CSS Modules (or PrimeVue's built-in theming)
- **Build Tool**: Vite 7
- **Type Safety**: TypeScript strict mode

### Estructura de Frontend Actual
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
└── v3/ (Nuevo - Vue + TypeScript + Modern Stack)
    ├── package.json (TypeScript + modern dependencies)
    ├── tsconfig.json
    ├── vite.config.ts
    ├── src/
    │   ├── main.ts (entry point)
    │   ├── types/ (TypeScript definitions)
    │   ├── stores/ (Pinia stores)
    │   ├── components/ (PrimeVue + custom components)
    │   ├── pages/ (Inertia pages)
    │   ├── composables/ (custom composables)
    │   ├── utils/ (utilities: dayjs, formatting, etc.)
    │   ├── locales/ (i18n files)
    │   └── lib/ (configuration: theme, router, etc.)
    └── styles/
        ├── globals.css
        └── components.css
```

### Controladores y Rutas
- **140+ controladores** organizados por funcionalidad
- **Sistema de rutas complejo** con middleware de autenticación
- **Dualidad de vistas** (v1/v2) en controladores como HomeController

## Objetivos de la Migración

### Objetivos Principales
1. **Unificar frontend** eliminando la dualidad v1/v2
2. **Modernizar experiencia de usuario** con Vue 3
3. **Mantener compatibilidad** con API existente
4. **Preservar funcionalidad** durante la transición
5. **Mejorar mantenibilidad** y desarrollo futuro

### Beneficios Esperados
- **Type Safety**: Detección temprana de errores con TypeScript
- **Developer Experience**: Mejor autocompletado y refactoring
- **Performance**: Pinia es ligero y optimizado para Vue 3
- **UX**: Animaciones suaves y componentes accesibles
- **Maintainability**: Código más predecible y testeable
- **Internationalization**: Soporte nativo para múltiples idiomas
- **Modern Forms**: Validación robusta con FormKit
- **Consistent UI**: Sistema de diseño unificado con PrimeVue
- **Date Handling**: Manejo eficiente de fechas con dayjs

## Plan de Migración Detallado

### Fase 1: Preparación e Infraestructura (Semanas 1-3)

#### 1.1 Configuración de InertiaJS 2 y Stack Moderno
```bash
# Instalar dependencias de InertiaJS
composer require inertiajs/inertia-laravel

# Agregar v3 al workspace principal (package.json)
# Agregar "resources/assets/v3" al array de workspaces

# Instalar dependencias completas para v3
cd resources/assets/v3
npm install vue vue-tsc @inertiajs/vue3 @vitejs/plugin-vue laravel-vite-plugin
npm install typescript
npm install pinia
npm install primevue @primeuix/themes
npm install dayjs
npm install vue-i18n
npm install @formkit/vue @formkit/i18n
npm install @vueuse/motion
npm install clsx

# Comandos de desarrollo para v3
npm run dev    # Servidor de desarrollo
npm run build  # Build de producción
npm run type-check  # Verificación de tipos TypeScript
```

#### 1.2 Configuración de Vite para Vue + TypeScript
```typescript
// resources/assets/v3/vite.config.ts
import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/assets/v3/src/main.ts'],
      refresh: true,
    }),
    vue({
      template: {
        transformAssetUrls: {
          base: null,
          includeAbsolute: false,
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': '/resources/assets/v3/src',
    },
  },
})
```

#### 1.3 Configuración de TypeScript
```json
// resources/assets/v3/tsconfig.json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "sourceMap": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "lib": ["ESNext", "DOM"],
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### 1.4 Middleware de Inertia
```php
// app/Http/Middleware/HandleInertiaRequests.php
class HandleInertiaRequests extends Middleware
{
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
            ],
        ])
    }
}
```

#### 1.5 Configuración de Pinia Stores
```typescript
// resources/assets/v3/src/stores/appStore.ts
import { defineStore } from 'pinia'

interface AppState {
  user: User | null
  preferences: UserPreferences
  isLoading: boolean
  notifications: Notification[]
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
    notifications: [],
  }),
  actions: {
    setUser(user: User | null) {
      this.user = user
    },
    updatePreferences(preferences: Partial<UserPreferences>) {
      this.preferences = { ...this.preferences, ...preferences }
    },
    setLoading(isLoading: boolean) {
      this.isLoading = isLoading
    },
    addNotification(notification: Omit<Notification, 'id' | 'timestamp'>) {
      this.notifications.push({
        ...notification,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
      })
    },
    removeNotification(id: string) {
      this.notifications = this.notifications.filter((n) => n.id !== id)
    },
  },
  persist: true, // Example for pinia-plugin-persistedstate
})

// Store especializado para cuentas
interface AccountsState {
  accounts: Account[]
  selectedAccount: Account | null
  filters: AccountFilters
}

export const useAccountsStore = defineStore('accounts', {
  state: (): AccountsState => ({
    accounts: [],
    selectedAccount: null,
    filters: {},
  }),
  actions: {
    async loadAccounts() {
      const response = await axios.get('/api/v1/accounts')
      this.accounts = response.data
    },
    async createAccount(accountData: CreateAccountData) {
      const response = await axios.post('/api/v1/accounts', accountData)
      this.accounts.push(response.data)
    },
    async updateAccount(id: string, updates: Partial<Account>) {
      const response = await axios.put(`/api/v1/accounts/${id}`, updates)
      this.accounts = this.accounts.map(account =>
        account.id === id ? response.data : account
      )
    },
    async deleteAccount(id: string) {
      await axios.delete(`/api/v1/accounts/${id}`)
      this.accounts = this.accounts.filter(account => account.id !== id)
    },
  },
})
```

#### 1.6 Estructura de Directorios Vue + TypeScript
```
resources/assets/v3/
├── package.json (TypeScript + modern dependencies)
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.ts (entry point)
│   ├── types/
│   │   ├── account.ts
│   │   ├── transaction.ts
│   │   ├── budget.ts
│   │   ├── user.ts
│   │   └── index.ts
│   ├── stores/
│   │   ├── appStore.ts
│   │   ├── accountsStore.ts
│   │   ├── transactionsStore.ts
│   │   ├── budgetsStore.ts
│   │   └── index.ts
│   ├── components/
│   │   ├── ui/ (PrimeVue components)
│   │   │   ├── Button.vue
│   │   │   ├── Card.vue
│   │   │   ├── InputText.vue
│   │   │   └── ...
│   │   ├── forms/ (Custom form components with FormKit)
│   │   │   ├── AccountForm.vue
│   │   │   ├── TransactionForm.vue
│   │   │   └── ...
│   │   ├── charts/ (Financial charts)
│   │   └── layout/ (Layout components)
│   ├── pages/ (Inertia pages)
│   │   ├── Dashboard/
│   │   ├── Accounts/
│   │   ├── Transactions/
│   │   └── ...
│   ├── composables/
│   │   ├── useDashboardData.ts
│   │   ├── useAccounts.ts
│   │   └── ...
│   ├── utils/
│   │   ├── date.ts (dayjs utilities)
│   │   ├── currency.ts
│   │   ├── validation.ts (FormKit validation rules)
│   │   └── ...
│   ├── locales/
│   │   ├── en/
│   │   ├── es/
│   │   └── ...
│   └── lib/
│       ├── theme.ts (PrimeVue theme config)
│       ├── i18n.ts (vue-i18n config)
│       └── ...
└── styles/
    ├── globals.css
    ├── components.css
    └── tailwind.css
```

#### 1.7 Configuración de Workspace NPM

**Ventajas de la estructura con workspaces:**
- ✅ **Total independencia** de v1 y v2 durante el desarrollo
- ✅ **Dependencias específicas** sin conflictos entre versiones
- ✅ **Builds separados** para cada frontend
- ✅ **Compatibilidad total** con la arquitectura existente
- ✅ **Mantenimiento individual** por versión
- ✅ **Testing independiente** de cada frontend

```json
// package.json principal (raíz del proyecto)
{
  "scripts": {
    "postinstall": "patch-package --error-on-fail"
  },
  "workspaces": [
    "resources/assets/v1",
    "resources/assets/v2",
    "resources/assets/v3"
  ],
  "devDependencies": {
    "postcss": "^8.4.47"
  }
}
```

```json
// resources/assets/v3/package.json
{
  "name": "v3",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build --emptyOutDir",
    "type-check": "vue-tsc --noEmit",
    "postinstall": "patch-package --error-on-fail"
  },
  "dependencies": {
    "vue": "^3.0.0",
    "@inertiajs/vue3": "^1.0.0",
    "pinia": "^2.0.0",
    "primevue": "^3.0.0",
    "@primeuix/themes": "^1.0.0",
    "dayjs": "^1.0.0",
    "vue-i18n": "^9.0.0",
    "@formkit/vue": "^1.0.0",
    "@formkit/i18n": "^1.0.0",
    "@vueuse/motion": "^2.0.0",
    "clsx": "^2.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "laravel-vite-plugin": "^1.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "vue-tsc": "^1.0.0",
    "tailwindcss": "^3.0.0",
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0",
    "patch-package": "^8.0.0"
  }
}
```

### Fase 2: Migración de Componentes Core (Semanas 3-10)

#### 2.1 Layout Principal con TypeScript y PrimeVue
```vue
<!-- resources/assets/v3/src/components/layout/AppLayout.vue -->
<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import { useMotion } from '@vueuse/motion'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/appStore'
import Header from './Header.vue'
import Sidebar from './Sidebar.vue'
import Footer from './Footer.vue'
import Breadcrumbs from './Breadcrumbs.vue'

interface AppLayoutProps {
  title?: string
}

const props = defineProps<AppLayoutProps>()
const { t } = useI18n()
const appStore = useAppStore()

const layoutRef = ref<HTMLElement | null>(null)
useMotion(layoutRef, {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 300 } },
})

const contentRef = ref<HTMLElement | null>(null)
useMotion(contentRef, {
  initial: { y: 20, opacity: 0 },
  enter: { y: 0, opacity: 1, transition: { duration: 400 } },
})
</script>

<template>
  <div ref="layoutRef" :class="`app-wrapper theme-${appStore.preferences.theme}`">
    <Head :title="props.title || t('app.title')" />
    <Header />
    <Sidebar />
    <main class="app-main">
      <div class="app-content-header">
        <Breadcrumbs />
      </div>
      <div ref="contentRef" class="app-content">
        <slot />
      </div>
    </main>
    <Footer />
  </div>
</template>
```

#### 2.2 Dashboard con TypeScript y Estado Moderno
```vue
<!-- resources/assets/v3/src/pages/Dashboard/Index.vue -->
<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
import { Head } from '@inertiajs/vue3'
import { useI18n } from 'vue-i18n'
import { useAccountsStore } from '@/stores/accountsStore'
import { useDashboardData } from '@/composables/useDashboardData'
import DashboardBoxes from './components/DashboardBoxes.vue'
import AccountChart from './components/AccountChart.vue'
import BudgetChart from './components/BudgetChart.vue'
import CategoryChart from './components/CategoryChart.vue'
import AccountList from './components/AccountList.vue'
import SankeyChart from './components/SankeyChart.vue'
import Card from 'primevue/card'
import { useMotion } from '@vueuse/motion'

interface DashboardProps {
  accounts: Account[]
  budgets: Budget[]
  categories: Category[]
  startDate: string
  endDate: string
}

const props = defineProps<DashboardProps>()
const { t } = useI18n()
const accountsStore = useAccountsStore()
const { data: dashboardData, loading } = useDashboardData(props.startDate, props.endDate)

// Cargar datos adicionales si es necesario
onMounted(() => {
  accountsStore.loadAccounts()
})

const containerRef = ref<HTMLElement | null>(null)
useMotion(containerRef, {
  initial: { opacity: 0 },
  enter: {
    opacity: 1,
    transition: {
      staggerChildren: 100, // milliseconds
    },
  },
})

const itemMotion = {
  initial: { y: 20, opacity: 0 },
  enter: { y: 0, opacity: 1, transition: { duration: 400 } },
}
</script>

<template>
  <AppLayout :title="t('dashboard.title')">
    <Head :title="t('dashboard.title')" />

    <div ref="containerRef" class="space-y-6">
      <div v-motion="itemMotion">
        <DashboardBoxes
          :accounts="props.accounts"
          :start-date="props.startDate"
          :end-date="props.endDate"
          :loading="loading"
        />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div v-motion="itemMotion" class="lg:col-span-2 space-y-6">
          <Card>
            <template #title>{{ t('dashboard.account_chart') }}</template>
            <template #content>
              <AccountChart :accounts="props.accounts" />
            </template>
          </Card>

          <Card>
            <template #title>{{ t('dashboard.budget_chart') }}</template>
            <template #content>
              <BudgetChart :budgets="props.budgets" />
            </template>
          </Card>

          <Card>
            <template #title>{{ t('dashboard.category_chart') }}</template>
            <template #content>
              <CategoryChart :categories="props.categories" />
            </template>
          </Card>
        </div>

        <div v-motion="itemMotion" class="space-y-6">
          <Card>
            <template #title>{{ t('dashboard.accounts') }}</template>
            <template #content>
              <AccountList :accounts="props.accounts" />
            </template>
          </Card>
        </div>
      </div>

      <div v-motion="itemMotion">
        <Card>
          <template #title>{{ t('dashboard.cash_flow') }}</template>
          <template #content>
            <SankeyChart
              :accounts="props.accounts"
              :start-date="props.startDate"
              :end-date="props.endDate"
            />
          </template>
        </Card>
      </div>
    </div>
  </AppLayout>
</template>
```

#### 2.3 Controlador Adaptado
```php
// app/Http/Controllers/DashboardController.php
class DashboardController extends Controller
{
    public function index(): Response
    {
        $startDate = session('start', today()->startOfMonth());
        $endDate = session('end', today()->endOfMonth());

        $accounts = $this->getDashboardAccounts();
        $budgets = $this->getDashboardBudgets();
        $categories = $this->getDashboardCategories();

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

## Implementación de Tecnologías Modernas

### TypeScript para Type Safety

#### Definición de Tipos para Modelos Principales
```typescript
// resources/assets/v3/src/types/account.ts
export interface Account {
  id: string
  name: string
  type: AccountType
  balance: number
  currency: Currency
  created_at: string
  updated_at: string
}

export interface CreateAccountData {
  name: string
  type: AccountType
  currency: string
  opening_balance?: number
  opening_balance_date?: string
}

// resources/assets/v3/src/types/transaction.ts
export interface Transaction {
  id: string
  description: string
  amount: number
  date: string
  account_id: string
  category_id?: string
  budget_id?: string
  splits?: TransactionSplit[]
}

export interface TransactionSplit {
  id: string
  amount: number
  description: string
  category_id?: string
  budget_id?: string
}

// resources/assets/v3/src/types/index.ts
export * from './account'
export * from './transaction'
export * from './budget'
export * from './user'
```

#### Tipos para API Responses
```typescript
// resources/assets/v3/src/types/api.ts
export interface ApiResponse<T> {
  data: T
  meta?: {
    current_page: number
    total: number
    per_page: number
    last_page: number
  }
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    current_page: number
    total: number
    per_page: number
    last_page: number
  }
}
```

### Pinia para State Management

#### Store Centralizado de Aplicación
```typescript
// resources/assets/v3/src/stores/appStore.ts
import { defineStore } from 'pinia'

interface AppState {
  user: User | null
  preferences: UserPreferences
  isLoading: boolean
  notifications: Notification[]
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
    notifications: [],
  }),
  actions: {
    setUser(user: User | null) {
      this.user = user
    },
    updatePreferences(preferences: Partial<UserPreferences>) {
      this.preferences = { ...this.preferences, ...preferences }
    },
    setLoading(isLoading: boolean) {
      this.isLoading = isLoading
    },
    addNotification(notification: Omit<Notification, 'id' | 'timestamp'>) {
      this.notifications.push({
        ...notification,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
      })
    },
    removeNotification(id: string) {
      this.notifications = this.notifications.filter((n) => n.id !== id)
    },
  },
  persist: true, // Example for pinia-plugin-persistedstate
})
```

#### Store Especializado para Transacciones
```typescript
// resources/assets/v3/src/stores/transactionsStore.ts
import { defineStore } from 'pinia'

interface TransactionsState {
  transactions: Transaction[]
  selectedTransaction: Transaction | null
  filters: TransactionFilters
  pagination: Pagination
}

export const useTransactionsStore = defineStore('transactions', {
  state: (): TransactionsState => ({
    transactions: [],
    selectedTransaction: null,
    filters: {},
    pagination: {
      current_page: 1,
      total: 0,
      per_page: 25,
      last_page: 1,
    },
  }),
  actions: {
    async loadTransactions(filters: TransactionFilters = {}) {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString())
        }
      })

      const response = await axios.get(`/api/v1/transactions?${params}`)
      this.transactions = response.data.data
      this.pagination = response.data.meta
    },
    async createTransaction(transactionData: CreateTransactionData) {
      const response = await axios.post('/api/v1/transactions', transactionData)
      this.transactions.push(response.data)
    },
    async updateTransaction(id: string, updates: Partial<Transaction>) {
      const response = await axios.put(`/api/v1/transactions/${id}`, updates)
      this.transactions = this.transactions.map(transaction =>
        transaction.id === id ? response.data : transaction
      )
    },
    async deleteTransaction(id: string) {
      await axios.delete(`/api/v1/transactions/${id}`)
      this.transactions = this.transactions.filter(transaction => transaction.id !== id)
    },
    setSelectedTransaction(transaction: Transaction | null) {
      this.selectedTransaction = transaction
    },
    updateFilters(filters: Partial<TransactionFilters>) {
      this.filters = { ...this.filters, ...filters }
    },
  },
})
```

### PrimeVue para Componentes Accesibles

#### Tema Personalizado para Firefly III
```typescript
// resources/assets/v3/src/lib/theme.ts
// This would typically involve configuring PrimeVue's theming capabilities
// For example, using a custom preset or overriding CSS variables.
// PrimeVue themes are often imported as CSS files or configured via a JS object.

// Example of a custom PrimeVue preset (conceptual)
import Aura from '@primeuix/themes/aura'; // Base theme

export const fireflyTheme = {
  preset: Aura,
  // Customizations
  components: {
    button: {
      root: ({ props }) => ({
        class: {
          'bg-primary text-primary-foreground hover:bg-primary/90': props.severity === null,
          // ... other custom styles based on severity or other props
        }
      })
    }
  }
};

// In main.ts, you would use it like:
// app.use(PrimeVue, {
//   theme: fireflyTheme
// });
```

#### Componente de Botón Personalizado (PrimeVue)
```vue
<!-- resources/assets/v3/src/components/ui/Button.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import PrimeButton from 'primevue/button'

interface ButtonProps {
  label?: string
  icon?: string
  severity?: 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'contrast'
  outlined?: boolean
  text?: boolean
  link?: boolean
  raised?: boolean
  rounded?: boolean
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'button',
})

const buttonClass = computed(() => {
  // You can add custom classes here based on props if needed,
  // or rely on PrimeVue's built-in styling and theming.
  return {}
})
</script>

<template>
  <PrimeButton
    :label="props.label"
    :icon="props.icon"
    :severity="props.severity"
    :outlined="props.outlined"
    :text="props.text"
    :link="props.link"
    :raised="props.raised"
    :rounded="props.rounded"
    :loading="props.loading"
    :disabled="props.disabled"
    :type="props.type"
    :class="buttonClass"
  >
    <slot></slot>
  </PrimeButton>
</template>
```

### dayjs para Manejo de Fechas

#### Utilidades de Fecha para Finanzas
```typescript
// resources/assets/v3/src/utils/date.ts
import dayjs from 'dayjs'
import 'dayjs/locale/en'
import 'dayjs/locale/es'
import 'dayjs/locale/fr'
import 'dayjs/locale/de'
import relativeTime from 'dayjs/plugin/relativeTime'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(relativeTime)
dayjs.extend(isBetween)

export const financialDateUtils = {
  formatTransactionDate: (date: string, locale = 'en') =>
    dayjs(date).locale(locale).format('MMM DD, YYYY'),

  formatMonthYear: (date: string, locale = 'en') =>
    dayjs(date).locale(locale).format('MMMM YYYY'),

  getMonthRange: (date: string) => ({
    start: dayjs(date).startOf('month').format('YYYY-MM-DD'),
    end: dayjs(date).endOf('month').format('YYYY-MM-DD')
  }),

  getQuarterRange: (date: string) => ({
    start: dayjs(date).startOf('quarter').format('YYYY-MM-DD'),
    end: dayjs(date).endOf('quarter').format('YYYY-MM-DD')
  }),

  isWithinBudgetPeriod: (date: string, period: BudgetPeriod) => {
    const transactionDate = dayjs(date)
    const periodStart = dayjs(period.start_date)
    const periodEnd = dayjs(period.end_date)

    return transactionDate.isBetween(periodStart, periodEnd, 'day', '[]')
  },

  calculateAge: (date: string) => dayjs().diff(dayjs(date), 'day'),

  getRelativeDate: (date: string, locale = 'en') =>
    dayjs(date).locale(locale).fromNow()
}

export default dayjs
```

### vue-i18n para Internacionalización

#### Configuración de i18n
```typescript
// resources/assets/v3/src/lib/i18n.ts
import { createI18n } from 'vue-i18n'
import enCommon from '@/locales/en/common.json'
import enAccounts from '@/locales/en/accounts.json'
import enTransactions from '@/locales/en/transactions.json'
import enBudgets from '@/locales/en/budgets.json'
import esCommon from '@/locales/es/common.json'
import esAccounts from '@/locales/es/accounts.json'
import esTransactions from '@/locales/es/transactions.json'
import esBudgets from '@/locales/es/budgets.json'

const messages = {
  en: {
    common: enCommon,
    accounts: enAccounts,
    transactions: enTransactions,
    budgets: enBudgets,
  },
  es: {
    common: esCommon,
    accounts: esAccounts,
    transactions: esTransactions,
    budgets: esBudgets,
  },
}

const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: 'en',
  fallbackLocale: 'en',
  messages,
})

export default i18n
```

#### Archivo de Traducción Ejemplo
```json
// resources/assets/v3/src/locales/en/accounts.json
{
  "title": "Accounts",
  "create": "Create Account",
  "edit": "Edit Account",
  "delete": "Delete Account",
  "types": {
    "asset": "Asset Account",
    "expense": "Expense Account",
    "revenue": "Revenue Account",
    "cash": "Cash Account",
    "liability": "Liability Account"
  },
  "fields": {
    "name": "Account Name",
    "type": "Account Type",
    "balance": "Current Balance",
    "currency": "Currency"
  },
  "actions": {
    "reconcile": "Reconcile",
    "view_transactions": "View Transactions",
    "export": "Export"
  }
}
```

### FormKit para Formularios

#### Esquemas de Validación (FormKit)
```typescript
// resources/assets/v3/src/utils/validation.ts
// FormKit uses its own validation rules, often defined directly in the form schema or input definitions.
// For complex validation, you might integrate with a schema library like Zod or Yup,
// but FormKit has built-in rules.

// Example of FormKit validation rules
// import { createInput } from '@formkit/vue'

// export const accountInput = createInput({
//   type: 'text',
//   name: 'name',
//   label: 'Account Name',
//   validation: 'required|minLength:1',
// })

// For Zod integration with FormKit, you would use @formkit/zod plugin
// import { formKitZodPlugin } from '@formkit/zod'
// import { z } from 'zod'

// export const accountSchema = z.object({
//   name: z.string().min(1, 'Account name is required'),
//   type: z.enum(['asset', 'expense', 'revenue', 'cash', 'liability']),
//   currency: z.string().min(1, 'Currency is required'),
// })

// In formkit.config.ts:
// import { formKitZodPlugin } from '@formkit/zod'
// export default defaultConfig({
//   plugins: [formKitZodPlugin],
// })
```

#### Componente de Formulario de Cuenta (FormKit)
```vue
<!-- resources/assets/v3/src/components/forms/AccountForm.vue -->
<script setup lang="ts">
import { FormKit } from '@formkit/vue'
import Button from 'primevue/button'

interface AccountFormProps {
  initialData?: Partial<AccountFormData>
  onSubmit: (data: AccountFormData) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

const props = defineProps<AccountFormProps>()

const handleSubmit = async (data: AccountFormData) => {
  try {
    await props.onSubmit(data)
  } catch (error) {
    console.error('Error submitting form:', error)
  }
}
</script>

<template>
  <FormKit
    type="form"
    :value="props.initialData"
    @submit="handleSubmit"
    :actions="false"
  >
    <FormKit
      type="text"
      name="name"
      label="Account Name"
      validation="required|length:1"
      placeholder="Enter account name"
    />

    <FormKit
      type="select"
      name="type"
      label="Account Type"
      validation="required"
      :options="[
        { label: 'Asset Account', value: 'asset' },
        { label: 'Expense Account', value: 'expense' },
        { label: 'Revenue Account', value: 'revenue' },
        { label: 'Cash Account', value: 'cash' },
        { label: 'Liability Account', value: 'liability' },
      ]"
    />

    <div class="flex gap-4 mt-6">
      <Button label="Cancel" severity="secondary" outlined @click="props.onCancel" />
      <Button :label="props.loading ? 'Saving...' : 'Save Account'" :loading="props.loading" type="submit" />
    </div>
  </FormKit>
</template>
```

### @vueuse/motion para Animaciones

#### Animaciones para Componentes Financieros
```vue
<!-- resources/assets/v3/src/components/animations/PageTransition.vue -->
<script setup lang="ts">
import { useMotion } from '@vueuse/motion'

const pageRef = ref<HTMLElement | null>(null)
useMotion(pageRef, {
  initial: { opacity: 0, x: -20 },
  enter: { opacity: 1, x: 0, transition: { duration: 300, ease: 'easeOut' } },
  leave: { opacity: 0, x: 20, transition: { duration: 300, ease: 'easeIn' } },
})
</script>

<template>
  <div ref="pageRef">
    <slot />
  </div>
</template>

<!-- Componente para listas con animación escalonada -->
<!-- resources/assets/v3/src/components/animations/AnimatedList.vue -->
<script setup lang="ts">
import { useMotion } from '@vueuse/motion'

const listRef = ref<HTMLElement | null>(null)
useMotion(listRef, {
  initial: { opacity: 0 },
  enter: {
    opacity: 1,
    transition: {
      staggerChildren: 100, // milliseconds
    },
  },
})
</script>

<template>
  <div ref="listRef">
    <slot />
  </div>
</template>

<!-- Componente para elementos de lista individuales -->
<!-- resources/assets/v3/src/components/animations/AnimatedListItem.vue -->
<script setup lang="ts">
import { useMotion } from '@vueuse/motion'

const itemRef = ref<HTMLElement | null>(null)
useMotion(itemRef, {
  initial: { y: 20, opacity: 0 },
  enter: { y: 0, opacity: 1, transition: { duration: 300 } },
})
</script>

<template>
  <div ref="itemRef">
    <slot />
  </div>
</template>
```

### Fase 3: Migración de Funcionalidades Principales (Semanas 9-18)

#### 3.1 Gestión de Cuentas con Stack Moderno
- **Componentes**: AccountList, AccountForm, AccountShow con TypeScript
- **State Management**: Pinia store para cuentas
- **Formularios**: FormKit para form generation y validation
- **UI**: PrimeVue components con tema personalizado
- **Funcionalidades**: CRUD, reconciliación, estados de cuenta

#### 3.2 Gestión de Transacciones Avanzada
- **Componentes**: TransactionList, TransactionForm, TransactionShow
- **Formularios Complejos**: Manejo de splits con FormKit
- **Animaciones**: @vueuse/motion para transiciones
- **Internacionalización**: vue-i18n para todos los textos
- **Funcionalidades**: Creación, edición, división, conversión

#### 3.3 Presupuestos y Categorías
- **Componentes**: BudgetList, BudgetForm, CategoryManager
- **Validación**: FormKit validation rules para datos financieros
- **Fechas**: dayjs para cálculos de periodos
- **Funcionalidades**: Límites presupuestarios, reportes

#### 3.4 Reportes y Gráficos
- **Componentes**: ChartContainer, ReportBuilder
- **Integración**: Chart.js con Vue hooks/composables
- **Animaciones**: @vueuse/motion para gráficos
- **Internacionalización**: Formateo de números y fechas

### Fase 4: Funcionalidades Avanzadas (Semanas 19-26)

#### 4.1 Reglas y Automatización
- **Componentes**: RuleBuilder, RuleExecutor con TypeScript
- **State Management**: Pinia stores especializados
- **Formularios**: FormKit para reglas complejas
- **Funcionalidades**: Triggers, actions, testing

#### 4.2 Importación y Exportación
- **Componentes**: ImportWizard, ExportManager
- **UI**: PrimeVue para wizards complejos
- **Validación**: FormKit para datos de importación
- **Integración**: API existente de importación

#### 4.3 Administración y Configuración
- **Componentes**: UserManagement, SystemSettings
- **State Management**: Pinia para preferencias
- **Internacionalización**: Soporte multi-idioma completo
- **Roles**: Admin vs usuario regular

### Fase 5: Optimización y Testing (Semanas 27-32)

#### 5.1 Optimización de Rendimiento
- **Lazy loading** de componentes con defineAsyncComponent
- **Code splitting** por rutas con Vite
- **Optimización** de bundles con TypeScript
- **Performance**: @vueuse/motion optimizado

#### 5.2 Testing Integral
- **Unit tests**: Componentes Vue con TypeScript
- **Integration tests**: Flujos completos con stores Pinia
- **E2E tests**: Cypress/Playwright con TypeScript
- **Type Safety**: Verificación completa de tipos

#### 5.3 Migración Final
- **Deshabilitar** frontend legacy
- **Redirección** automática a v3
- **Cleanup** de código antiguo
- **Documentación** completa de nueva arquitectura

## Diagrama de Flujo de Migración

```mermaid
graph TD
    A[Estado Actual] --> B[Fase 1: Infraestructura Moderna]
    B --> C[Fase 2: Componentes Core + TypeScript]
    C --> D[Fase 3: Funcionalidades Principales]
    D --> E[Fase 4: Funcionalidades Avanzadas]
    E --> F[Fase 5: Optimización y Testing]
    F --> G[Estado Final]

    B1[TypeScript + Vite] --> B
    B2[Pinia Stores] --> B
    B3[PrimeVue] --> B
    B4[dayjs + vue-i18n] --> B
    B5[FormKit] --> B
    B6[@vueuse/motion] --> B

    C1[Layout Principal] --> C
    C2[Dashboard Moderno] --> C
    C3[Navegación Animada] --> C

    D1[Cuentas con TypeScript] --> D
    D2[Transacciones con Formularios] --> D
    D3[Presupuestos con Validación] --> D
    D4[Reportes Internacionalizados] --> D

    E1[Reglas Automatizadas] --> E
    E2[Importación/Exportación] --> E
    E3[Administración Multi-idioma] --> E

    F1[Testing TypeScript] --> F
    F2[Optimización Performance] --> F
    F3[Migración Final] --> F

    G[Laravel + Inertia + Vue + TypeScript + Modern Stack] --> H[✅ Migración Completada]
```

## Consideraciones Técnicas

### Compatibilidad con API Existente
- **Preservar** endpoints API actuales
- **Reutilizar** transformers y repositories
- **Mantener** autenticación Laravel Sanctum

### Estado y Gestión de Datos
```javascript
// Ejemplo: Composable personalizado para datos del dashboard
import { ref, onMounted } from 'vue'
import axios from 'axios'

function useDashboardData(startDate: string, endDate: string) {
  const data = ref(null)
  const loading = ref(true)

  onMounted(async () => {
    try {
      const response = await axios.get('/api/v1/dashboard', {
        params: { start_date: startDate, end_date: endDate }
      })
      data.value = response.data
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      loading.value = false
    }
  })

  return { data, loading }
}
```

### Migración de AlpineJS a Vue
```javascript
// AlpineJS actual (v2)
Alpine.data('accounts', () => ({
  accounts: [],
  async init() {
    this.accounts = await this.loadAccounts()
  },
  loadAccounts() {
    return axios.get('/api/v1/accounts')
  }
}))

// Equivalente Vue 3
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface Account {
  id: string
  name: string
  // ... other properties
}

const accounts = ref<Account[]>([])

onMounted(() => {
  loadAccounts()
})

const loadAccounts = async () => {
  try {
    const response = await axios.get('/api/v1/accounts')
    accounts.value = response.data
  } catch (error) {
    console.error('Error loading accounts:', error)
  }
}
</script>

<template>
  <div>
    <div v-for="account in accounts" :key="account.id">
      {{ account.name }}
    </div>
  </div>
</template>
```

### Manejo de Formularios Complejos (FormKit)
```vue
<!-- Formulario de transacción con splits -->
<script setup lang="ts">
import { ref } from 'vue'
import { FormKit } from '@formkit/vue'
import Button from 'primevue/button'

interface TransactionFormData {
  description: string
  amount: number
  splits: TransactionSplitFormData[]
}

interface TransactionSplitFormData {
  amount: number
  description: string
  category_id?: string
  budget_id?: string
}

const initialSplits: TransactionSplitFormData[] = [{ amount: 0, description: '' }]
const splits = ref<TransactionSplitFormData[]>(initialSplits)

const addSplit = () => {
  splits.value.push({ amount: 0, description: '' })
}

const removeSplit = (index: number) => {
  splits.value.splice(index, 1)
}

const handleSubmit = (data: TransactionFormData) => {
  console.log('Form submitted:', data)
  // Logic to save transaction with splits
}
</script>

<template>
  <FormKit
    type="form"
    @submit="handleSubmit"
    :actions="false"
  >
    <!-- Campos principales -->
    <FormKit
      type="text"
      name="description"
      label="Description"
      validation="required"
    />
    <FormKit
      type="number"
      name="amount"
      label="Total Amount"
      validation="required|min:0.01"
    />

    <!-- Splits dinámicos -->
    <div v-for="(split, index) in splits" :key="index" class="flex gap-2 mb-2">
      <FormKit
        type="number"
        :name="`splits[${index}].amount`"
        label="Split Amount"
        validation="required|min:0.01"
        v-model="split.amount"
      />
      <FormKit
        type="text"
        :name="`splits[${index}].description`"
        label="Split Description"
        validation="required"
        v-model="split.description"
      />
      <Button
        icon="pi pi-times"
        severity="danger"
        text
        rounded
        @click="removeSplit(index)"
        v-if="splits.length > 1"
      />
    </div>

    <Button label="Add Split" icon="pi pi-plus" text @click="addSplit" />

    <Button type="submit" label="Save Transaction" class="mt-4" />
  </FormKit>
</template>
```

## Estrategia de Implementación

### Desarrollo por Funcionalidad
1. **Módulo por módulo** en lugar de big bang
2. **Feature flags** para desarrollo progresivo
3. **Testing continuo** en cada etapa

### Preservación de Datos
- **Migración cero** de base de datos
- **Compatibilidad** total con datos existentes
- **Rollback** fácil si es necesario

### Comunicación y Documentación
- **Documentación** en tiempo real
- **Sesiones de training** para equipo
- **Feedback** continuo de usuarios beta

## Riesgos y Mitigación

### Riesgos Identificados
1. **Complejidad de formularios** de transacciones
2. **Migración de gráficos** y visualizaciones
3. **Compatibilidad** con extensiones existentes
4. **Curva de aprendizaje** del equipo

### Estrategias de Mitigación
- **Prototipado temprano** de componentes complejos
- **Testing exhaustivo** de flujos críticos
- **Comunicación proactiva** con comunidad
- **Formación gradual** del equipo

## Métricas de Éxito

### Métricas Técnicas
- **Tiempo de carga** reducido en 30%
- **Bundle size** optimizado
- **Coverage de tests** > 80%
- **Zero regressions** en funcionalidad

### Métricas de Usuario
- **Satisfacción** mejorada
- **Feedback positivo** en nueva UI
- **Adopción rápida** sin resistencia
- **Productividad** mejorada

## Conclusión

La migración de Firefly III a Laravel + InertiaJS 2 + Vue + TypeScript con un stack tecnológico moderno representa una modernización estratégica que posicionará la aplicación para el futuro. La integración de TypeScript, Pinia, PrimeVue, dayjs, vue-i18n, FormKit, y @vueuse/motion proporciona una base sólida para el desarrollo futuro mientras se mantiene la compatibilidad con la API existente.

### Beneficios Clave de la Nueva Arquitectura

- **Type Safety**: Detección temprana de errores con TypeScript en toda la aplicación
- **Developer Experience**: Mejor autocompletado, refactoring y mantenibilidad
- **Performance**: Pinia proporciona state management ligero y eficiente
- **UX Moderna**: Componentes accesibles con PrimeVue y animaciones fluidas con @vueuse/motion
- **Internacionalización**: Soporte nativo para múltiples idiomas con vue-i18n
- **Formularios Robustos**: Validación type-safe con FormKit
- **Manejo de Fechas**: Utilidades eficientes con dayjs para cálculos financieros

### Stack Tecnológico Final
- **Frontend**: Vue 3 + TypeScript + Vite
- **State Management**: Pinia con stores especializados
- **UI Components**: PrimeVue (accesibles)
- **Internationalization**: vue-i18n
- **Forms**: FormKit (form generation and validation)
- **Dates**: dayjs con plugins para finanzas
- **Animations**: @vueuse/motion
- **Styling**: Tailwind CSS + CSS Modules (or PrimeVue's built-in theming)
- **Build Tool**: Vite 7 con optimizaciones

**Timeline Total Estimado**: 32 semanas (8 meses)
**Equipo Recomendado**: 3-4 desarrolladores full-stack con experiencia en TypeScript y Vue
**Riesgo General**: Medio (mitigado por enfoque incremental y type safety)

Este plan proporciona una hoja de ruta clara y realista para transformar Firefly III en una aplicación web moderna, mantenible y preparada para el futuro, mientras se preserva su rica funcionalidad y base de usuarios existente.
