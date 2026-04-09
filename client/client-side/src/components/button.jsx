import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  // Base professional styles
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  // Specific style variants matching your brand palette
  const variants = {
    primary: "bg-[#6D28D9] text-white shadow-lg shadow-purple-100 hover:bg-[#5B21B6]",
    outline: "border border-slate-200 bg-transparent text-slate-700 hover:bg-slate-50",
    secondary: "bg-purple-50 text-[#6D28D9] hover:bg-purple-100",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-600"
  };

  // Precise sizing
  const sizes = {
    sm: "h-9 px-4 rounded-lg text-sm",
    md: "h-11 px-6 rounded-xl text-sm",
    lg: "h-14 px-10 rounded-2xl text-base"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;