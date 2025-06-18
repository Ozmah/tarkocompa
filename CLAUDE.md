# Claude.md para el Proyecto "tarkompa"

Este documento contiene las reglas, estándares y configuraciones para el proyecto "tarkompa". DEBES seguir estas guías para mantener la consistencia y calidad del código.

## 1. Información del Proyecto

- **Nombre:** tarkompa
- **Objetivo:** Frontend para consumir y visualizar datos de la API pública de Escape From Tarkov
- **Stack Principal:** TypeScript, TanStack Router, Vite (a través de Bun), Biome
- **Framework Base:** better-t-stack
- **UI Framework:** Shadcn/ui con Tailwind 4
- **Tema:** Gaming/Militar con estética de Escape From Tarkov
- **API Principal:** Tarkov.dev GraphQL API

## 2. Configuración del Entorno

- **Runtime Principal:** Bun. DEBES usar `bun` para instalar dependencias, ejecutar scripts y servir la aplicación en desarrollo
- **Runtime de Testing:** Node.js. Las herramientas de testing (Vitest, Playwright) se ejecutan sobre Node.js por compatibilidad. La invocación de los scripts de test, sin embargo, se hace a través de `bun`
- **Gestor de Paquetes:** Bun. Usa `bun install` para añadir o actualizar dependencias. NO uses `npm` o `yarn` para la gestión de paquetes

## 3. Comandos de Desarrollo

- `bun dev`: Inicia el servidor de desarrollo con hot-reloading
- `bun build`: Compila y empaqueta la aplicación para producción
- `bun preview`: Sirve el build de producción localmente para previsualización
- `bun test`: Ejecuta la suite de tests unitarios e de integración con Vitest
- `bun test:e2e`: Ejecuta la suite de tests end-to-end con Playwright
- `bun lint`: Ejecuta el linter de Biome para detectar errores y malas prácticas
- `bun format`: Formatea todo el código del proyecto usando Biome
- `bun check`: Ejecuta `lint` y `format` en modo de comprobación (sin aplicar cambios)

**IMPORTANTE:** Los hooks de Git (`pre-commit`, `pre-push`) ejecutarán `bun check` y `bun test` automáticamente.

## 4. Estructura de Archivos

La estructura sigue las convenciones de `better-t-stack` y TanStack Router:

- `/src/api`: Lógica para interactuar con la API de Escape From Tarkov. Contiene hooks de fetching, tipos de datos de la API, etc.
    - `/src/api/queries`: Queries GraphQL específicos y hooks personalizados
    - `/src/api/types`: Tipos TypeScript generados desde la API
    - `/src/api/fragments`: Fragmentos GraphQL reutilizables
    - `/src/api/client`: Configuración del cliente GraphQL
- `/src/components`: Componentes de UI reusables (ej. `Button`, `Card`, `Table`)
    - `/src/components/ui`: Componentes base de Shadcn/ui
    - `/src/components/gaming`: Componentes customizados con tema gaming
    - `/src/components/tarkov`: Componentes específicos para datos de EFT
- `/src/hooks`: Hooks de React personalizados que no están relacionados con fetching de datos
- `/src/routes`: Componentes que definen las rutas de la aplicación, gestionados por TanStack Router. Cada archivo aquí es una página o layout
- `/src/lib` (o `/src/utils`): Funciones de utilidad genéricas
- `/src/types`: Definiciones de tipos y interfaces globales para la aplicación
- `/src/styles`: Archivos CSS y configuraciones de Tailwind

## 5. Estándares de Código

- **Lenguaje:** TODO el código debe ser escrito en **TypeScript** con el modo `strict` activado en `tsconfig.json`
- **Formato y Linting:** **Biome** es la ÚNICA fuente de verdad. La configuración está en `biome.json`. No se permiten deshabilitaciones de reglas de Biome sin una justificación clara en un comentario
- **Tipado (CRÍTICO):**
    - **`interface`**: Para props de componentes React y objetos de datos complejos
        ```typescript
        // ✅ CORRECTO: Props de componente
        interface AmmoCardProps {
          ammo: TarkovAmmo;
          onSelect: (id: string) => void;
        }
        
        // ✅ CORRECTO: Objetos de datos complejos
        interface TarkovWeapon {
          id: string;
          name: string;
          caliber: string;
        }
        ```
    - **`type`**: Para uniones, primitivos, contextos de aplicación y tipos de utilidad
        ```typescript
        // ✅ CORRECTO: Uniones
        type ItemType = 'weapon' | 'armor' | 'ammo';
        
        // ✅ CORRECTO: Primitivos
        type UserId = string;
        
        // ✅ CORRECTO: Contextos de aplicación (NUNCA usar {})
        type RouterAppContext = Record<string, never>;
        
        // ✅ CORRECTO: Tipos de utilidad
        type Partial<T> = { [P in keyof T]?: T[P] };
        ```
    - **PROHIBIDO**: NUNCA usar `{}` como tipo (anti-patrón que acepta cualquier valor)
        ```typescript
        // ❌ INCORRECTO - acepta cualquier cosa
        type BadContext = {};
        
        // ✅ CORRECTO - realmente vacío
        type GoodContext = Record<string, never>;
        ```
- **Componentes:**
    - Prefiere componentes funcionales con Hooks
    - La lógica compleja debe ser extraída a hooks personalizados (`use...`)
    - Nomenclatura: `PascalCase` para archivos de componentes (`MiComponente.tsx`)
- **Importaciones:** Usa alias de path (`@/components/...`) configurados en `tsconfig.json` para evitar rutas relativas complejas (`../../../`)

## 6. Flujo de Trabajo (Git)

- **Branching:** Modelo GitHub Flow (crear ramas desde `main` para cada feature/fix y fusionar vía PR)
- **Commits:** DEBES seguir la especificación de **Conventional Commits**
    - **Formato:** `<tipo>(<ámbito>): <descripción>`
    - **Ejemplos:**
        - `feat(api): agregar hook para obtener precios de la flea market`
        - `fix(ui): corregir alineación de items en el inventario`
        - `docs(claude): actualizar estándares de código`
        - `refactor(components): simplificar lógica del componente Table`
- **Hooks (Husky):**
    - **`pre-commit`:** Ejecuta `bun check` para asegurar que el código está formateado y sin errores de linting
    - **`pre-push`:** Ejecuta `bun test` para asegurar que todas las pruebas pasan antes de subir el código

## 7. Testing

- **Unitario/Integración:** Usa **Vitest**. Los tests deben estar colocados junto a los archivos que prueban (`*.test.ts` o `*.test.tsx`)
- **End-to-End (E2E):** Usa **Playwright** para simular interacciones de usuario en un navegador real
- **Estrategia:** Prioriza testear la lógica de negocio, los flujos críticos de usuario y las interacciones complejas. Los componentes de UI simples no requieren tests unitarios si son cubiertos por tests E2E

## 🔒 8. Seguridad - CRÍTICO

Aunque este proyecto no tiene autenticación, la seguridad sigue siendo una prioridad:

- **NUNCA INCLUIR SECRETOS:** BAJO NINGUNA CIRCUNSTANCIA se deben comitear al repositorio claves de API (incluso si son públicas y "gratuitas"), tokens, contraseñas o cualquier tipo de credencial. Utiliza variables de entorno (`.env`) si alguna vez fuera necesario
- **VALIDACIÓN DE ENTRADAS:** Sanea y valida CUALQUIER entrada del usuario (ej. texto en un campo de búsqueda) para prevenir ataques de Cross-Site Scripting (XSS)
- **RATE LIMITING (CLIENT-SIDE):** La API pública tiene un rate limit generoso, pero para ser buenos ciudadanos de la web y mejorar la resiliencia de nuestra UI, DEBEMOS considerar implementar una estrategia de rate limiting en el cliente para las llamadas a la API
    - **Implementación Sugerida:** Utiliza un enfoque como **Token Bucket** o **Sliding Window** para controlar la frecuencia de las peticiones que se envían desde el cliente. Esto previene enviar ráfagas de llamadas, por ejemplo, en un campo de autocompletar
- **DEPENDENCIAS SEGURAS:** Revisa y actualiza las dependencias regularmente usando `bun update` para proteger el proyecto contra vulnerabilidades conocidas

## 🎨 9. Diseño de Interfaz (UI) - CRÍTICO

### Identidad Visual

- **Estilo:** Gaming/Militar con estética de Escape From Tarkov
- **Tema:** Oscuro con acentos naranjas vibrantes
- **Target:** Jugadores hardcore de EFT que buscan información precisa

### Paleta de Colores (OKLCH - Tailwind 4)

```css
/* Backgrounds */
--color-background: oklch(15.47% 0.001 90); /* #0c0c0d - Fondo principal */
--color-background-secondary: oklch(21.84% 0.002 90); /* #1a1a1c - Cards, modales */
--color-background-tertiary: oklch(29.81% 0.004 90); /* #2d2d30 - Headers, navs */

/* Foregrounds */
--color-foreground: oklch(90.67% 0 0); /* #e0e0e0 - Texto principal */
--color-foreground-secondary: oklch(70.58% 0 0); /* #a0a0a0 - Texto secundario */

/* Primary - Acento naranja (EFT theme) */
--color-primary: oklch(70.59% 0.235 289.43); /* #ff7a00 - Acento principal */
--color-primary-dark: oklch(64.61% 0.21 290.16); /* #e56a00 - Hover states */

/* Borders */
--color-border: oklch(41.05% 0.006 90); /* #4a4a4f - Bordes */
```

### Tipografía

- **Headings/Logo:** Orbitron (efecto sci-fi gaming)
- **UI General:** Roboto (legibilidad óptima)
- **Datos Técnicos:** JetBrains Mono (stats, códigos)

### Componentes Base

- **Framework:** Shadcn/ui como base
- **Customización:** Crear variantes gaming específicas
- **Cards:** Fondo `background-secondary`, bordes con hover `primary/50`
- **Buttons:** Transiciones suaves, glow effect para primary

### Responsive Design

- **Enfoque:** Desktop First (común en gaming)
- **Breakpoints:** 1920px+ (experiencia completa) → Mobile (adaptación)
- **Grid:** 1-2-3-4 columns según breakpoint

### Accesibilidad - OBLIGATORIO

- **Contraste:** TODOS los colores DEBEN cumplir WCAG 2.1 AA mínimo
- **Focus:** Ring consistente con color primary
- **ARIA:** Labels apropiados en iconos sin texto
- **Semantic HTML:** Jerarquía correcta de headings

### Animaciones

- **Timing:** 150ms hover, 300ms transiciones, 500ms page transitions
- **Hover Effects:** `translateY(-2px)`, border color change, sombra aumentada
- **Performance:** Preferir `transform` y `opacity`

## 📡 10. API de Tarkov.dev - CRÍTICO

### Información Base de la API

- **Endpoint GraphQL:** `https://api.tarkov.dev/graphql`
- **Playground:** `https://api.tarkov.dev/` (para testing y exploración)
- **Tipo:** API GraphQL pública sin autenticación
- **Rate Limiting:** Generoso pero DEBES implementar rate limiting del lado cliente
- **CORS:** Habilitado para llamadas desde navegador
- **Uptime:** 99.9%+ (infraestructura Cloudflare)

### Estructura de Tipos Principales - DEBES CONOCER

#### Items (Base para todos los objetos)

```typescript
interface Item {
	id: string;
	bsgId?: string;
	name: string;
	normalizedName?: string;
	shortName?: string;
	description?: string;
	weight?: number;
	width: number;
	height: number;
	iconLink?: string;
	avg24hPrice?: number;
	basePrice?: number;
	types: ItemType[];
	categories: ItemCategory[];
	sellFor?: ItemPrice[];
	buyFor?: ItemPrice[];
	properties?: ItemProperties;
}
```

#### Weapons (Extiende Item)

- Caliber, ergonomics, fireRate, recoil
- defaultAmmo, compatibleAmmo
- presets, conflictingItems

#### Ammo (Municiones)

- damage, penetrationPower, armorDamage
- fragmentationChance, ricochetChance
- ballistics por distancia

#### Armor (Armaduras)

- class (1-6), durability, material
- speedPenalty, turnPenalty, ergoPenalty
- zones de protección

#### Maps, Tasks, Traders, Crafts, Barters

### Patrones de Query OBLIGATORIOS

#### 1. Uso de Fragmentos GraphQL

```typescript
// SIEMPRE usa fragmentos para reutilizar campos comunes
const BASIC_ITEM_FRAGMENT = `
  fragment BasicItemInfo on Item {
    id
    name
    shortName
    iconLink
    avg24hPrice
    wikiLink
  }
`;

const WEAPON_STATS_FRAGMENT = `
  fragment WeaponStats on Weapon {
    caliber
    ergonomics
    fireRate
    recoilVertical
    recoilHorizontal
  }
`;
```

#### 2. Queries Específicas y Optimizadas

```typescript
// ✅ CORRECTO: Query específica
const SEARCH_WEAPONS_QUERY = `
  query SearchWeapons($name: String!) {
    items(name: $name, type: gun) {
      ...BasicItemInfo
      ...WeaponStats
    }
  }
  ${BASIC_ITEM_FRAGMENT}
  ${WEAPON_STATS_FRAGMENT}
`;

// ❌ INCORRECTO: Query demasiado amplia
const ALL_ITEMS_QUERY = `
  query GetAllItems {
    items {
      # Todos los campos sin filtros
    }
  }
`;
```

#### 3. Filtros Inteligentes

```typescript
// Usa filtros específicos para reducir payload
const queries = {
	weapons: "items(type: gun)",
	ammo: "items(type: ammo)",
	armor: "items(type: armor)",
	searchByName: "items(name: $searchTerm)",
	byCategory: "items(categoryNames: $categories)",
};
```

### Estrategias de Cache OBLIGATORIAS

#### TanStack Query Configuration

```typescript
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// Precios cambian frecuentemente
			staleTime: 5 * 60 * 1000, // 5 minutos
			cacheTime: 10 * 60 * 1000, // 10 minutos

			// Datos estáticos (armas, armaduras)
			staleTime: 30 * 60 * 1000, // 30 minutos
			cacheTime: 60 * 60 * 1000, // 1 hora

			refetchOnWindowFocus: false,
			retry: 3,
		},
	},
});
```

#### Cache Keys Específicos

```typescript
// DEBES usar keys específicos y consistentes
const queryKeys = {
	items: {
		all: ["items"] as const,
		search: (term: string) => ["items", "search", term] as const,
		byType: (type: ItemType) => ["items", "type", type] as const,
		byId: (id: string) => ["items", "detail", id] as const,
	},
	market: {
		prices: ["market", "prices"] as const,
		fleaMarket: ["market", "flea"] as const,
	},
	maps: ["maps"] as const,
	traders: ["traders"] as const,
};
```

### Manejo de Errores CRÍTICO

#### Error Types Específicos

```typescript
interface TarkovApiError {
	type: "network" | "graphql" | "rate_limit" | "unknown";
	message: string;
	graphqlErrors?: GraphQLError[];
}

// DEBES implementar retry logic con backoff exponencial
const retryConfig = {
	retries: 3,
	retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
	retryCondition: (error: TarkovApiError) => error.type === "network" || error.type === "rate_limit",
};
```

#### Error Boundaries Específicos

```typescript
// Crea error boundaries específicos para cada sección
const AmmoDataErrorBoundary: React.FC = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={<AmmoLoadingError />}
      onError={(error) => logTarkovApiError('ammo', error)}
    >
      {children}
    </ErrorBoundary>
  );
};
```

### Rate Limiting Cliente OBLIGATORIO

#### Implementación Token Bucket

```typescript
class TarkovApiRateLimiter {
	private tokens: number;
	private maxTokens: number = 100;
	private refillRate: number = 10; // tokens por segundo
	private lastRefill: number = Date.now();

	canMakeRequest(): boolean {
		this.refillTokens();
		if (this.tokens >= 1) {
			this.tokens--;
			return true;
		}
		return false;
	}

	private refillTokens(): void {
		const now = Date.now();
		const timePassed = (now - this.lastRefill) / 1000;
		this.tokens = Math.min(this.maxTokens, this.tokens + timePassed * this.refillRate);
		this.lastRefill = now;
	}
}
```

### Naming Conventions para API

#### Hooks Personalizados

```typescript
// DEBES seguir esta nomenclatura
const useTarkovItems = () => {
	/* búsqueda general */
};
const useTarkovWeapons = () => {
	/* solo armas */
};
const useTarkovAmmo = () => {
	/* solo munición */
};
const useTarkovMarketPrices = () => {
	/* precios mercado */
};
const useTarkovItemSearch = (query: string) => {
	/* búsqueda específica */
};
```

#### Tipos de Datos

```typescript
// Prefijo Tarkov para tipos específicos de la API
type TarkovItem = {
	/* ... */
};
type TarkovWeapon = {
	/* ... */
};
type TarkovAmmo = {
	/* ... */
};
type TarkovApiResponse<T> = {
	/* ... */
};
type TarkovQueryOptions = {
	/* ... */
};
```

#### Componentes de Visualización

```typescript
// Nomenclatura específica para componentes de datos
const ItemCard: React.FC<{ item: TarkovItem }> = ({ item }) => {
	/* ... */
};
const WeaponStatsDisplay: React.FC<{ weapon: TarkovWeapon }> = ({ weapon }) => {
	/* ... */
};
const AmmoComparisonTable: React.FC<{ ammo: TarkovAmmo[] }> = ({ ammo }) => {
	/* ... */
};
const MarketPriceChart: React.FC<{ data: PriceData[] }> = ({ data }) => {
	/* ... */
};
```

### Performance API CRÍTICO

#### Debounce para Búsquedas

```typescript
// DEBES implementar debounce en campos de búsqueda
const useDebounce = (value: string, delay: number) => {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => clearTimeout(handler);
	}, [value, delay]);

	return debouncedValue;
};

// Uso en componentes de búsqueda
const ItemSearch: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const debouncedSearch = useDebounce(searchTerm, 300);

	const { data } = useTarkovItemSearch(debouncedSearch);
	// ...
};
```

#### Lazy Loading y Paginación

```typescript
// Para listas grandes, DEBES implementar virtualización
const ItemList: React.FC = () => {
  return (
    <VirtualizedList
      itemCount={items.length}
      itemSize={120}
      renderItem={({ index, style }) => (
        <div style={style}>
          <ItemCard item={items[index]} />
        </div>
      )}
    />
  );
};
```

### Monitoring y Logs REQUERIDO

#### Métricas de API

```typescript
// DEBES trackear estas métricas
interface ApiMetrics {
	requestCount: number;
	errorRate: number;
	averageResponseTime: number;
	rateLimitHits: number;
	cacheHitRate: number;
}

// Log específico para errores de API
const logTarkovApiError = (endpoint: string, error: TarkovApiError) => {
	console.error("[Tarkov API Error]", {
		endpoint,
		type: error.type,
		message: error.message,
		timestamp: new Date().toISOString(),
	});
};
```

## 🧪 11. Testing UI

### Visual Regression

- Componentes en todos los breakpoints
- Estados hover/focus/active
- Contraste de colores

### Herramientas

- **Automatizado:** axe-core
- **Manual:** Navegación por teclado, screen readers

### Testing API

```typescript
// DEBES mockear la API en tests
const mockTarkovApi = {
	items: jest.fn(),
	weapons: jest.fn(),
	ammo: jest.fn(),
};

// Test específicos para cada endpoint
describe("TarkovAPI", () => {
	it("should handle item search correctly", () => {
		// Test implementation
	});

	it("should retry on network errors", () => {
		// Test retry logic
	});

	it("should respect rate limits", () => {
		// Test rate limiting
	});
});
```

## 📊 12. Performance - CRÍTICO

### Optimizaciones Requeridas

- **Images:** Usar Next.js Image component, WebP format, lazy loading
- **Bundle:** Tree-shake FontAwesome icons, code splitting por rutas
- **Animations:** Usar `will-change` solo cuando necesario
- **API Calls:** Implementar cache agresivo y debouncing

### Métricas a Monitorear

- **API Response Time:** < 500ms promedio
- **Bundle Size:** < 500kb initial load
- **Cache Hit Rate:** > 80% en datos estáticos
- **Rate Limit Usage:** < 70% del límite disponible

## 📁 13. Convenciones de Naming

### Componentes

- **PascalCase:** `AmmoCard.tsx`, `StatDisplay.tsx`
- **Gaming prefix:** `GamingButton`, `GamingTable` para variantes
- **UI base:** En `/components/ui/` (Shadcn)
- **Gaming customs:** En `/components/gaming/`
- **Tarkov específicos:** En `/components/tarkov/`

### CSS Classes

- **Prefijos:** `.tarkov-` para estilos específicos del tema
- **Utilidades:** `.gaming-` para patrones reutilizables
- **EFT específicos:** `.eft-` para elementos únicos del juego

### API y Hooks

- **Hooks:** `useTarkov...` para hooks de API
- **Types:** `Tarkov...` para tipos específicos
- **Components:** `...Card`, `...Display`, `...Table` para visualización de datos

## 🚀 14. Build y Deploy

### Build Process

- **Comando:** `bun build`
- **Output:** Optimizado para CDN
- **Assets:** Compresión automática de imágenes y CSS

### Environment Variables

- **Development:** `.env.local`
- **Production:** Variables en plataforma de deploy
- **NUNCA comitear:** Archivos `.env` con datos sensibles

---

## ⚠️ NOTAS CRÍTICAS

1. **TODOS los colores DEBEN definirse en OKLCH** para compatibilidad con Tailwind 4
2. **Shadcn/ui v4 es OBLIGATORIO** - no usar versiones anteriores
3. **Tema oscuro es PRIMARY** - no implementar modo claro hasta solicitud específica
4. **Performance gaming es CRÍTICA** - optimizar para conexiones variables
5. **Accesibilidad NO es opcional** - cumplir WCAG 2.1 AA mínimo
6. **Rate limiting cliente es REQUERIDO** - ser buenos ciudadanos de la API pública
7. **API de Tarkov.dev es LA ÚNICA FUENTE** - no usar otras APIs sin justificación
8. **Cache inteligente es OBLIGATORIO** - diferentes estrategias según tipo de dato
9. **Error handling robusto es CRÍTICO** - retry logic y fallbacks siempre
10. **Fragmentos GraphQL son OBLIGATORIOS** - reutilizar campos comunes

**Actualiza este documento cuando añadas nuevos componentes, patterns, endpoints o standards al proyecto.**
