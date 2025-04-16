"use client";
import { useState } from "react";

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
              className="focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {/* TODO: Change to lucide icon */}
              <img
                src="https://cdn.builder.io/api/v1/image/assets/bde9493d25ce464797f593ad6ddaebdc/b43ac634a20018d4b6a66f1804e960f7d3e5e437?placeholderIfAbsent=true"
                alt={showPassword ? "Hide password" : "Show password"}
                className="object-contain shrink-0 self-stretch my-auto aspect-square w-[13px]"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputField;
