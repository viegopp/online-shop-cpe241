import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("Mock_token");
    if (token) {
      setUser({ name: "Mock User" });
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    if (email == "admin" && password == "1234") {
      Cookies.set("Mock_token", "mocked_token_value", { expires: 1 }); // expires in 1 day
      setUser({ name: "Mock User" });
      return { success: true, message: "login success" };
    }
    return { success: false, message: "invalid credentials" };
  };

  const signup = (email, password, confirmPassword) => {
    if (password !== confirmPassword) {
      return { success: false, message: "passwords do not match" };
    }

    if (password.length < 6) {
      return {
        success: false,
        message: "password must be at least 6 characters",
      };
    }

    Cookies.set("Mock_token", "mocked_token_value", { expires: 1 });
    setUser({ name: email });
    return { success: true, message: "sign up success" };
  };

  const logout = () => {
    Cookies.remove("Mock_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
