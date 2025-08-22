
import React from 'react';

interface StyledButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
}

export const StyledButton: React.FC<StyledButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
  const baseClasses = "font-bold py-2 px-4 rounded-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
  
  const variantClasses = {
    primary: 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-md shadow-cyan-500/30',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white shadow-md shadow-green-500/30',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
