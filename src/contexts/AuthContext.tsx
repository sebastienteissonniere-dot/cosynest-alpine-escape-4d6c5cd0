import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'concierge';

export interface BackofficeUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: BackofficeUser | null;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'cosynest_backoffice_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<BackofficeUser | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const login = async (email: string, role: UserRole = 'admin') => {
    // Simulate login validation
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    const newUser: BackofficeUser = {
      id: 'usr_1',
      email,
      name: role === 'admin' ? 'Propriétaire CosyNest' : 'Conciergerie Chalet',
      role,
    };
    
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
