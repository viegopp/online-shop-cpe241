import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const InputField = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  showPasswordToggle = false,
  disabled = false,
  required = false,
  className = "",
  fullWidth = true,
  isTextarea = false,
  rows = 5,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = showPasswordToggle
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-slate-800 font-medium">{label}</label>}

      <div
        className={`flex flex-col justify-center px-4 py-1 ${
          fullWidth ? "w-full" : ""
        } ${
          disabled ? "bg-slate-50" : "bg-white"
        } rounded-lg border border-solid border-slate-200 focus-within:ring-1 focus-within:ring-slate-400 focus-within:border-slate-400`}
      >
        <div
          className={`flex gap-2 justify-between items-center min-h-[30px] `}
        >
          {isTextarea ? (
            <textarea
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              rows={rows}
              disabled={disabled}
              required={required}
              className="w-full h-full bg-transparent outline-none text-slate-900 py-2 resize-none"
              {...props}
            />
          ) : (
            <input
              type={inputType}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              disabled={disabled}
              required={required}
              className="w-full bg-transparent outline-none text-slate-900"
              {...props}
            />
          )}

          {showPasswordToggle && !isTextarea && (
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
