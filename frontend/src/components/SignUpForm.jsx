"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "./InputField";
import Button from "./Button";
import { useAuth } from "../auth/AuthProvider";

const SignUpForm = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [error, setError] = useState("");

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    setError(""); // Clear error when user types
  };

  const handleAgreeToTermsChange = () => {
    setFormData((prev) => ({
      ...prev,
      agreeToTerms: !prev.agreeToTerms,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.agreeToTerms) {
      setError("Please agree to the terms and conditions");
      return;
    }

    const { success, message } = signup(
      formData.email,
      formData.password,
      formData.confirmPassword
    );

    if (success) {
      navigate("/login");
    } else {
      setError(message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden px-5 pt-8 pb-12 mt-[72px] max-w-full bg-white rounded-lg border border-solid border-slate-100 w-[360px] max-md:mt-10"
    >
      <div className="flex overflow-hidden flex-col p-2.5 w-full bg-white">
        <h2 className="self-start text-2xl font-bold leading-none text-center text-black">
          Sign Up
        </h2>

        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

        <InputField
          type="text"
          placeholder="First name"
          value={formData.firstName}
          onChange={handleInputChange("firstName")}
        />

        <InputField
          type="text"
          placeholder="Middle name"
          value={formData.middleName}
          onChange={handleInputChange("middleName")}
        />

        <InputField
          type="text"
          placeholder="Last name"
          value={formData.lastName}
          onChange={handleInputChange("lastName")}
        />

        <InputField
          type="text"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange("email")}
        />

        <InputField
          type="tel"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleInputChange("phone")}
        />

        <InputField
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange("password")}
          showPasswordToggle
        />

        <InputField
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleInputChange("confirmPassword")}
          showPasswordToggle
        />

        <div className="flex gap-2 items-center mt-4">
          <input
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={handleAgreeToTermsChange}
            className="w-4 h-4 border-2 border-slate-300 rounded"
          />
          <span className="text-xs text-slate-600">
            I agree to all the{" "}
            <a href="#" className="text-slate-700 underline">
              Team
            </a>
            ,{" "}
            <a href="#" className="text-slate-700 underline">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="#" className="text-slate-700 underline">
              Fees
            </a>
            .
          </span>
        </div>

        <Button type="submit" className="mt-4">
          SIGN UP
        </Button>

        <p className="self-start mt-4 text-xs font-medium leading-6 text-center">
          <span className="text-slate-600">Have an account?</span>{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-slate-700 underline"
          >
            Log in
          </button>
        </p>
      </div>
    </form>
  );
};

export default SignUpForm;
