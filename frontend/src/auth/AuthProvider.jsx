import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import apiClient from "../api/AxiosInterceptor"; // ใช้ apiClient แทน axios โดยตรง

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ตรวจสอบ token จาก cookies
    const token = Cookies.get("auth_token");
    if (token) {
      // ดึงข้อมูลผู้ใช้จาก cookies แทนการเรียก API ใหม่ทุกครั้ง
      const userData = JSON.parse(Cookies.get("user_data") || "{}");
      if (userData && userData.admin_id) {
        setUser(userData);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // เรียก API login จาก backend
      const response = await apiClient.post(`/admin/login`, {
        email,
        password,
      });

      if (response.data.success) {
        const { token, ...userData } = response.data.data;

        // เก็บข้อมูลใน cookies
        Cookies.set("auth_token", token, { expires: 1 }); // หมดอายุใน 1 วัน
        Cookies.set("user_data", JSON.stringify(userData), { expires: 1 });

        setUser(userData);
        return {
          success: true,
          message: "Login successful",
          role: userData.role,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Login failed",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      return { success: false, message: errorMessage };
    }
  };

  const signup = async (
    email,
    password,
    confirmPassword,
    firstName,
    lastName
  ) => {
    // สำหรับตอนนี้ให้เป็น mock ไว้ก่อน เนื่องจากไม่มี API signup ใน backend ที่ให้มา
    if (password !== confirmPassword) {
      return { success: false, message: "Passwords do not match" };
    }

    if (password.length < 8) {
      return {
        success: false,
        message: "Password must be at least 8 characters",
      };
    }

    // TODO: เชื่อม API signup เมื่อมี endpoint พร้อม
    return {
      success: false,
      message: "Signup functionality not implemented yet",
    };
  };

  const logout = () => {
    // ลบ token และข้อมูลผู้ใช้
    Cookies.remove("auth_token");
    Cookies.remove("user_data");
    setUser(null);
  };

  // สร้างฟังก์ชั่นสำหรับเพิ่ม token ใน header ของ request
  const getAuthHeader = () => {
    const token = Cookies.get("auth_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        signup,
        getAuthHeader,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
