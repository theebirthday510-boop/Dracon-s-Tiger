import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "font-bold rounded-lg transition-all duration-200 shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";
  
  const variants = {
    primary: "bg-tiger-orange text-white hover:bg-orange-600 border border-transparent",
    secondary: "bg-tiger-red text-white hover:bg-red-700 border border-transparent",
    outline: "bg-white text-tiger-orange border-2 border-tiger-orange hover:bg-orange-50",
    ghost: "bg-transparent text-tiger-dark shadow-none hover:bg-gray-100"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-6 text-xl"
  };

  return (
    <button 
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : ''} 
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};