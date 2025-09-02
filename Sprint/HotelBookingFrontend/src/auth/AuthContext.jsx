import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api/client";
import toast from "react-hot-toast";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) return JSON.parse(savedUser);
    return null;
  });
  const [loading, setLoading] = useState(false);

  // revalidate token on refresh
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        logout();
      }
    } catch {
      setUser(null);
    }
  }, [token]);

  // ------------------------
  // LOGIN
  // ------------------------
  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });

      const token = data?.data?.token;
      const userFromApi = data?.data?.user;

      if (!token || !userFromApi) throw new Error("Invalid login response");

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userFromApi));
      setToken(token);
      setUser(userFromApi);

      toast.success("Welcome back!");
      return { ok: true, user: userFromApi };
    } catch (e) {
      const msg = e?.response?.data?.message || "Login failed";
      toast.error(msg);
      return { ok: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // ------------------------
  // REGISTER
  // ------------------------
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", { name, email, password });

      if (data.success) {
        toast.success("Account created, please login.");
        return { ok: true, data: data.data };
      } else {
        toast.error(data.message || "Registration failed");
        return { ok: false };
      }
    } catch (e) {
      const msg = e?.response?.data?.message || "Registration failed";
      toast.error(msg);
      return { ok: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // ------------------------
  // LOGOUT
  // ------------------------
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    toast("Logged out");
  };

  const value = useMemo(
    () => ({ token, user, loading, login, register, logout }),
    [token, user, loading]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
