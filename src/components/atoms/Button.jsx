import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const buttonVariants = {
  primary: "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg",
  secondary: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
  ghost: "text-slate-600 hover:text-slate-800 hover:bg-slate-100",
  danger: "bg-gradient-to-r from-error to-red-600 text-white hover:shadow-lg",
  success: "bg-gradient-to-r from-success to-emerald-600 text-white hover:shadow-lg",
};

const buttonSizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
  xl: "px-8 py-4 text-lg",
};

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  disabled = false,
  loading = false,
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200",
        "hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
        buttonVariants[variant],
        buttonSizes[size],
        loading && "cursor-wait",
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;