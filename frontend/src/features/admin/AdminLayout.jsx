import { useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/hooks/useAuth";
import { Badge } from "../../components/ui/Badge";
import {
  BellIcon,
  BuildingIcon,
  CalendarIcon,
  ChartBarIcon,
  ChevronRightIcon,
  ClipboardListIcon,
  DashboardIcon,
  FileTextIcon,
  MenuIcon,
  ShieldCheckIcon,
  UsersIcon,
  XIcon,
} from "../../components/common/Icons";
import { getAdminNotifications } from "./utils/adminData";

const NAV_ITEMS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: DashboardIcon },
  { to: "/admin/companies", label: "Companies & Employers", icon: BuildingIcon },
  { to: "/admin/drive-approvals", label: "Drive Approvals", icon: CalendarIcon },
  { to: "/admin/users", label: "User Management", icon: UsersIcon },
  { to: "/admin/jobs", label: "Jobs & Walk-In Drives", icon: ClipboardListIcon },
  { to: "/admin/applications", label: "Applications & Interviews", icon: ChartBarIcon },
  { to: "/admin/reports", label: "Reports & Analytics", icon: ChartBarIcon },
  { to: "/admin/activity-logs", label: "Activity Logs", icon: FileTextIcon },
  { to: "/admin/notifications", label: "Notifications", icon: BellIcon },
  { to: "/admin/settings", label: "Settings", icon: ShieldCheckIcon },
];

const ROUTE_CONFIG = {
  "/admin/dashboard": { title: "Dashboard", subtitle: "Overview of platform health and approval queues", breadcrumbs: ["Dashboard"] },
  "/admin/companies": { title: "Companies & Employers", subtitle: "Review employer registrations and verification requests", breadcrumbs: ["Companies & Employers"] },
  "/admin/drive-approvals": { title: "Drive Approvals", subtitle: "Approve, reject, or request revisions for walk-in submissions", breadcrumbs: ["Drive Approvals"] },
  "/admin/users": { title: "User Management", subtitle: "Review candidate and employer account activity and restrictions", breadcrumbs: ["User Management"] },
  "/admin/jobs": { title: "Jobs & Walk-In Drives", subtitle: "Monitor open positions and scheduled hiring events", breadcrumbs: ["Jobs & Drives"] },
  "/admin/applications": { title: "Applications & Interviews", subtitle: "Track candidate progress and interview coordination", breadcrumbs: ["Applications & Interviews"] },
  "/admin/reports": { title: "Reports & Analytics", subtitle: "Analyze hiring performance and conversion metrics", breadcrumbs: ["Reports & Analytics"] },
  "/admin/activity-logs": { title: "Activity Logs", subtitle: "Audit platform events and admin actions", breadcrumbs: ["Activity Logs"] },
  "/admin/notifications": { title: "Notifications", subtitle: "Operational alerts and communication center", breadcrumbs: ["Notifications"] },
  "/admin/settings": { title: "Settings", subtitle: "Manage admin preferences and platform controls", breadcrumbs: ["Settings"] },
};

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const config = ROUTE_CONFIG[location.pathname] || {
    title: "Admin Panel",
    subtitle: "Administration overview",
    breadcrumbs: ["Admin Panel"],
  };

  const notifications = getAdminNotifications();
  const unreadCount = notifications.filter((item) => item.unread).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 text-white flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
              PW
            </div>
            <div>
              <div className="text-sm font-semibold tracking-wide text-white">Pune Walk-In Hub</div>
              <div className="text-[10px] text-blue-300 uppercase tracking-[0.18em]">Admin Panel</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white"
            aria-label="Close menu"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-slate-800 bg-slate-950/40 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-indigo-300 border border-slate-700 text-xs font-bold">
              SA
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-xs font-semibold text-slate-100">Platform Administration</p>
                <ShieldCheckIcon className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              </div>
              <p className="truncate text-[10px] text-slate-400">Operations Control Center</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Navigation
          </p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-3.5 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/15 text-blue-200 border border-blue-500/30 text-xs font-bold">
              {user?.name
                ? user.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")
                : "SA"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-100">{user?.name || "Sahil (System Admin)"}</p>
              <p className="truncate text-[10px] text-slate-400">{user?.role || "ADMIN"} • Platform Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar backdrop"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <div className="lg:pl-72 flex flex-col flex-1 min-w-0">
        <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                aria-label="Open menu"
              >
                <MenuIcon className="h-4 w-4" />
              </button>

              <div className="min-w-0">
                <h1 className="truncate text-lg font-bold text-slate-900">{config.title}</h1>
                <p className="text-[11px] text-slate-500">{config.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => navigate("/admin/notifications")}
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                aria-label="Notifications"
              >
                <BellIcon className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              <div className="hidden sm:flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                  {user?.name ? user.name.split(" ").map((part) => part[0]).slice(0,2).join("") : "SA"}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-slate-800">{user?.name || "Sahil (System Admin)"}</p>
                  <p className="truncate text-[10px] text-slate-500">ADMIN</p>
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <ShieldCheckIcon className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-white px-4 py-2 sm:px-6">
            <nav className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <Link to="/admin/dashboard" className="hover:text-blue-600 transition-colors">Admin Portal</Link>
              {config.breadcrumbs.map((crumb, index) => (
                <span key={`${crumb}-${index}`} className="flex items-center gap-1.5">
                  <ChevronRightIcon className="h-3 w-3 text-slate-400" />
                  <span className={index === config.breadcrumbs.length - 1 ? "font-semibold text-slate-800" : ""}>{crumb}</span>
                </span>
              ))}
            </nav>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        <footer className="border-t border-slate-200 bg-white px-6 py-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>Pune Walk-In Drive & Hiring Management Platform — Admin Operations</p>
          <div className="flex items-center gap-2">
            <Badge variant="success" size="sm" dot>
              System online
            </Badge>
          </div>
        </footer>
      </div>
    </div>
  );
}
