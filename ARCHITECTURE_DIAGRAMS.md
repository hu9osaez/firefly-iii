# Diagramas de Arquitectura - Firefly III Frontends

## Diagrama de Arquitectura General

```mermaid
graph TB
    subgraph "Backend Laravel"
        A[Laravel 12] --> B[Eloquent ORM]
        B --> C[API Controllers]
        C --> D[Web Controllers]
        D --> E[HomeController]
        E --> F[Config view.layout]
        F --> G{Selección Frontend}
    end

    subgraph "Frontend v1 - Legacy"
        H[Vue.js 2.7] --> I[Laravel Mix]
        I --> J[Bootstrap 3]
        J --> K[Componentes Vue]
        K --> L[Archivos Compilados]
    end

    subgraph "Frontend v2 - Modern"
        M[Vite 7] --> N[Alpine.js 3.13]
        N --> O[Bootstrap 5]
        O --> P[Componentes Reactivos]
        P --> Q[Chart.js 4]
    end

    subgraph "Base de Datos"
        R[(MySQL/PostgreSQL/SQLite)] --> B
    end

    subgraph "API REST"
        S[API v1 Endpoints] --> C
        S --> H
        S --> M
    end

    subgraph "Cliente Web"
        T[Browser] --> L
        T --> Q
        T --> U[Session Storage]
        T --> V[Local Storage]
    end

    G --> H
    G --> M

    style A fill:#ff2d20
    style H fill:#4fc08d
    style M fill:#646cff
    style R fill:#4479a7
    style S fill:#6bd6fd
```

## Diagrama de Flujo de Rutas y Navegación

```mermaid
flowchart TD
    A[Usuario Accede] --> B{Autenticado?}
    B -->|No| C[Login/Register]
    B -->|Sí| D{Config view.layout}

    D -->|v1| E[HomeController.indexV1]
    D -->|v2| F[HomeController.indexV2]

    subgraph "Frontend v1 - Vue.js"
        E --> G[Dashboard Vue]
        G --> H[Transacciones Vue]
        H --> I[Cuentas Vue]
        I --> J[Perfil Vue]
        J --> K[Webhooks Vue]
    end

    subgraph "Frontend v2 - Alpine.js"
        F --> L[Dashboard Alpine]
        L --> M[Transacciones Alpine]
        M --> N[Cuentas Alpine]
        N --> O[Administraciones Alpine]
        O --> P[Gráficos Chart.js]
    end

    subgraph "API Común"
        Q[API v1 Endpoints] --> R[Autocomplete]
        R --> S[Models]
        S --> T[Charts]
        T --> U[Data]
    end

    G --> Q
    H --> Q
    I --> Q
    J --> Q
    K --> Q

    L --> Q
    M --> Q
    N --> Q
    O --> Q
    P --> Q

    style E fill:#4fc08d
    style F fill:#646cff
    style Q fill:#6bd6fd
```

## Diagrama de Componentes - Frontend v1

```mermaid
graph TB
    subgraph "Core Vue.js"
        A[app_vue.js] --> B[Vue I18n]
        A --> C[UIV Components]
        A --> D[Vue Runtime]
    end

    subgraph "Entradas de Build"
        E[app.js] --> F[Bootstrap]
        G[create_transaction.js] --> H[Formulario Transacciones]
        I[edit_transaction.js] --> J[Edición Transacciones]
        K[profile.js] --> L[Gestión Perfil]
    end

    subgraph "Componentes Especializados"
        M[webhooks/index.js] --> N[Webhooks List]
        O[webhooks/create.js] --> P[Webhook Create]
        Q[webhooks/edit.js] --> R[Webhook Edit]
        S[webhooks/show.js] --> T[Webhook Show]

        U[exchange-rates/index.js] --> V[Tasas Cambio List]
        W[exchange-rates/rates.js] --> X[Tasas Cambio Detail]

        Y[administrations/index.js] --> Z[Admin List]
        AA[administrations/edit.js] --> BB[Admin Edit]
    end

    subgraph "Componentes Vue"
        CC[components/] --> DD[Form Components]
        CC --> EE[Transaction Components]
        CC --> FF[Profile Components]
        CC --> GG[Webhook Components]
        CC --> HH[Exchange Rate Components]
        CC --> II[Administration Components]
    end

    A --> E
    A --> G
    A --> I
    A --> K
    A --> M
    A --> O
    A --> Q
    A --> S
    A --> U
    A --> W
    A --> Y
    A --> AA

    DD --> G
    EE --> H
    EE --> J
    FF --> L
    GG --> N
    GG --> P
    GG --> R
    GG --> T
    HH --> V
    HH --> X
    II --> Z
    II --> BB

    style A fill:#4fc08d
    style E fill:#41b883
    style M fill:#35495e
    style U fill:#ff6b6b
    style Y fill:#9b59b6
```

## Diagrama de Componentes - Frontend v2

```mermaid
graph TB
    subgraph "Core Alpine.js"
        A[boot/bootstrap.js] --> B[Alpine.js Init]
        B --> C[Event System]
        B --> D[Store Integration]
    end

    subgraph "Páginas Principales"
        E[dashboard/dashboard.js] --> F[Dashboard Principal]
        F --> G[boxes.js]
        F --> H[accounts.js]
        F --> I[budgets.js]
        F --> J[categories.js]
        F --> K[sankey.js]
        F --> L[subscriptions.js]
        F --> M[piggies.js]

        N[transactions/create.js] --> O[Crear Transacción]
        P[transactions/edit.js] --> Q[Editar Transacción]
        R[transactions/show.js] --> S[Mostrar Transacción]
        T[transactions/index.js] --> U[Listar Transacciones]

        V[accounts/index.js] --> W[Gestión Cuentas]

        X[administrations/index.js] --> Y[Listar Admin]
        Z[administrations/create.js] --> AA[Crear Admin]
        BB[administrations/edit.js] --> CC[Editar Admin]
    end

    subgraph "Sistema de Estado"
        DD[store/set-variable.js] --> EE[Persistir Estado]
        FF[store/get-variable.js] --> GG[Recuperar Estado]
        EE --> HH[Local Storage]
        GG --> HH
    end

    subgraph "Utilidades"
        II[support/page-settings/] --> JJ[Configuración UI]
        KK[util/] --> LL[Helpers]
        MM[libraries/] --> NN[Librerías Personalizadas]
    end

    subgraph "Gráficos Chart.js"
        OO[Chart.js Registry] --> PP[Line Charts]
        OO --> QQ[Bar Charts]
        OO --> RR[Pie Charts]
        OO --> SS[Sankey Charts]
    end

    A --> E
    A --> N
    A --> P
    A --> R
    A --> T
    A --> V
    A --> X
    A --> Z
    A --> BB

    DD --> F
    FF --> F

    II --> F
    KK --> F
    MM --> F

    OO --> K
    OO --> G

    style A fill:#77c1d2
    style E fill:#646cff
    style N fill:#41b883
    style V fill:#9b59b6
    style X fill:#e74c3c
    style DD fill:#f39c12
    style OO fill:#ff6b6b
```

## Diagrama de Proceso de Build

```mermaid
graph TB
    subgraph "Frontend v1 - Laravel Mix"
        A[package.json] --> B[npm install]
        B --> C[Laravel Mix Config]
        C --> D{Comando Build}
        D -->|development| E[Webpack Dev Build]
        D -->|production| F[Webpack Prod Build]
        D -->|watch| G[Webpack Watch]

        E --> H[resources/assets/v1/build/]
        F --> H
        G --> H

        H --> I[public/v1/js/]
    end

    subgraph "Frontend v2 - Vite"
        J[package.json] --> K[npm install]
        K --> L[Vite Config]
        L --> M{Comando Build}
        M -->|dev| N[Vite Dev Server]
        M -->|build| O[Vite Prod Build]

        N --> P[HMR - Hot Module Replacement]
        P --> Q[Browser - Dev]

        O --> R[public/v2/]
    end

    subgraph "Características Build v1"
        S[Vue 2.7] --> T[Vue Loader]
        U[Bootstrap 3] --> V[Sass Compilation]
        W[jQuery] --> X[Bundle Optimization]
        Y[Vue I18n] --> Z[Internationalization]
    end

    subgraph "Características Build v2"
        AA[Alpine.js] --> BB[ES Modules]
        CC[Bootstrap 5] --> DD[Modern CSS]
        EE[Chart.js] --> FF[Tree Shaking]
        GG[i18next] --> HH[Dynamic Imports]
    end

    C --> S
    C --> U
    C --> W
    C --> Y

    L --> AA
    L --> CC
    L --> EE
    L --> GG

    style A fill:#ff6b6b
    style J fill:#646cff
    style E fill:#41b883
    style N fill:#77c1d2
    style H fill:#9b59b6
    style R fill:#e74c3c
```

## Diagrama de Integración Backend-Frontend

```mermaid
graph LR
    subgraph "Backend Laravel"
        A[Routes/web.php] --> B[HomeController]
        B --> C[index Method]
        C --> D{config view.layout}
        D -->|v1| E[indexV1]
        D -->|v2| F[indexV2]

        G[JavascriptController] --> H[variables]
        G --> I[accounts]
        G --> J[currencies]
        G --> K[variablesV2]

        L[API v1 Controllers] --> M[Autocomplete]
        L --> N[Models]
        L --> O[Charts]
        L --> P[Data]
    end

    subgraph "Frontend v1"
        Q[Vue Components] --> R[API Calls]
        R --> L

        S[JavaScript Assets] --> T[Dynamic Data]
        T --> H
        T --> I
        T --> J
    end

    subgraph "Frontend v2"
        U[Alpine Components] --> V[API Calls]
        V --> L

        W[JavaScript Assets] --> X[Dynamic Data]
        X --> K
    end

    subgraph "Vistas Blade"
        Y[views/index.blade.php] --> Z{Layout Selection}
        Z -->|v1| AA[v1 Assets]
        Z -->|v2| BB[v2 Assets]

        AA --> S
        BB --> W
    end

    E --> Y
    F --> Y

    style A fill:#ff2d20
    style Q fill:#4fc08d
    style U fill:#77c1d2
    style Y fill:#f39c12
    style L fill:#6bd6fd
```

## Diagrama de Gestión de Estado

```mermaid
graph TB
    subgraph "Frontend v1 - Vue.js State"
        A[Vue Components] --> B[Component Data]
        B --> C[Props]
        B --> D[Local State]

        E[Vuex Store] --> F[Global State]
        F --> G[Mutations]
        F --> H[Actions]

        I[Session Storage] --> J[Persistent Data]
        J --> K[User Preferences]
        K --> L[UI Settings]
    end

    subgraph "Frontend v2 - Alpine.js State"
        M[Alpine Components] --> N[Component Data]
        N --> O[Reactive Properties]
        N --> P[Local Methods]

        Q[Custom Store] --> R[set-variable.js]
        Q --> S[get-variable.js]
        R --> T[Persist State]
        S --> U[Retrieve State]

        V[Local Storage] --> W[Persistent Variables]
        W --> X[User Settings]
        X --> Y[App Configuration]
    end

    subgraph "Backend State"
        Z[Laravel Session] --> AA[User Session]
        AA --> BB[Auth State]
        BB --> CC[Permissions]

        DD[Database] --> EE[User Data]
        EE --> FF[Accounts]
        EE --> GG[Transactions]
        EE --> HH[Preferences]
    end

    A --> Z
    M --> Z

    I --> V

    style A fill:#4fc08d
    style M fill:#77c1d2
    style E fill:#35495e
    style Q fill:#f39c12
    style Z fill:#ff2d20
    style DD fill:#4479a7
```

## Resumen de Tecnologías por Frontend

### Frontend v1 - Tecnologías Legacy
- **Framework:** Vue.js 2.7
- **Build Tool:** Laravel Mix (Webpack)
- **CSS Framework:** Bootstrap 3
- **State Management:** Vuex
- **Internationalization:** Vue I18n
- **Icons:** Font Awesome 4
- **Charts:** Chart.js (integrado)

### Frontend v2 - Tecnologías Modernas
- **Framework:** Alpine.js 3.13
- **Build Tool:** Vite 7
- **CSS Framework:** Bootstrap 5
- **State Management:** Custom Store
- **Internationalization:** i18next
- **Icons:** Font Awesome Free
- **Charts:** Chart.js 4 + Sankey

### Tecnologías Compartidas
- **Backend:** Laravel 12
- **API:** REST API v1
- **Database:** Eloquent ORM
- **Authentication:** Laravel Sanctum
- **Testing:** PHPUnit + Jest

## Conclusión de Arquitectura

La arquitectura de Firefly III demuestra una evolución cuidadosa desde tecnologías legacy hacia soluciones modernas, manteniendo la compatibilidad y permitiendo una migración gradual. La coexistencia de v1 y v2 proporciona flexibilidad para diferentes necesidades y preferencias de los usuarios.

Los diagramas muestran cómo ambos frontends se integran eficientemente con el backend Laravel, compartiendo la misma API pero utilizando enfoques diferentes para la interfaz de usuario y la gestión de estado. Esta arquitectura híbrida asegura la estabilidad mientras se adoptan tecnologías modernas.