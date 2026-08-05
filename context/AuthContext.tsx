"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AdminUser } from "@/types/auth";
import { fetchMe, loginAdmin, logoutAdmin } from "@/lib/api/auth";

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    try {
      const me = await fetchMe();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  async function login(email: string, password: string) {
    const loggedInUser = await loginAdmin({ email, password });
    setUser(loggedInUser);
  }

  async function logout() {
    await logoutAdmin();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refetch: loadUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}