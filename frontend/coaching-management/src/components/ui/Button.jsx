import React from "react";
import { cn } from "../../utils/cn";

export const Button = React.forwardRef(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const variants = {
      primary: "bg-brand-black text-white hover:bg-slate-800 shadow-sm",
      secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm",
      danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100",
      ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 py-2 text-sm",
      lg: "h-11 px-8 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
