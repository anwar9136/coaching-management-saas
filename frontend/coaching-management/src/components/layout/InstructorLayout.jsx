import React from "react";
import { Outlet } from "react-router-dom";
import { InstructorCleanSidebar } from "./InstructorCleanSidebar";
import { cn } from "../../utils/cn";

const InstructorLayout = ({ className }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fcfbfa] via-[#faf7ee] to-[#f5eed4]/50 font-sans antialiased text-neutral-900">
      <InstructorCleanSidebar />
      <main className={cn("ml-64 w-[calc(100%-16rem)] min-h-screen p-7 lg:p-9", className)}>
        {/* Outlet renders the matched child route component */}
        <Outlet />
      </main>
    </div>
  );
};

export default InstructorLayout;
