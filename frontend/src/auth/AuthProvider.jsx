import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = Cookies.get("Mock_token");
    if (token) {
      setUser({ name: "Mock User" });
    }
  }, []);

  const login = (userName, password) => {
    if (userName == "admin" && password == "1234") {
      Cookies.set("Mock_token", "mocked_token_value", { expires: 1 }); // expires in 1 day
      setUser({ name: "Mock User" });
      return true;
    }
    return false;
  };

  const register = (userName, password, confirmPassword) => {
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
    setUser({ name: userName });
    return { success: true, message: "register success" };
  };

  const logout = () => {
    Cookies.remove("Mock_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
