import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("Mock_token");
    const role = Cookies.get("user_role");
    if (token) {
      setUser({ name: "Mock User", role: role || "customer" });
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    if (email === "admin" && password === "1234") {
      Cookies.set("Mock_token", "mocked_token_value", { expires: 1 }); // expires in 1 day
      Cookies.set("user_role", "admin", { expires: 1 });
      setUser({ name: "Admin User", role: "admin" });
      return { success: true, message: "login success" };
    } else if (email === "customer" && password === "1234") {
      Cookies.set("Mock_token", "mocked_token_value", { expires: 1 });
      Cookies.set("user_role", "customer", { expires: 1 });
      setUser({ name: "Customer User", role: "customer" });
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
    Cookies.set("user_role", "customer", { expires: 1 });
    setUser({ name: email, role: "customer" });
    return { success: true, message: "sign up success" };
  };

  const logout = () => {
    Cookies.remove("Mock_token");
    Cookies.remove("user_role");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
