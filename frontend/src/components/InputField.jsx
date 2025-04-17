"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const InputField = ({
  type = "text",
  placeholder,
  value,
  onChange,
  showPasswordToggle = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mt-4 w-full text-xs font-medium leading-6 text-center text-slate-400">
      <div className="flex flex-col justify-center px-4 py-1 w-full bg-white rounded border border-solid border-slate-200">
        <div className="flex gap-10 justify-between items-center min-h-[22px]">
          <input
            type={
              showPasswordToggle ? (showPassword ? "text" : "password") : type
            }
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full bg-transparent outline-none text-slate-900"
            {...props}
          />
          {showPasswordToggle && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="focus:outline-none text-slate-400 hover:text-slate-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputField;
