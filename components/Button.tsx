
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'danger' | 'pro-primary' | 'pro-outline';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  icon,
  className = '',
  ...props 
}) => {
  // Styles for "Fun" mode (default)
  const funBase = "inline-flex items-center justify-center px-6 py-3 rounded-2xl font-bold text-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 transform active:scale-95 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed border-b-4";
  
  // Styles for "Professional" mode
  const proBase = "inline-flex items-center justify-center px-4 py-2.5 rounded-lg font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm";

  const variants = {
    // Fun Variants
    primary: `${funBase} bg-fun-blue border-blue-700 text-white hover:bg-blue-500 focus:ring-blue-300`,
    secondary: `${funBase} bg-white border-slate-200 text-slate-700 hover:bg-slate-50 focus:ring-slate-200`,
    outline: `${funBase} bg-white border-2 border-fun-blue text-fun-blue hover:bg-blue-50 border-b-4 border-fun-blue`,
    ghost: `${funBase} bg-transparent border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-b-0`,
    success: `${funBase} bg-fun-green border-green-600 text-white hover:bg-green-400 focus:ring-green-300`,
    danger: `${funBase} bg-fun-pink border-pink-600 text-white hover:bg-pink-400 focus:ring-pink-300`,
    
    // Pro Variants
    'pro-primary': `${proBase} bg-blue-600 text-white hover:bg-blue-700 border border-transparent`,
    'pro-outline': `${proBase} bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:text-slate-900`,
  };

  const selectedClass = variants[variant] || variants['primary'];

  return (
    <button 
      className={`${selectedClass} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : icon ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
