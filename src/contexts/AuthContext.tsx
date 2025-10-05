
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/models/user";

// Export UserRole type
export type UserRole = "user" | "admin" | null;

// רשימת משתמשי אדמין + משתמש רגיל
const INITIAL_ADMIN_USERS = [
  { username: "ofek", password: "Aa123456", role: "admin" as UserRole, displayName: "Ofek Admin", email: "ofek@example.com" },
  { username: "amit", password: "Aa123456", role: "admin" as UserRole, displayName: "Amit Admin", email: "amit@example.com" },
  { username: "engineer", password: "Aa123456", role: "admin" as UserRole, displayName: "System Engineer", email: "engineer@example.com" },
  { username: "denis", password: "Aa123456", role: "admin" as UserRole, displayName: "Denis Admin", email: "denis@example.com" },
];

// משתמש user נוסף עם שם cyprus וסיסמה 123456
const INITIAL_USER_USERS = [
  { username: "cyprus", password: "123456", role: "user" as UserRole, displayName: "Cyprus User", email: "cyprus@example.com" },
];

interface AuthContextType {
  user: User | null;
  role: UserRole;
  login: (username: string, password: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  users: User[];
  addUser: (user: User) => void;
  updateUser: (user: Omit<User, 'password'>) => void;
  deleteUser: (username: string) => void;
  resetPassword: (username: string, newPassword: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize users from localStorage or default list
  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      try {
        setUsers(JSON.parse(storedUsers));
      } catch (error) {
        console.error("Error parsing users from localStorage:", error);
        setUsers([...INITIAL_ADMIN_USERS, ...INITIAL_USER_USERS]);
        localStorage.setItem("users", JSON.stringify([...INITIAL_ADMIN_USERS, ...INITIAL_USER_USERS]));
      }
    } else {
      setUsers([...INITIAL_ADMIN_USERS, ...INITIAL_USER_USERS]);
      localStorage.setItem("users", JSON.stringify([...INITIAL_ADMIN_USERS, ...INITIAL_USER_USERS]));
    }
  }, []);

  // Update localStorage when users change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem("users", JSON.stringify(users));
    }
  }, [users]);

  const login = (username: string, password: string) => {
    // בדיקת משתמש קיים
    const existingUser = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );

    if (existingUser) {
      setUser({
        username: existingUser.username,
        role: existingUser.role,
        displayName: existingUser.displayName || existingUser.username,
        email: existingUser.email || `${existingUser.username}@example.com`
      });
      setRole(existingUser.role);
      setIsAuthenticated(true);

      sessionStorage.setItem("username", existingUser.username);
      sessionStorage.setItem("role", existingUser.role || "");
      sessionStorage.setItem("isAuthenticated", "true");

      toast({
        title: "Login Successful",
        description: `Welcome ${existingUser.displayName || existingUser.username}! You are logged in as ${existingUser.role}.`,
      });

      navigate(existingUser.role === "admin" ? "/admin/dashboard" : "/user/dashboard");
      return;
    }

    // אפשרות fallback - כניסה כמשתמש רגיל לכל יתר האפשרויות
    if (username && password) {
      const newUser: User = {
        username,
        role: "user",
        displayName: username,
        email: `${username}@example.com`,
        password
      };

      // Add the new user
      setUsers(prev => [...prev, newUser]);
      
      setUser({
        username,
        role: "user",
        displayName: username,
        email: `${username}@example.com`
      });
      setRole("user");
      setIsAuthenticated(true);

      sessionStorage.setItem("username", username);
      sessionStorage.setItem("role", "user");
      sessionStorage.setItem("isAuthenticated", "true");

      toast({
        title: "Login Successful",
        description: `Welcome ${username}! You are logged in as user.`,
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

  const addUser = (newUser: User) => {
    // Check if username already exists
    const userExists = users.some(u => u.username.toLowerCase() === newUser.username.toLowerCase());
    if (userExists) {
      toast({
        title: "Error",
        description: "A user with this username already exists.",
        variant: "destructive",
      });
      return;
    }

    setUsers(prev => [...prev, newUser]);
    toast({
      title: "Success",
      description: `User ${newUser.username} has been added successfully.`,
    });
  };

  const updateUser = (updatedUser: Omit<User, 'password'>) => {
    setUsers(prev => prev.map(u => 
      u.username === updatedUser.username 
        ? { ...u, ...updatedUser } 
        : u
    ));
    
    // Update current user if it's the one being edited
    if (user?.username === updatedUser.username) {
      setUser({ ...user, ...updatedUser });
    }

    toast({
      title: "Success",
      description: `User ${updatedUser.username} has been updated successfully.`,
    });
  };

  const deleteUser = (username: string) => {
    // Don't allow deleting the current user
    if (user?.username === username) {
      toast({
        title: "Error",
        description: "You cannot delete your own account while logged in.",
        variant: "destructive",
      });
      return;
    }

    setUsers(prev => prev.filter(u => u.username !== username));
    
    toast({
      title: "Success",
      description: `User ${username} has been deleted.`,
    });
  };

  const resetPassword = (username: string, newPassword: string) => {
    setUsers(prev => prev.map(u => 
      u.username === username 
        ? { ...u, password: newPassword } 
        : u
    ));
    
    toast({
      title: "Success",
      description: `Password for ${username} has been reset successfully.`,
    });
  };

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    const storedRole = sessionStorage.getItem("role") as UserRole;
    const storedAuth = sessionStorage.getItem("isAuthenticated");

    if (storedAuth === "true" && storedRole && storedUsername) {
      const storedUser = users.find(u => u.username === storedUsername);
      
      setUser({
        username: storedUsername,
        role: storedRole,
        displayName: storedUser?.displayName || storedUsername,
        email: storedUser?.email || `${storedUsername}@example.com`
      });
      setRole(storedRole);
      setIsAuthenticated(true);
    }
  }, [users]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      role, 
      login, 
      logout, 
      isAuthenticated, 
      users,
      addUser,
      updateUser,
      deleteUser,
      resetPassword
    }}>
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
