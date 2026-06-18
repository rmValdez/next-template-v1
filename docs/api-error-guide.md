# API Error Taxonomy & Handling Guide

In a SaaS-grade frontend architecture, error handling cannot be an afterthought. It must be a predictable, typed, and globally enforced system. This guide defines how we treat API errors as contracts.

## 1. The Error Contract

The frontend assumes that the backend will always return errors in a standardized JSON format. We do not try to parse random HTML or raw strings.

### The Expected Payload
All failed API responses (e.g., `400`, `401`, `403`, `404`, `500`) must return a JSON payload matching this interface:

```typescript
// src/shared/types/api.types.ts
export interface ApiErrorResponse {
  message: string;          // Human-readable message to display to the user
  code?: string;            // Machine-readable error code (e.g., "AUTH_001")
  details?: Record<string, string[]>; // Field-specific validation errors
}
```

## 2. The Interception Layer (Fetcher)

Components **should never** have to check `if (!res.ok)`. This is handled at the lowest level in `src/shared/lib/fetcher.ts`.

The `fetcher` automatically intercepts any non-2xx response, attempts to parse the `ApiErrorResponse` payload, and throws a standardized JavaScript `Error` containing the exact backend message.

```typescript
// How fetcher.ts throws errors:
if (!res.ok) {
  const errorData = await res.json().catch(() => null);
  throw new Error(errorData?.message || "An unexpected network error occurred.");
}
```

## 3. Global vs. Local Error Handling

We separate errors into two categories: **Global Fatal Errors** and **Local Recoverable Errors**.

### A. Global Handling (Toasts)
By default, the React Query `QueryCache` and `MutationCache` (configured in `query-provider.tsx`) catch all thrown fetch errors and automatically trigger a global `sonner` toast. 

**Rule**: You do not need to add `try/catch` or `.catch()` to your UI components just to show a basic error toast. The system handles it globally.

### B. Local Handling (UI States)
Sometimes, you need to show an error state directly inside the UI layout (e.g., a "Retry" button or inline text). 

**Rule**: Use React Query's `error` state. Do not use early returns if it breaks the layout; prefer displaying the error inside the component's designated boundary.

```tsx
// Correct Local Error Handling
const { data, isLoading, error } = useUsers();

if (error) {
  return (
    <div className="p-4 bg-red-50 text-red-600 rounded-md">
      <p>Error: {error.message}</p>
      <Button onClick={() => refetch()}>Try Again</Button>
    </div>
  );
}
```

## 4. Form Validation Errors (422 Unprocessable Entity)

When submitting forms (e.g., login, registration), the backend might return field-specific validation errors inside the `details` object.

**Handling Flow**:
1. Disable global toasts for this specific mutation if you want to handle it manually inline.
2. In your React Query `onError` callback, parse the `details` object.
3. Pass the field errors down to your form library (e.g., `react-hook-form`).

## 5. Security & Auth Errors (401 / 403)

- **401 Unauthorized**: Means the token is missing or invalid. The global error handler or a route guard will catch this, clear the `auth.store.ts` session, and redirect the user to the `/login` page.
- **403 Forbidden**: Means the user lacks RBAC permissions. The UI should gracefully downgrade, hiding elements the user cannot access, or display a dedicated "Access Denied" page.

---

### 🚨 Golden Rules of Error Handling
1. **Never hide errors**: If an API fails, the user must know. Let the global toast handle it by default.
2. **Never parse raw responses in UI**: All parsing belongs in `fetcher.ts`.
3. **Trust the contract**: The frontend displays what the backend says. If the error message is unhelpful, it is a backend bug, not a frontend problem.
