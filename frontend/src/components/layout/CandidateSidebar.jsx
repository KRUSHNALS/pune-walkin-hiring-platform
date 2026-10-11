import { NavLink } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";
import {
  DashboardIcon,
  UsersIcon,
  CalendarIcon,
  ClipboardListIcon,
  ClockIcon,
  BellIcon,
  SettingsIcon,
  FileTextIcon,
  XIcon,
} from "../common/Icons";

const NAV_ITEMS = [
  { to: "/candidate/dashboard", label: "Dashboard", icon: DashboardIcon },
  { to: "/candidate/profile", label: "My Profile", icon: UsersIcon },
  { to: "/candidate/resume", label: "Resume", icon: FileTextIcon },
  { to: "/candidate/drives", label: "Browse Walk-In Drives", icon: CalendarIcon },
  { to: "/candidate/applications", label: "My Applications", icon: ClipboardListIcon },
  { to: "/candidate/interviews", label: "My Interviews", icon: ClockIcon },
  { to: "/candidate/notifications", label: "Notifications", icon: BellIcon },
  { to: "/candidate/settings", label: "Settings", icon: SettingsIcon },
];

export function CandidateSidebar({ isOpen, onClose, unreadCount = 0 }) {
  const { user } = useAuth();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "AD";

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg shadow-sm">
              PW
            </div>
            <div>
              <span className="block text-sm font-semibold tracking-wide text-white">
                Pune Walk-In Hub
              </span>
              <span className="block text-2xs text-blue-400 font-medium">
                Candidate Career Portal
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-slate-400 hover:text-white"
            aria-label="Close navigation"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Pune Job Seeker Badge */}
        <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-900/40 text-blue-300 font-bold text-xs border border-blue-700/50">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-200">
                {user?.name || "Amit Deshmukh"}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <p className="truncate text-2xs text-slate-400">
                  Pune Candidate Active
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className="px-3 pb-2 text-2xs font-bold uppercase tracking-wider text-slate-400">
            Candidate Menu
          </p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isNotif = item.to === "/candidate/notifications";
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xs font-semibold"
                      : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {isNotif && unreadCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-2xs font-bold text-slate-950">
                    {unreadCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Candidate Profile Footer */}
        <div className="border-t border-slate-800 p-3.5 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-200 truncate">
                {user?.name || "Candidate"}
              </p>
              <p className="text-2xs text-slate-400 truncate">
                {user?.email || "candidate@example.com"}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
