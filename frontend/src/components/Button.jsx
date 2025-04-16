const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseStyles =
    "flex flex-col justify-center items-center px-1.5 py-2 w-full text-xs font-medium leading-loose text-center whitespace-nowrap rounded min-h-[30px]";
  const variants = {
    primary: "bg-slate-600 text-white",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="px-2.5 py-1">{children}</span>
    </button>
  );
};

export default Button;
