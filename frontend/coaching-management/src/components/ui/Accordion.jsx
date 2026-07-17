import React, { useState } from "react";
import { cn } from "../../utils/cn";
import { ChevronDown } from "lucide-react";

export function Accordion({ items, className }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
            <button
              className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-slate-50 focus:outline-none"
              onClick={() => toggle(index)}
            >
              <span className="font-semibold text-slate-900">{item.title}</span>
              <ChevronDown 
                className={cn(
                  "h-5 w-5 text-slate-400 transition-transform duration-200", 
                  isOpen && "rotate-180"
                )} 
              />
            </button>
            {isOpen && (
              <div className="p-4 pt-0 border-t border-slate-100 bg-slate-50/50">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
