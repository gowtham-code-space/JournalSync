import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({
  user: null,
  login: async () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = async (credentials) => {
    // Placeholder logic – real implementation will use services/api/axios
    const mockUser = { id: 1, name: "Demo User", email: credentials.email };
    setUser(mockUser);
    localStorage.setItem("auth-user", JSON.stringify(mockUser));
    navigate("/dashboard");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth-user");
    navigate("/");
  };

  // Restore user from storage on mount
  useEffect(() => {
    const stored = localStorage.getItem("auth-user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
