
import { UserRole } from "@/contexts/AuthContext";

export interface User {
  username: string;
  displayName?: string;
  email?: string;
  role: UserRole;
  password?: string;
}
