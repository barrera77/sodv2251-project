// src/context/AuthContext.tsx
import React, { createContext, ReactNode, useContext, useState } from "react";

// Define the User type
export type User = {
  id: number;
  name: string;
  github: string;
  avatar: string;
  location: {
    latitude: number;
    longitude: number;
  };
};

// Define the shape of the AuthContext
type AuthContextType = {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing the context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
