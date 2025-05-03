const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseStyles =
    "flex flex-col justify-center items-center px-1.5 py-1 w-full text-xs font-medium leading-loose text-center whitespace-nowrap rounded min-h-[30px] cursor-pointer transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-600 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-slate-600 text-white",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="px-2.5 py-0.5">{children}</span>
    </button>
  );
};

export default Button;
