# Beginner's Guide: Building a Feature

Welcome to the team! This guide will walk you through building your very first feature in this architecture. 

Our architecture is strict, but that strictness makes your job easier. You never have to guess *where* code goes. Let's build a simple "Posts" feature.

## Step 1: Create the Feature Folder

Everything about a domain belongs in its own folder inside `src/features/`.
**Feature Ownership Rule**: Each feature is fully responsible for its API layer, hooks, components, and types. No other feature or shared code should define business logic for it.

Create a new directory for posts:
```bash
src/features/posts/
```

Inside this folder, create the standard structure:
```text
src/features/posts/
├── api/             # Where we talk to the backend
├── hooks/           # Where we connect API to React
├── components/      # The UI components for posts
└── types.ts         # TypeScript interfaces
```

## Step 2: Define Your Types

Always start by defining what your data looks like in `src/features/posts/types.ts`:

```typescript
export interface Post {
  id: string;
  title: string;
  content: string;
}
```

## Step 3: Write the API Service

Next, we need a way to fetch the data. We **never** call `fetch` directly in our UI components. Instead, we use the `fetcher` from the `shared` layer.

Create `src/features/posts/api/posts.api.ts`:

```typescript
import { fetcher } from "@/shared/lib/fetcher";
import { Post } from "../types";

export const getPosts = async () => {
  // fetcher automatically handles JSON parsing and throwing errors!
  return fetcher<Post[]>("/api/posts");
};
```

## Step 4: Create the React Query Hook

React Query handles caching, loading states, and background updates. We wrap our API call in a custom hook.

Create `src/features/posts/hooks/usePosts.ts`:

```typescript
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../api/posts.api";

export function usePosts() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });
}
```

## Step 5: Build the UI Component

Now we can consume our data safely. Since we use React Query, we don't need `useEffect` or `useState` to fetch data!

Create `src/features/posts/components/PostList.tsx`:

```tsx
import { usePosts } from "../hooks/usePosts";
import { Skeleton } from "@/shared/components/Skeleton";

export function PostList() {
  const { data: posts, isLoading, error } = usePosts();

  // 1. Handle Loading (Prefer skeleton components over early returns when layout stability matters)
  if (isLoading) return <Skeleton className="h-32 w-full" />;

  // 2. Handle Errors (Errors are handled by React Query and surfaced globally via QueryCache + toast integration)
  if (error) return <div className="text-red-500">Failed to load posts.</div>;

  // 3. Render Data
  return (
    <div className="space-y-4">
      {posts?.map((post) => (
        <div key={post.id} className="p-4 border rounded shadow-sm">
          <h2 className="font-bold">{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}
```

## Step 6: Display it in the App Layer

Finally, we need to show our feature on a page. The `src/app/` layer is "dumb"—it only mounts components from `features/` or `shared/`.

Open `src/app/page.tsx` and import your new feature:

```tsx
import { PostList } from "@/features/posts/components/PostList";

export default function HomePage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Latest Posts</h1>
      <PostList />
    </main>
  );
}
```

---

## 🎯 Important Rules to Remember

1. **No direct fetching in UI**: Always put your API calls in `features/*/api`.
2. **Absolute Imports Only**: Always use `@/features/` or `@/shared/`. Never use deep relative paths like `../../shared/components`.
3. **No Cross-Feature Imports**: `features/posts/` cannot import from `features/users/`. If they need to share something, it belongs in `shared/`.
4. **Data Ownership**: React Query owns server state. Components must never persist API data into local state unless transforming it for UI purposes.
5. **Naming Consistency**: API files must follow `*.api.ts`. Hooks must follow `use*.ts`. Components must be `PascalCase`.

You are now ready to build! 🚀
