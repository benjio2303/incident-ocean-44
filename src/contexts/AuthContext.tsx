import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export type UserRole = "user" | "admin" | null;

// Define our admin users
const ADMIN_USERS = [
  { username: "ofek", password: "Aa123456", role: "admin" as UserRole },
  { username: "amit", password: "Aa123456", role: "admin" as UserRole },
  { username: "engineer", password: "Aa123456", role: "admin" as UserRole },
  { username: "denis", password: "Aa123456", role: "admin" as UserRole },
];

interface User {
  username: string;
  role: UserRole;
  // Add these fields that are being used elsewhere
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
    // Check if it's one of our admin users
    const adminUser = ADMIN_USERS.find(
      (user) => user.username.toLowerCase() === username.toLowerCase() && user.password === password
    );

    if (adminUser) {
      // This is an admin user
      setUser({ 
        username, 
        role: adminUser.role,
        displayName: username,
        email: `${username}@example.com`
      });
      setRole(adminUser.role);
      setIsAuthenticated(true);
      
      // Store in session storage for persistence
      sessionStorage.setItem("username", username);
      sessionStorage.setItem("role", adminUser.role || "");
      sessionStorage.setItem("isAuthenticated", "true");
      
      toast({
        title: "Login Successful",
        description: `Welcome ${username}! You are logged in as ${adminUser.role}.`,
      });
      
      navigate("/admin/dashboard");
    } else if (username && password) {
      // For non-admin users
      setUser({ 
        username, 
        role: selectedRole || "user",
        displayName: username,
        email: `${username}@example.com`
      });
      setRole(selectedRole || "user");
      setIsAuthenticated(true);
      
      // Store in session storage for persistence
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
    
    // Clear session storage
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("isAuthenticated");
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    
    navigate("/login");
  };

  // Check for existing session on mount
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
