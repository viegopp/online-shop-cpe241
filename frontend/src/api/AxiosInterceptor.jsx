import axios from "axios";
import Cookies from "js-cookie";

const API_URL =
  import.meta.env.VITE_ONLINE_SHOP_API_URL || "http://localhost:8000/api";

// สร้าง axios instance พร้อมกำหนด baseURL
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor สำหรับการส่ง request
apiClient.interceptors.request.use(
  (config) => {
    // ตรวจสอบและเพิ่ม token ในส่วนของ headers
    const token = Cookies.get("auth_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor สำหรับการรับ response
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // จัดการ error จาก response
    const originalRequest = error.config;

    // ถ้า error เป็น 401 (Unauthorized) และยังไม่ได้พยายาม retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // ถ้าเป็น 401 ให้ลบ token และ redirect ไปที่หน้า login
      Cookies.remove("auth_token");
      Cookies.remove("user_data");

      // ถ้าต้องการ redirect ไปหน้า login อัตโนมัติ สามารถทำได้ที่นี่
      // window.location.href = '/admin/login';
    }

    return Promise.reject(error);
  }
);

export default apiClient;
