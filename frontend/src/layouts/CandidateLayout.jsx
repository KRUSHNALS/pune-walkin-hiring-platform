import { useState, useEffect } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { CandidateSidebar } from "../components/layout/CandidateSidebar";
import { CandidateHeader } from "../components/layout/CandidateHeader";
import { ChevronRightIcon } from "../components/common/Icons";
import { useAuth } from "../features/auth/hooks/useAuth";
import { candidateService } from "../services/candidateService";

const ROUTE_CONFIG = {
  "/candidate/dashboard": {
    title: "Candidate Dashboard",
    subtitle: "Overview of applications, recommended walk-in drives, and interview schedules",
    breadcrumbs: ["Dashboard"],
  },
  "/candidate/profile": {
    title: "My Profile",
    subtitle: "Personal information, education, technical skills, and experience",
    breadcrumbs: ["My Profile"],
  },
  "/candidate/profile/edit": {
    title: "Edit Profile",
    subtitle: "Update qualifications, contact details, and resume details",
    breadcrumbs: ["My Profile", "Edit"],
  },
  "/candidate/resume": {
    title: "Resume Management",
    subtitle: "Upload, inspect, and manage your CV for Pune walk-in recruitments",
    breadcrumbs: ["Resume"],
  },
  "/candidate/drives": {
    title: "Browse Walk-In Drives",
    subtitle: "Explore verified and approved walk-in hiring events in Pune IT hubs",
    breadcrumbs: ["Walk-In Drives"],
  },
  "/candidate/applications": {
    title: "My Applications",
    subtitle: "Track registration tokens, screening progress, and recruitment decisions",
    breadcrumbs: ["Applications"],
  },
  "/candidate/interviews": {
    title: "My Interviews",
    subtitle: "Confirmed interview slots, reporting instructions, and venue passes",
    breadcrumbs: ["Interviews"],
  },
  "/candidate/notifications": {
    title: "Notifications",
    subtitle: "Updates on status changes, shortlisting, and drive announcements",
    breadcrumbs: ["Notifications"],
  },
  "/candidate/settings": {
    title: "Account Settings",
    subtitle: "Preferences, notification alerts, and candidate security options",
    breadcrumbs: ["Settings"],
  },
};

export function CandidateLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const { user } = useAuth();

  // Load unread notifications count
  useEffect(() => {
    async function fetchUnread() {
      try {
        const notifs = await candidateService.getNotifications(user);
        setUnreadCount(notifs.filter((n) => !n.read).length);
      } catch (err) {
        console.warn("Error loading unread count", err);
      }
    }
    fetchUnread();
  }, [user, location.pathname]);

  // Dynamic route config matching nested parameterized routes
  const config =
    ROUTE_CONFIG[location.pathname] ||
    (location.pathname.startsWith("/candidate/drives/")
      ? {
          title: "Walk-In Drive Details",
          subtitle: "Job criteria, Pune venue address, selection rounds, and registration",
          breadcrumbs: ["Walk-In Drives", "Details"],
        }
      : location.pathname.startsWith("/candidate/applications/")
      ? {
          title: "Application Details",
          subtitle: "Walk-in entry pass, current status timeline, and interviewer feedback",
          breadcrumbs: ["Applications", "Details"],
        }
      : {
          title: "Candidate Portal",
          subtitle: "Pune Walk-In Recruitment & Hiring Platform",
          breadcrumbs: ["Candidate"],
        });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      <CandidateSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        unreadCount={unreadCount}
      />

      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        <CandidateHeader
          onMenuClick={() => setSidebarOpen(true)}
          title={config.title}
          subtitle={config.subtitle}
          unreadCount={unreadCount}
        />

        {/* Breadcrumb Navigation */}
        {config.breadcrumbs && config.breadcrumbs.length > 0 && (
          <div className="border-b border-slate-200/60 bg-white px-4 py-2 sm:px-6">
            <nav className="flex items-center gap-1.5 text-xs text-slate-500">
              <Link
                to="/candidate/dashboard"
                className="hover:text-blue-600 transition-colors"
              >
                Candidate Portal
              </Link>
              {config.breadcrumbs.map((crumb, idx) => (
                <span key={idx} className="flex items-center gap-1.5">
                  <ChevronRightIcon className="h-3 w-3 text-slate-400" />
                  <span
                    className={
                      idx === config.breadcrumbs.length - 1
                        ? "font-semibold text-slate-800"
                        : "hover:text-blue-600"
                    }
                  >
                    {crumb}
                  </span>
                </span>
              ))}
            </nav>
          </div>
        )}

        {/* Main Candidate Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Standard Candidate Footer */}
        <footer className="border-t border-slate-200 bg-white px-6 py-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            Pune Walk-In Drive & Hiring Management Platform — Candidate Career Portal
          </p>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 font-medium text-slate-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Connected to Pune IT Cluster
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
