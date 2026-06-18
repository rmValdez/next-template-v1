import { ApiError, ApiErrorResponse } from "../types/api.types";

export async function fetcher<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  const res = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    if (res.status === 401 && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }

    const errorData: ApiErrorResponse = await res.json().catch(() => ({
      message: `HTTP Error: ${res.status}`,
    }));

    throw new ApiError(res.status, errorData);
  }

  return res.json();
}
