import React from "react";
import { cn } from "../../utils/cn";
import { X } from "lucide-react";

export function Modal({ isOpen, onClose, title, children, className }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={cn(
        "relative z-50 w-full max-w-lg rounded-xl bg-white p-6 shadow-floating animate-in fade-in zoom-in-95",
        className
      )}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button 
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
