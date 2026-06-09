# Lendsqr Live Session — Cheat Sheet

> **If they ask X → open Y.**  
> Use this during screen share. Start with the **30-second architecture pitch**, then jump to the file they care about.

---

## 30-second pitch (memorize)

> React + TypeScript + SCSS admin console. Routes in `App.tsx`. Auth in `useUserStore`. Users list state (filters, pagination) in `useUsersListStore`. Status mutations in `useUsersDataStore`. Data flows: **components → hooks → services → mockData**. User Details cache-first via `useUser` + `localStorage`. 500 records, server-side pagination/filter in mock service — UI never renders all rows.

---

## Quick file map

| Area | Primary files |
|------|----------------|
| Routes | `src/App.tsx` |
| Auth | `src/store/useUserStore.ts`, `src/services/auth.service.ts`, `src/pages/Login/Login.tsx` |
| Route guard | `src/components/ProtectedRoute/ProtectedRoute.tsx` |
| Layout | `src/components/layout/DashboardLayout/`, `Header/`, `Sidebar/` |
| Users page | `src/pages/Users/Users.tsx` |
| Table + filters + menu | `src/components/users/UsersTable/UsersTable.tsx` |
| Mobile cards | `src/components/users/UserCard/UserCard.tsx` |
| Pagination | `src/components/users/Pagination/Pagination.tsx` |
| List state | `src/store/useUsersListStore.ts` |
| Status overrides | `src/store/useUsersDataStore.ts` |
| Fetch hooks | `src/hooks/useUsers.ts`, `src/hooks/useUser.ts` |
| Mock API | `src/services/users.service.ts` |
| 500 records | `src/utils/mockData.ts` |
| Types | `src/types/user.types.ts` |
| User Details | `src/pages/UserDetails/UserDetails.tsx` |
| Detail sections | `src/pages/UserDetails/UserDetailsSections.tsx` |
| Design tokens | `src/styles/_variables.scss` |
| Tests | `src/**/*.test.ts(x)` |

---

## If they ask X → open Y

### Routing & pages

| Question | Open | What to say |
|----------|------|-------------|
| "Walk me through the routes" | `src/App.tsx` | `/login` public; `/dashboard`, `/users`, `/users/:id` wrapped in `ProtectedRoute` + `DashboardLayout` |
| "Where is the Login page?" | `src/pages/Login/Login.tsx` + `Login.scss` | Form validation, redirect if authenticated, mock auth call |
| "Where is Users?" | `src/pages/Users/Users.tsx` | Orchestrates stats, table, pagination, loading/empty/error |
| "Where is User Details?" | `src/pages/UserDetails/UserDetails.tsx` | Summary card, tabs, blacklist/activate buttons |
| "Where are detail field grids?" | `src/pages/UserDetails/UserDetailsSections.tsx` | Personal, Employment, Socials, Guarantor (2 rows) |
| "Dashboard — what does it do?" | `src/pages/Dashboard/Dashboard.tsx` | Placeholder/shell page at `/dashboard` |

### Auth

| Question | Open | What to say |
|----------|------|-------------|
| "How does login work?" | `src/pages/Login/Login.tsx` → `auth.service.ts` → `useUserStore.ts` | Validate form → `authenticateUser` (1s delay) → `login()` sets Zustand → navigate `/dashboard` |
| "What credentials work?" | `src/services/auth.service.ts` | Any valid email; any password except literal `"invalid"` |
| "How are protected routes enforced?" | `src/components/ProtectedRoute/ProtectedRoute.tsx` | Reads `isAuthenticated`; `<Navigate to="/login" />` if false |
| "Does auth survive refresh?" | `src/store/useUserStore.ts` + `src/utils/localStorage.ts` | Zustand `persist` → `lendsqr_auth` key |
| "Where is logout?" | `src/components/layout/Sidebar/Sidebar.tsx` | `logout()` + `navigate('/login')` |

### State management (Zustand)

| Question | Open | What to say |
|----------|------|-------------|
| "Why Zustand?" | `README.md` Architecture section | Lightweight; three focused stores vs one god store |
| "Why three stores?" | See table below | Auth / list UI / domain mutations — different lifecycles |
| "Where are filters stored?" | `src/store/useUsersListStore.ts` | `userFilterDraft` (editing) vs `userFilters` (applied) |
| "Why draft vs applied filters?" | `useUsersListStore.ts` lines 24–65 | Panel edits don't refetch until Filter; Reset clears both; page resets to 1 on apply |
| "Do filters persist on reload?" | `useUsersListStore.ts` persist block | Yes — `lendsqr_user_filters` in localStorage |
| "Where is pagination state?" | `useUsersListStore.ts` | `page`, `limit` (default **100**), persisted |
| "How does blacklist sync to the table?" | `src/store/useUsersDataStore.ts` | `statusOverrides` map; `applyStatusOverride` in hooks; also updates user details cache |
| "What gets persisted for status?" | `useUsersDataStore.ts` | `lendsqr_user_statuses` + per-user cache update on `updateUserStatus` |

**Store cheat sheet**

| Store | File | Holds |
|-------|------|-------|
| `useUserStore` | `store/useUserStore.ts` | `isAuthenticated`, `email` |
| `useUsersListStore` | `store/useUsersListStore.ts` | filters, draft, `page`, `limit` |
| `useUsersDataStore` | `store/useUsersDataStore.ts` | `statusOverrides`, `updateUserStatus` |

### Data & API

| Question | Open | What to say |
|----------|------|-------------|
| "Where do the 500 users come from?" | `src/utils/mockData.ts` line 81 | `Array.from({ length: 500 })` — unique IDs, varied status/org |
| "How is the mock API shaped?" | `src/services/users.service.ts` | Async functions with 200–300ms delay; not HTTP (self-contained) |
| "How does pagination work?" | `mockData.ts` `getMockUsersPage` + `users.service.ts` | Filter full set → slice by `(page-1)*limit` → return `{ data, total }` |
| "How does filtering work?" | `mockData.ts` `getMockUsersPage` | Client-side filter on mock array before slice (simulates server) |
| "What's the User type?" | `src/types/user.types.ts` | Table fields + details fields + `guarantors: [Guarantor, Guarantor]` |
| "Default page size mismatch?" | `useUsersListStore` (100) vs `users.service.ts` (10) | Page always passes `limit` from store; service default is fallback only — align if asked to fix |

### Hooks (data fetching)

| Question | Open | What to say |
|----------|------|-------------|
| "How does Users fetch work?" | `src/hooks/useUsers.ts` | `useEffect` on params; `cancelled` flag; merges `statusOverrides`; `retry()` |
| "Why hooks not Zustand for fetch?" | `useUsers.ts`, `useUser.ts` | Side effects + loading/error belong in hooks; stores hold shared state |
| "Cache-first on User Details?" | `src/hooks/useUser.ts` | Read `localStorage` → show immediately → fetch → write cache |
| "What if fetch fails but cache exists?" | `useUser.ts` catch block | Shows cached user, no error UI |
| "localStorage keys?" | `src/utils/localStorage.ts` | `lendsqr_auth`, `lendsqr_user_filters`, `lendsqr_user_statuses`, `lendsqr_user_{id}` |

### Users table & filters

| Question | Open | What to say |
|----------|------|-------------|
| "Where is the table?" | `src/components/users/UsersTable/UsersTable.tsx` | Desktop table + mobile `UserCard` list |
| "Where are column definitions?" | `UsersTable.tsx` `columns` const | Organization, Username, Email, Phone, Date Joined, Status |
| "Where is the filter panel?" | `UsersTable.tsx` bottom — `users-table__filter-panel` | 6 fields; positioned absolute desktop, fullscreen mobile |
| "Filter panel positioning?" | `UsersTable.tsx` `positionFilterPanel` | Measures header button rect vs table container |
| "Mobile vs desktop table?" | `UsersTable.scss` | `__desktop` hidden <768px; `__mobile-card-list` shown |
| "Three-dot action menu?" | `UsersTable.tsx` + `useActionMenuKeyboard.ts` | Fixed position desktop (avoids overflow clip); overlay backdrop |
| "Status badge clipped?" | `UsersTable.scss` `data-col='status'` + `StatusBadge.scss` | Column min-width 120px; badge fixed widths per status |
| "Change default items per page" | `useUsersListStore.ts` `limit` + `Pagination.tsx` options | Store default + `<select>` options |
| "Add a new column" | `user.types.ts`, `mockData.ts`, `UsersTable.tsx`, `UserCard.tsx` | Type → data → column header + cell → mobile card field |
| "Wire header search" | `Header.tsx` (currently noop) + `useUsers.ts` `search` param | Search exists in service types; header form needs state + debounce |

### User Details

| Question | Open | What to say |
|----------|------|-------------|
| "Blacklist / Activate buttons" | `UserDetails.tsx` | Calls `updateUserStatus` from `useUsersDataStore` |
| "Avatar fallback?" | `UserDetails.tsx` `UserAvatar` component | Photo from mock; gray circle + person icon on missing/error |
| "Profile card layout (tier/balance)" | `UserDetails.scss` `__summary-top` | Flex, max-width 880px; identity/tier/account sections |
| "Guarantor two rows?" | `UserDetailsSections.tsx` `GuarantorSection` | Maps 2 guarantors, 4 cols each, divider between rows |
| "Empty tabs?" | `UserDetails.tsx` | Non–General Details tabs → `EmptyState` placeholder |

### UI components & states

| Question | Open | What to say |
|----------|------|-------------|
| "Loading state — Users" | `Users.tsx` + `TableSkeleton.tsx` | Skeleton when `loading && !data` (first load) |
| "Empty state — Users" | `Users.tsx` + `EmptyState.tsx` | Zero results after filter |
| "Error state — Users" | `Users.tsx` + `ErrorState.tsx` | Message + retry → `useUsers.retry` |
| "Loading — User Details" | `DetailsSkeleton.tsx` | When `loading && !user` |
| "Not found user" | `UserDetails.tsx` | `EmptyState` when `!user` after load |
| "Status badge colors/sizes" | `StatusBadge.scss` + `_variables.scss` | Figma pills: 30px height, fixed widths, rgba backgrounds |
| "Date picker (not native)" | `DatePicker/DatePicker.tsx` | Custom calendar for filter date field |
| "Stat cards on Users" | `constants/userStats.ts` + `StatCard.tsx` | Static metrics; not wired to live data |

### Layout & responsive

| Question | Open | What to say |
|----------|------|-------------|
| "Sidebar on mobile?" | `Sidebar.scss` + `DashboardLayout.tsx` | Drawer + overlay ≤1023px; hamburger in `Header.tsx` |
| "Breakpoints?" | `src/styles/_variables.scss` | `$mobile: 768px`, `$tablet: 1024px` |
| "Login layout / logo position?" | `Login.scss` | Left column 48px padding; logo offset to match Figma 97/106 |
| "Nav items config?" | `navConfig.ts` | Sidebar links; Users highlights for `/users` and `/users/:id` |

### Accessibility

| Question | Open | What to say |
|----------|------|-------------|
| "Keyboard menu?" | `hooks/useActionMenuKeyboard.ts` | Enter/Space, arrows, Escape, Home/End; `role="menu"` |
| "Status for screen readers?" | `StatusBadge.tsx` | `role="status"` |
| "Icon-only buttons?" | `Header.tsx`, `UsersTable.tsx`, `UserCard.tsx` | `aria-label` on menu, filter, search, notifications |
| "Form labels?" | `Login.tsx`, `Input.tsx` | `aria-label` on email/password |

### Testing

| Question | Open | What to say |
|----------|------|-------------|
| "What tests exist?" | `src/**/*.test.ts(x)` | 6 files, 22 tests — login, validation, stores, mockData, useUser |
| "Login tests?" | `pages/Login/Login.test.tsx` | Render, validation, show password, success redirect, auth failure |
| "Filter store tests?" | `store/useUsersListStore.test.ts` | Apply, reset, sync draft, pagination persist |
| "What's NOT tested?" | — | UsersTable, Pagination, ProtectedRoute, useUsers hook, E2E |
| "How would you test blacklist → table?" | `useUsersDataStore` + `applyStatusOverride` | Store unit test or RTL with shared Zustand state |

### Styling

| Question | Open | What to say |
|----------|------|-------------|
| "Design tokens?" | `src/styles/_variables.scss` | Colors, fonts, breakpoints, status colors |
| "Why SCSS + BEM?" | Any `*.scss` | Assessment requirement; `block__element--modifier` |
| "Global styles?" | `src/styles/global.scss` | Base resets, font import |

### Config & deploy

| Question | Open | What to say |
|----------|------|-------------|
| "Build setup?" | `vite.config.ts`, `package.json` | Vite + React + `tsc -b` |
| "SPA routing on Vercel?" | `vercel.json` | Rewrite all routes to `index.html` |
| "Entry point?" | `src/main.tsx` | Renders `App` |

---

## Live coding — where to edit

| Task | Files to touch (in order) |
|------|---------------------------|
| Default page size 10 → 20 | `useUsersListStore.ts` → `Pagination.tsx` |
| Change Active badge color | `_variables.scss` → `StatusBadge.scss` |
| Add User Details field | `user.types.ts` → `mockData.ts` → `UserDetailsSections.tsx` |
| Add table column | `user.types.ts` → `mockData.ts` → `UsersTable.tsx` (+ `UserCard.tsx` mobile) |
| Real-time search by name | `Header.tsx` → new store field or local state → `Users.tsx` → `useUsers` → `mockData.ts` filter |
| Blacklist updates table badge | Already works — show `useUsersDataStore.ts` + `useUsers.ts` `applyStatusOverride` |
| Debounce filters | `UsersTable.tsx` or new `useDebouncedValue` hook |
| Sort by Date Joined | `mockData.ts` sort → `UsersTable.tsx` header click + store sort field |
| Add MSW / real HTTP | New handlers → change `users.service.ts` to `fetch()` |
| New unit test | Mirror `useUser.test.ts` or `useUsersListStore.test.ts` |

---

## Data flow diagrams (verbal)

### Users list load
```
Users.tsx
  → useUsersListStore (page, limit, filters)
  → useUsers(params)
  → users.service.fetchUsers
  → mockData.getMockUsersPage (filter + slice)
  → applyStatusOverride per row
  → UsersTable renders page
```

### Blacklist flow
```
UserDetails.tsx button
  → useUsersDataStore.updateUserStatus(id, 'Blacklisted')
  → statusOverrides[id] in Zustand + localStorage
  → cached user details updated if exists
  → navigate back to Users
  → useUsers refetches / re-applies overrides
  → StatusBadge shows Blacklisted
```

### User Details load
```
UserDetails.tsx
  → useUser(id)
  → getItem(localStorage) — instant if cached
  → fetchUserById(id)
  → setItem(cache)
  → applyStatusOverride
```

---

## Honest tradeoffs (say these confidently)

1. **Mock service vs HTTP** — Self-contained 500 records; no shared mockapi endpoint. Production → MSW or real API.
2. **No React Query** — Custom hooks + cancellation sufficient for assessment; RQ for cache invalidation/stale-time in prod.
3. **UsersTable ~680 lines** — Would split filter panel + hooks in a refactor.
4. **Header search is visual only** — Intentional gap; `search` param already in service layer.
5. **Stat cards are static** — Not computed from the 500 users.
6. **Auth is client-only** — Fine for demo; not production security.

---

## Red flags to avoid in the session

- Don't say "I'd use Redux" without explaining why Zustand fits here.
- Don't claim all 500 rows render at once — pagination happens in `getMockUsersPage`.
- Don't confuse `userFilterDraft` with `userFilters` — know when each is used.
- If asked about tests, admit gaps (table, hooks) and describe what you'd add.

---

## 5-minute demo order (if they say "walk us through the app")

1. `App.tsx` — routes
2. `Login.tsx` — login flow
3. `Users.tsx` — states + composition
4. `useUsersListStore.ts` — filters/pagination
5. `users.service.ts` + `mockData.ts` — 500 + pagination
6. `UsersTable.tsx` — filter panel + action menu (brief)
7. `useUser.ts` — cache-first details
8. `useUsersDataStore.ts` — blacklist sync
9. `StatusBadge.scss` — design fidelity
10. One test file — `Login.test.tsx` or `useUsers.test.ts`

---

*Last updated to match codebase as of assessment submission.*
