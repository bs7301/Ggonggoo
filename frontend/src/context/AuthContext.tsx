"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  type AuthUser,
  getToken,
  getStoredUser,
  setToken,
  setStoredUser,
  removeToken,
  removeStoredUser,
  login as apiLogin,
  register as apiRegister,
} from "@/lib/api";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    nickname: string;
    department?: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 페이지 로드 시 저장된 유저 복원
    const token = getToken();
    const storedUser = getStoredUser();
    if (token && storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await apiLogin({ email, password });
    setToken(res.token);
    setStoredUser(res.user);
    setUser(res.user);
  };

  const register = async (data: {
    email: string;
    password: string;
    nickname: string;
    department?: string;
  }) => {
    const res = await apiRegister(data);
    setToken(res.token);
    setStoredUser(res.user);
    setUser(res.user);
  };

  const logout = () => {
    removeToken();
    removeStoredUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
