import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import instance from "../api/axios";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapSession = async () => {
      try {
        const res = await instance.get("/auth/session");
        setUser(res.data?.user || null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrapSession();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await instance.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed on server:", error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};
