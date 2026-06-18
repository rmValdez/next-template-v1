# Engineering Handbook

This handbook serves as the definitive source of truth for the architectural boundaries, design patterns, and philosophies of this SaaS-Grade Next.js Frontend Template. All engineers working on this codebase must adhere to these rules.

## 1. Architectural Philosophy

This project is an **API-Driven Frontend Shell**. It does not own backend logic.
- **Predictability over abstraction**: Code should be easy to trace without relying on hidden wrapper logic.
- **Composition over complexity**: Favor small, reusable React hooks and components over bloated "god objects."
- **Native Web APIs**: Use native `fetch` over heavy third-party wrappers like Axios or Apisauce.
- **Frontend-Only Authority**: The frontend strictly tracks and manifests session state. True security, refresh logic, and user validation are owned completely by the external API backend.

## 2. The Feature-Based Architecture

The `src/` directory is strictly divided into three distinct layers to prevent spaghetti code.

### `app/` (The Dumb Layer)
The Next.js App Router layer is responsible **only** for mapping URLs to features and establishing layouts. 
- **Rule**: `app/` pages cannot contain complex business logic or raw API fetches. They must import cleanly encapsulated views from the `features/` layer. The app layer must only compose features, never implement logic.

### `features/` (The Business Domains)
Features encapsulate specific domains of the application (e.g., `auth/`, `users/`). Each feature folder contains its own `api/`, `components/`, `hooks/`, and `stores/`.
- **Rule**: **Strict Feature Isolation**. Files inside `src/features/A` cannot import from `src/features/B`. Features can only communicate with each other by composing them at the `app/` level, or by sharing data via the `shared/` layer. This is actively enforced by ESLint.

### `shared/` (The Global Infrastructure)
Generic logic, global UI components (like Buttons or Skeletons), and global stores go here.
- **Rule**: Shared logic must have zero knowledge of any specific business domain. It must be highly generic. `shared/` must never import from `features/` or `app/`.

## 3. Data Flow & State Management

**Rule: React Query owns Server State. Zustand owns UI State.**

1. **Server State (API Data)**: Must only be fetched, cached, and synced using `@tanstack/react-query`. Components should never store raw API responses in `useState` or `Zustand`.
2. **UI State**: Things like sidebar toggles, dark mode, or modal visibility are managed by `Zustand`.
3. **Data Fetching Pipeline**: 
   `Component` → `React Query Hook (useUsers)` → `Feature API Service (users.api.ts)` → `Shared Fetcher (fetcher.ts)` → `Backend API`

## 4. Error Handling Protocol

We use a purely frontend-driven error interception model. 

- **The `fetcher`**: The native fetch wrapper automatically intercepts non-2xx responses, parses the JSON error, and `throw`s a standard Error.
- **The Global Boundary**: The React Query `QueryCache` and `MutationCache` catch these thrown errors at the top level of the application (`query-provider.tsx`).
- **The UI Reaction**: A `sonner` toast automatically displays the backend's error message to the user without any component-level `try/catch` boilerplate.

## 5. Auth Client Adapter Layer

We treat Authentication as an external service. This template provides an **Auth Client Adapter**.
- We **do not** use heavy frameworks like NextAuth.js unless OAuth is explicitly required.
- We **do not** implement backend session logic (like rotating refresh tokens automatically), as this is an architecture decision belonging to the specific backend service.
- We **do** store authentication token as provided by backend (storage method depends on implementation: memory, cookie, or localStorage) and attach it to outgoing requests. We track whether the user is logically logged in via our UI store (`auth.store.ts`), driving UI and route-based rendering states.

## 6. Code Style & Tooling

- **Imports**: Absolute imports are strictly enforced. Use `@/app`, `@/features`, and `@/shared`. Never use generic `@/` or deep relative `../../` imports that cross boundaries.
- **Linting**: The `pnpm lint` script enforces our custom `no-restricted-imports` rules.
- **TypeScript**: `pnpm type-check` acts as the definitive build-time verification. Always declare robust types for API requests and responses in their respective feature's `types.ts` file.

## 7. API Contract Assumption

All API responses are external contracts.
The frontend must never assume backend behavior beyond what is defined in the typescript definitions.
