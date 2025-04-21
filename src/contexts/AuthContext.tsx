
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export type UserRole = "user" | "admin" | null;

// רשימת משתמשי אדמין + משתמש רגיל
const ADMIN_USERS = [
  { username: "ofek", password: "Aa123456", role: "admin" as UserRole },
  { username: "amit", password: "Aa123456", role: "admin" as UserRole },
  { username: "engineer", password: "Aa123456", role: "admin" as UserRole },
  { username: "denis", password: "Aa123456", role: "admin" as UserRole },
];
// משתמש user נוסף עם שם cyprus וסיסמה 123456
const USER_USERS = [
  { username: "cyprus", password: "123456", role: "user" as UserRole },
];

interface User {
  username: string;
  role: UserRole;
  email?: string;
  displayName?: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole;
  login: (username: string, password: string, selectedRole?: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const login = (username: string, password: string, selectedRole?: UserRole) => {
    // בדיקת אדמין
    const adminUser = ADMIN_USERS.find(
      (user) => user.username.toLowerCase() === username.toLowerCase() && user.password === password
    );
    if (adminUser) {
      setUser({
        username,
        role: adminUser.role,
        displayName: username,
        email: `${username}@example.com`
      });
      setRole(adminUser.role);
      setIsAuthenticated(true);

      sessionStorage.setItem("username", username);
      sessionStorage.setItem("role", adminUser.role || "");
      sessionStorage.setItem("isAuthenticated", "true");

      toast({
        title: "Login Successful",
        description: `Welcome ${username}! You are logged in as ${adminUser.role}.`,
      });

      navigate("/admin/dashboard");
      return;
    }

    // בדיקת user ידוע מראש
    const normalUser = USER_USERS.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );
    if (normalUser) {
      setUser({
        username,
        role: normalUser.role,
        displayName: username,
        email: `${username}@example.com`
      });
      setRole(normalUser.role);
      setIsAuthenticated(true);

      sessionStorage.setItem("username", username);
      sessionStorage.setItem("role", normalUser.role || "");
      sessionStorage.setItem("isAuthenticated", "true");

      toast({
        title: "Login Successful",
        description: `Welcome ${username}! You are logged in as user.`,
      });

      navigate("/user/dashboard");
      return;
    }

    // אפשרות fallback - כניסה כמשתמש רגיל לכל יתר האפשרויות
    if (username && password) {
      setUser({
        username,
        role: selectedRole || "user",
        displayName: username,
        email: `${username}@example.com`
      });
      setRole(selectedRole || "user");
      setIsAuthenticated(true);

      sessionStorage.setItem("username", username);
      sessionStorage.setItem("role", selectedRole || "user");
      sessionStorage.setItem("isAuthenticated", "true");

      toast({
        title: "Login Successful",
        description: `Welcome ${username}! You are logged in as ${selectedRole || "user"}.`,
      });

      navigate("/user/dashboard");
    } else {
      toast({
        title: "Login Failed",
        description: "Please enter both username and password.",
        variant: "destructive",
      });
    }
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);

    sessionStorage.removeItem("username");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("isAuthenticated");

    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });

    navigate("/login");
  };

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    const storedRole = sessionStorage.getItem("role") as UserRole;
    const storedAuth = sessionStorage.getItem("isAuthenticated");

    if (storedAuth === "true" && storedRole && storedUsername) {
      setUser({
        username: storedUsername,
        role: storedRole,
        displayName: storedUsername,
        email: `${storedUsername}@example.com`
      });
      setRole(storedRole);
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
