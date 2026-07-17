import React from "react";
import { cn } from "../../utils/cn";

export function Badge({ className, variant = "default", children, ...props }) {
  const variants = {
    default: "bg-slate-100 text-slate-800 border-slate-200",
    success: "bg-green-50 text-green-700 border-green-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    brand: "bg-primary-50 text-primary-700 border-primary-200"
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
