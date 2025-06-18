# TARKOMPA

Frontend moderno para visualizar datos de **Escape from Tarkov** usando la API pública de [Tarkov.dev](https://tarkov.dev).

## 🎯 Propósito

Aplicación web gaming con estética militar para consultar información esencial de EFT: mapas, jefes, spawn rates, munición, armaduras y datos tácticos.

## ⚡ Stack Tecnológico

- **Runtime**: [Bun](https://bun.sh) - Runtime ultra-rápido para JS/TS
- **Framework**: [React](https://react.dev) + TypeScript
- **Routing**: [TanStack Router](https://tanstack.com/router) - Enrutado con type-safety completo
- **Build Tool**: [Vite](https://vitejs.dev) - Bundler optimizado
- **UI Framework**: [Shadcn/ui](https://ui.shadcn.com) + [Tailwind CSS](https://tailwindcss.com)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query) - Gestión de estado server
- **GraphQL**: [GraphQL Request](https://github.com/jasonkuhrt/graphql-request) - Cliente GraphQL liviano
- **API**: [Tarkov.dev GraphQL API](https://api.tarkov.dev) - Datos oficiales de EFT

## 🛠️ Developer Experience

- **Linting/Formatting**: [Biome](https://biomejs.dev) - Herramienta única para lint + format
- **Git Hooks**: [Husky](https://typicode.github.io/husky) - Pre-commit y pre-push automáticos
- **Type Safety**: TypeScript en modo `strict` con validación completa
- **Hot Reload**: Desarrollo con recarga instantánea

## 🚀 Instalación

```bash
# Instalar dependencias
bun install

# Iniciar desarrollo
bun dev

# Verificar calidad de código
bun check

# Ejecutar tests
bun test
```

La aplicación estará disponible en [http://localhost:3001](http://localhost:3001)

## 📁 Estructura

```
tarkompa/
├── apps/web/           # Aplicación React
│   ├── src/api/        # Hooks y queries de Tarkov API
│   ├── src/components/ # Componentes UI reutilizables
│   ├── src/routes/     # Páginas con TanStack Router
│   └── src/lib/        # Utilidades
├── CLAUDE.md           # Guías de desarrollo
└── biome.json          # Configuración de linting
```

## 🎮 Características

- **Mapas**: Lista completa con spawn rates de jefes y datos tácticos
- **Munición**: Comparación de daño, penetración y balística
- **Armaduras**: Niveles de protección y estadísticas
- **Tema Gaming**: Diseño oscuro con acentos naranjas EFT
- **Responsive**: Optimizado para desktop y mobile
- **Performance**: Cache inteligente y rate limiting

## 📜 Licencia

MIT License - ver [LICENSE](LICENSE)

---

Creado con ❤️ por **Ozmah**