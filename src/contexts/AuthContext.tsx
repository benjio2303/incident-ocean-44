
import React, { createContext, useState, useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export type UserRole = "user" | "admin" | null;

interface AuthContextType {
  role: UserRole;
  login: (username: string, password: string, selectedRole: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const login = (username: string, password: string, selectedRole: UserRole) => {
    // In a real app, this would validate credentials against a backend
    // For now, we'll simulate a successful login
    if (username && password) {
      setRole(selectedRole);
      setIsAuthenticated(true);
      
      // Store in session storage for persistence
      sessionStorage.setItem("role", selectedRole || "");
      sessionStorage.setItem("isAuthenticated", "true");
      
      toast({
        title: "Login Successful",
        description: `Welcome ${username}! You are logged in as ${selectedRole}.`,
      });
      
      // Redirect based on role
      if (selectedRole === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } else {
      toast({
        title: "Login Failed",
        description: "Please enter both username and password.",
        variant: "destructive",
      });
    }
  };

  const logout = () => {
    setRole(null);
    setIsAuthenticated(false);
    
    // Clear session storage
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("isAuthenticated");
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    
    navigate("/login");
  };

  // Check for existing session on mount
  React.useEffect(() => {
    const storedRole = sessionStorage.getItem("role") as UserRole;
    const storedAuth = sessionStorage.getItem("isAuthenticated");
    
    if (storedAuth === "true" && storedRole) {
      setRole(storedRole);
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ role, login, logout, isAuthenticated }}>
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
