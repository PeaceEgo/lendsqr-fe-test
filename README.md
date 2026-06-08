# Lendsqr Frontend Engineer Assessment

A React + TypeScript admin console built from the Lendsqr Figma designs. Includes authentication, a paginated Users table backed by 500 mock records, and a User Details page with localStorage caching.

## Prerequisites

- Node.js 20+
- npm 10+

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Other scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Production build (`tsc` + Vite) |
| `npm test` | Run Vitest unit tests |
| `npm run lint` | ESLint |
| `npm run preview` | Preview production build |

## Login

Use any valid email format and any password except `invalid`.

## Architecture decisions

### Stack

- **React 19 + TypeScript** — strict typing across components, hooks, and stores
- **Vite** — fast dev/build tooling
- **React Router v6** — nested routes with a protected layout shell
- **Zustand** — lightweight global state for auth, filter/pagination persistence, and user status overrides
- **SCSS (BEM)** — design tokens in `src/styles/_variables.scss`, component-scoped stylesheets

### Data layer

- **500 mock users** are generated in `src/utils/mockData.ts` and served through async service functions in `src/services/users.service.ts` (simulated network latency). This keeps the dataset self-contained without relying on a shared third-party endpoint.
- **Pagination + filtering** happen server-side in the mock service before returning a page slice, so the UI never renders all 500 rows at once.
- **User Details** reads from `localStorage` first (`useUser` hook), then refreshes from the mock API and writes back to cache.

### State handling

- **Users page**: skeleton loader, empty state (filtered/no results), error state with retry
- **User Details**: skeleton, error/not-found, empty placeholders for unimplemented tabs

### Folder structure

```
src/
├── components/   # UI, layout, feature components
├── hooks/        # Data-fetching and interaction hooks
├── pages/        # Route-level pages
├── services/     # Mock API calls
├── store/        # Zustand stores
├── styles/       # Global SCSS tokens
├── types/        # Shared TypeScript types
└── utils/        # Mock data, validation, localStorage helpers
```

### Responsiveness

- **Mobile (<768px)**: Users table becomes cards; filter panel is fullscreen; sidebar is a drawer
- **Tablet (≤1023px)**: Sidebar overlay; table scrolls horizontally
- **Desktop**: Fixed sidebar layout

### Accessibility

- Semantic landmarks (`header`, `nav`, `main`)
- Keyboard-accessible action menus (Enter/Space, arrows, Escape)
- Form labels and `aria-*` on icon-only controls
- Status badges expose `role="status"`

### Testing

Vitest + Testing Library cover login validation, auth store, filter store, and mock data generation (positive and negative cases).
