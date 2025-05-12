"use client";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import InputFieldAuth from "./InputFieldAuth";
import RememberMeCheckbox from "../forms/RememberMeCheckbox";
import Button from "../common/Button";
import { useAuth } from "../../auth/AuthProvider";

//

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ตรวจสอบว่าเป็นหน้า login ของ admin หรือ customer
  const isAdmin = location.pathname.includes("/admin/");
  console.log(`pathname: ${location.pathname}`);
  console.log(`isAdmin: ${isAdmin}`);

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    setError(""); // ล้าง error เมื่อผู้ใช้พิมพ์
  };

  const handleRememberMeChange = () => {
    setFormData((prev) => ({
      ...prev,
      rememberMe: !prev.rememberMe,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // ถ้าเป็นหน้า admin login ให้เรียกใช้ API login
      if (isAdmin) {
        const { success, message, role } = await login(
          formData.email,
          formData.password
        );

        if (success) {
          // ตรวจสอบว่าผู้ใช้เป็น admin จริงหรือไม่
          if (
            role &&
            (role.toLowerCase() === "admin" ||
              role.toLowerCase().includes("admin"))
          ) {
            console.log("Admin login successful");
            navigate("/admin/homepage");
          } else {
            setError("You don't have admin privileges");
          }
        } else {
          setError(message || "Login failed");
        }
      } else {
        // สำหรับ customer login (ยังไม่มี API รองรับ)
        setError("Customer login is not implemented yet");
        // เมื่อมี API customer login ให้ใช้โค้ดคล้ายกับ admin login
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // สำหรับฟังก์ชั่น forgot password
    console.log("Forgot password clicked");
    // TODO: เพิ่มการเชื่อมต่อกับ API forgot password เมื่อมี endpoint
    alert("Forgot password functionality will be implemented soon");
  };

  const handleSignUp = () => {
    // สำหรับ customer เท่านั้น
    navigate("/customer/signup");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden px-5 pt-8 pb-12 mt-18 max-w-full bg-white rounded-lg border border-solid border-slate-100 w-[360px] max-md:mt-10"
    >
      <div className="flex overflow-hidden flex-col p-2.5 w-full bg-white">
        <h2 className="self-start text-2xl font-bold leading-none text-center text-black">
          {isAdmin ? "Admin Login" : "Customer Login"}
        </h2>

        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

        <InputFieldAuth
          type="text"
          placeholder="Email / Phone"
          value={formData.email}
          onChange={handleInputChange("email")}
        />

        <InputFieldAuth
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange("password")}
          showPasswordToggle
        />

        <div className="flex gap-10 justify-between mt-4 w-full max-w-[300px]">
          <RememberMeCheckbox
            checked={formData.rememberMe}
            onChange={handleRememberMeChange}
          />
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-xs font-medium leading-6 text-center text-slate-700 underline"
          >
            Forget Password?
          </button>
        </div>

        <Button type="submit" className="mt-4" disabled={isLoading}>
          {isLoading ? "LOGGING IN..." : "LOGIN"}
        </Button>

        {!isAdmin && (
          <p className="self-start mt-4 text-xs font-medium leading-6 text-center">
            <span className="text-slate-600">Don't have an account ?</span>{" "}
            <button
              type="button"
              onClick={handleSignUp}
              className="text-slate-700 underline"
            >
              Sign Up
            </button>
          </p>
        )}
      </div>
    </form>
  );
};

export default LoginForm;
