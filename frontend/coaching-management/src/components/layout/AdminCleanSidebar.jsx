import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  UserPlus,
  GraduationCap,
  LogOut
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";

export function AdminCleanSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (_) {}
    logout();
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard",          path: "/admin/dashboard",             icon: LayoutDashboard },
    { label: "Programs",           path: "/admin/programs",              icon: BookOpen },
    { label: "Instructors",        path: "/admin/instructors",           icon: Users },
    { label: "Pending Requests",   path: "/admin/pending-instructors",   icon: UserPlus },
    { label: "Students",           path: "/admin/students",              icon: GraduationCap },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-neutral-200/60 flex flex-col z-40">
      {/* Brand Logo */}
      <div className="h-20 flex items-center px-7 border-b border-neutral-200/60">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-neutral-900 flex items-center justify-center text-white">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="text-xl font-normal tracking-tight text-neutral-900">
            Coaching CMS
          </span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-5 py-7 space-y-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#ffdb5c] text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Profile & Logout */}
      <div className="p-5 border-t border-neutral-200/60">
        <div className="flex items-center gap-3.5 px-5 py-4 mb-4">
          <div className="h-11 w-11 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-800 text-base font-semibold border border-neutral-200/60">
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-900 truncate">
              {user?.name || "Admin User"}
            </p>
            <p className="text-xs text-neutral-500 truncate capitalize">
              {user?.role || "Administrator"}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
