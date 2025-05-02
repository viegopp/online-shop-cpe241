import { useState } from "react";
import { X } from "lucide-react";

const TagInput = ({
  label,
  tags = [],
  onAddTag,
  onRemoveTag,
  placeholder = "Add a tag...",
  disabled = false,
  className = "",
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      onAddTag(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-gray-800 font-medium">{label}</label>}
      <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-lg min-h-[40px]">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center bg-gray-100 rounded-sm py-1 px-2 text-sm h-5.5"
          >
            <span className="mr-1 text-slate-700">{tag}</span>
            {!disabled && (
              <button
                type="button"
                onClick={() => onRemoveTag(index)}
                className="focus:outline-none cursor-pointer"
              >
                <X size={8} />
              </button>
            )}
          </div>
        ))}
        {!disabled && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-grow outline-none min-w-[100px] text-sm"
          />
        )}
      </div>
    </div>
  );
};

export default TagInput;
