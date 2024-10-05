import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export const Input: React.FC<InputProps> = ({ className = "", ...props }) => {
  const baseStyles =
    "w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500";

  const combinedClassName = `${baseStyles} ${className}`;

  return <input className={combinedClassName} {...props} />;
};
