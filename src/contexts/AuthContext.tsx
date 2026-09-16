import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'admin' | 'concierge';

export interface BackofficeUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  token?: string;
}

interface AuthContextType {
  user: BackofficeUser | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'cosynest_backoffice_user';
const TOKEN_KEY = 'cosynest_backoffice_token';

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

  const login = async (email: string, password = '', role: UserRole = 'admin'): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth.php?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.user) {
        const newUser: BackofficeUser = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role as UserRole,
          token: data.token,
        };
        setUser(newUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
        if (data.token) {
          localStorage.setItem(TOKEN_KEY, data.token);
        }
        return { success: true };
      }

      // If network/offline or local fallback (e.g. dev mode)
      if (data && data.error) {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.warn('Mode hors-ligne ou fallback API:', err);
    }

    // Local fallback for quick dev
    const fallbackUser: BackofficeUser = {
      id: role === 'admin' ? 'usr_admin' : 'usr_concierge',
      email: email || (role === 'admin' ? 'contact@chaletcosynest.fr' : 'concierge@chaletcosynest.fr'),
      name: role === 'admin' ? 'Propriétaire CosyNest' : 'Conciergerie Chalet',
      role,
    };
    setUser(fallbackUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackUser));
    return { success: true };
  };

  const logout = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      fetch('/api/auth.php?action=logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      }).catch(() => {});
    }
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
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
