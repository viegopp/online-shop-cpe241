"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "./InputField";
import RememberMeCheckbox from "./RememberMeCheckbox";
import Button from "./Button";
import { useAuth } from "../auth/AuthProvider";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    setError(""); // Clear error when user types
  };

  const handleRememberMeChange = () => {
    setFormData((prev) => ({
      ...prev,
      rememberMe: !prev.rememberMe,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // TODO: Check for "Remember Me" functionality (Optional)
    const { success, message } = login(formData.email, formData.password);

    if (success) {
      navigate("/dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  const handleForgotPassword = () => {
    // Mock function for forgot password
    console.log("Forgot password clicked");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden px-5 pt-8 pb-12 mt-18 max-w-full bg-white rounded-lg border border-solid border-slate-100 w-[360px] max-md:mt-10"
    >
      <div className="flex overflow-hidden flex-col p-2.5 w-full bg-white">
        <h2 className="self-start text-2xl font-bold leading-none text-center text-black">
          Login
        </h2>

        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

        <InputField
          type="text"
          placeholder="Email / Phone"
          value={formData.email}
          onChange={handleInputChange("email")}
        />

        <InputField
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

        <Button type="submit" className="mt-4">
          LOGIN
        </Button>

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
      </div>
    </form>
  );
};

export default LoginForm;
