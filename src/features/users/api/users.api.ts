import { fetcher } from "@/shared/lib/fetcher";

export type User = {
  id: string;
  name: string;
};

export const getUsers = () =>
  fetcher<User[]>("/api/users");
