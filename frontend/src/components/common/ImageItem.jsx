import React from "react";
import { ImagePlus } from "lucide-react";

const ImageItem = ({
  src,
  alt = "Image",
  width = 75,
  height = 75,
  variant = "square",
  icon: Icon,
  onDelete,
  onEdit,
  onShowOptions,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "circle":
        return "rounded-full";
      case "square":
        return "rounded-md";
      case "rounded":
        return "rounded-xl";
      default:
        return "rounded-md";
    }
  };

  const handleClick = () => {
    if (onDelete) return onDelete();
    if (onEdit) return onEdit();
    if (onShowOptions) return onShowOptions();
  };

  return (
    <div
      className={`relative overflow-hidden ${getVariantClasses()}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" />
      {Icon && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
          onClick={() => handleClick()}
        >
          <Icon color={"white"} size={24} />
        </div>
      )}
    </div>
  );
};

const ImageItemGroup = ({
  images = [],
  variant = "square",
  width = 75,
  height = 75,
  onAddImage,
}) => {
  return (
    <div className={`flex flex-wrap gap-3`}>
      {images.map((image, index) => (
        <ImageItem
          key={index}
          src={image.src}
          alt={image.alt}
          width={width}
          height={height}
          variant={variant}
          icon={image.icon}
          onDelete={image.onDelete}
          onEdit={image.onEdit}
          onShowOptions={image.onShowOptions}
        />
      ))}

      {onAddImage && (
        <div
          className={`flex items-center justify-center border-2 border-dashed border-slate-200 cursor-pointer ${
            variant === "circle" ? "rounded-full" : "rounded-md"
          }`}
          style={{ width: `${width}px`, height: `${height}px` }}
          onClick={onAddImage}
        >
          <ImagePlus size={24} strokeWidth={1.4} className="text-slate-500" />
          <span className="sr-only">Add Image</span>
        </div>
      )}
    </div>
  );
};

export { ImageItem, ImageItemGroup };
