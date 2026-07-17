import React from "react";
import { cn } from "../../utils/cn";

export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      {Icon && (
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 mb-4">
          <Icon className="h-10 w-10 text-slate-400" />
        </div>
      )}
      <h3 className="mt-2 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
