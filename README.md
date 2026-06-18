<div align="center">
  <img src="https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_light_background.png" alt="Next.js Logo" width="120" height="120" />
  <h1>Next.js Tailwind Master Template</h1>
  <p>A highly-opinionated, production-ready template for building scalable web applications.</p>
  
  <div>
    <img src="https://img.shields.io/badge/Next.js-15.x-black?style=flat-square&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-18.x-blue?style=flat-square&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-v3.4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/ESLint-8.x-4B32C3?style=flat-square&logo=eslint" alt="ESLint" />
    <img src="https://img.shields.io/badge/Prettier-3.5-F7B93E?style=flat-square&logo=prettier" alt="Prettier" />
  </div>
</div>

<hr />

## 🎯 Why this template?

Most Next.js projects start unstructured and grow into technical debt.
This template enforces:
- scalable folder structure
- consistent state management
- standardized API layer
- predictable UI composition

## ✨ Features

- **Framework**: [Next.js](https://nextjs.org/) (App Router enabled)
- **UI & Styling**: [Tailwind CSS v3](https://tailwindcss.com/) for utility-first styling, [clsx](https://github.com/lukeed/clsx) & [tailwind-merge](https://github.com/dcastil/tailwind-merge) for dynamic class handling.
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) for lightweight, fast, and scalable global state.
- **Data Fetching**: Pure [React Query (v5)](https://tanstack.com/query/latest) paired with native `fetch` for robust API communication without unnecessary abstraction layers.
- **Error Handling**: Built-in global API error toasts via [Sonner](https://sonner.emilkowal.ski/) tied directly into React Query cache boundaries.
- **Auth Architecture**: API-agnostic Auth Client Adapter for token and session state management.
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for fluid, declarative animations.
- **Data Visualization**: [Recharts](https://recharts.org/) for beautiful, responsive charts.
- **Icons**: [Lucide React](https://lucide.dev/) for crisp, consistent SVG icons.
- **Developer Experience**: Fully configured with TypeScript, strict Feature-Isolation ESLint boundaries, and Prettier.

## 🧠 Architecture

This project follows a Pure TanStack architecture:

- **Next.js** → routing + rendering
- **TanStack Query** → server state management
- **Native fetch** → HTTP layer
- **Zustand** → UI state only
- **Feature-based folder structure** → scalability

### 🌍 Environment Assumption

This frontend assumes:
- External API backend
- JWT or token-based auth (optional)
- REST or GraphQL compatible endpoints

### 🔄 Data Flow

UI Component  
→ React Query Hook  
→ Service Layer (fetch)  
→ API Server  
→ Response cached in React Query

### 📏 Architecture Rules

- React Query handles ALL server state.
- Zustand is strictly for UI state only.
- 🔐 **API Rule**: All API communication must go through `features/*/api` or `shared/lib/fetcher`. No direct fetch calls in components.
- No duplicated fetching logic.

### 🚧 Architecture Boundaries

- **Feature Isolation**: Features cannot import from other features directly. **Enforced via ESLint (`no-restricted-imports`)**.
- Shared layer is the only cross-feature dependency.
- App layer can only import features or shared.
- **Import Strategy**: Use absolute imports only (`@/app`, `@/features`, `@/shared`). Avoid relative imports beyond 1 level.

### 🧱 Design Philosophy

This template prioritizes:
- **Predictability** over abstraction.
- **Composition** over complexity.
- **Native Web APIs** over third-party wrappers.

## 🧪 Tech Decisions

- **Zustand over Redux** → Less boilerplate, faster onboarding, excellent performance.
- **Pure React Query** → Server-state separation and smart caching out of the box without the need for an external API wrapper like Axios or Apisauce.
- **Native Fetch** → Embracing modern web standards. No extra HTTP dependencies.
- **Framer Motion** → Declarative, easy-to-read animations.

## 📦 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v20+ recommended) and a package manager installed.

### Installation

1. Clone the repository and navigate into the project directory:
   ```bash
   git clone <your-repo-url>
   cd next-tailwind-template
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

### 🔐 Environment Variables

Create a `.env.local` file at the root of the project to add required environment variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app running.

## 📂 Project Structure

```text
src/
├── app/                  # Next.js routes (thin layer only)
├── features/             # Domain logic (users, auth, etc.)
└── shared/               # Reusable system-wide code
    ├── components/       # Shared UI components
    ├── hooks/            # Global custom hooks
    ├── lib/              # Core utilities and providers
    ├── stores/           # Global UI state
    └── types/            # Global TypeScript types
package.json              # Project dependencies and scripts
tsconfig.json             # TypeScript configuration
```
*(Note: If you are not using a `src/` directory, simply use the root level for these folders.)*

## 🛠️ Scripts

- `pnpm dev`: Starts the local development server.
- `pnpm build`: Builds the application for production.
- `pnpm start`: Starts the production server.
- `pnpm lint`: Runs ESLint to check for code issues.
- `pnpm format`: Formats code using Prettier.
- `pnpm type-check`: Runs TypeScript compiler checks without emitting files.
- `pnpm clean`: Cleans the `.next` and `out` build directories.
- `pnpm analyze`: Runs a bundle analyzer on build.

## 🌐 Deployment

This project is configured for easy deployment on **Vercel**, the platform created by the makers of Next.js. Simply push your code to GitHub and connect the repository in your Vercel dashboard.

---

<div align="center">
  <i>Built with ❤️ using Next.js & Tailwind CSS</i>
</div>
