import { Link, useNavigate } from "react-router-dom";
import {
  MenuIcon,
  CalendarIcon,
  BellIcon,
  UsersIcon,
} from "../common/Icons";
import { Button } from "../ui/Button";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useToast } from "../../context/ToastContext";

export function CandidateHeader({
  onMenuClick,
  title,
  subtitle,
  unreadCount = 0,
}) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const handleLogout = () => {
    logout();
    showToast("Signed out successfully.", "info");
    navigate("/login", { replace: true });
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "AD";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/90 bg-white/95 px-4 sm:px-6 backdrop-blur-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Toggle candidate navigation"
        >
          <MenuIcon className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
            {title || "Candidate Portal"}
          </h1>
          {subtitle && (
            <p className="hidden sm:block text-xs text-slate-500">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notification Bell */}
        <Link
          to="/candidate/notifications"
          className="relative rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
          title="Candidate Notifications"
        >
          <BellIcon className="h-4.5 w-4.5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-3xs font-extrabold text-white">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* Quick Action: Browse Drives */}
        <Link to="/candidate/drives" className="hidden sm:inline-flex">
          <Button variant="outline" size="sm" icon={CalendarIcon}>
            Browse Drives
          </Button>
        </Link>

        {/* Profile Chip Shortcut */}
        <Link
          to="/candidate/profile"
          className="flex items-center gap-2 rounded-lg border border-slate-200 py-1.5 px-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
          title="View My Profile"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-3xs">
            {initials}
          </div>
          <span className="hidden md:inline font-semibold text-slate-800 truncate max-w-28">
            {user?.name || "My Profile"}
          </span>
        </Link>

        {/* Sign Out */}
        <button
          onClick={handleLogout}
          className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors"
          title="Sign out of Candidate Portal"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
