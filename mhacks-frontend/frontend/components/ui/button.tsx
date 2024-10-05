import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "small" | "medium" | "large" | "icon" | "narrow";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "default",
  size = "medium",
  ...props
}) => {
  const baseStyles = "font-medium rounded-md transition-colors";
  const variantStyles = {
    default: "bg-green-600 hover:bg-green-700 text-white",
    outline:
      "border px-2 py-1 border-orange-1000 text-orange-500 hover:bg-orange-1000 hover:text-white ",
    ghost: "text-gray-400 hover:text-white bg-transparent",
  };
  const sizeStyles = {
    small: "px-2 py-1 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
    icon: "p-2",
    narrow: "px2 py-1 test-base",
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};
