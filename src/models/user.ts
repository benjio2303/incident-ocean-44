
export type UserRole = "user" | "admin";

export interface User {
  username: string;
  displayName?: string;
  email?: string;
  role: UserRole;
  password?: string;
}
