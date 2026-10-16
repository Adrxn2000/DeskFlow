import { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("deskflow_user");
    const storedToken = localStorage.getItem("deskflow_token");


    if (storedUser && storedToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating auth state from localStorage on mount, not derivable during render
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  async function login(email, password) {
    const { token, user: profile } = await authApi.login(email, password);
    localStorage.setItem("deskflow_token", token);
    localStorage.setItem("deskflow_user", JSON.stringify(profile));
    setUser(profile);
    return profile;
  }

  async function register(name, email, password, role) {
  const { token, user: profile } = await authApi.register(name, email, password, role);
  localStorage.setItem("deskflow_token", token);
  localStorage.setItem("deskflow_user", JSON.stringify(profile));
  setUser(profile);
  return profile;
}

  function logout() {
    localStorage.removeItem("deskflow_token");
    localStorage.removeItem("deskflow_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components -- context + hook co-located intentionally, standard pattern
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}