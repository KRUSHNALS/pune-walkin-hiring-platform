import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { candidateService } from "../../../services/candidateService";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import {
  CalendarIcon,
  ClockIcon,
  ClipboardListIcon,
  SearchIcon,
  FilterIcon,
  MapPinIcon,
  ArrowRightIcon,
  FileTextIcon,
  CheckCircleIcon,
  RefreshIcon,
} from "../../../components/common/Icons";

const STATUS_OPTIONS = [
  "All",
  "Registered",
  "Under Review",
  "Shortlisted",
  "Interview Scheduled",
  "Selected",
  "On Hold",
  "Rejected",
];

const STATUS_VARIANT = {
  Registered: "primary",
  "Under Review": "warning",
  Shortlisted: "success",
  "Interview Scheduled": "indigo",
  Selected: "success",
  "On Hold": "purple",
  Rejected: "danger",
};

export function CandidateApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date-desc");

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await candidateService.getMyApplications(user, {
        search,
        status: statusFilter,
        sortBy,
      });
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [user, search, statusFilter, sortBy]);

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setSortBy("date-desc");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                Application Tracker
              </span>
              <span className="text-2xs text-slate-400 font-medium">
                Real-Time Status & Passes
              </span>
            </div>
            <h2 className="mt-1 text-2xl font-black text-slate-900 tracking-tight">
              My Walk-In Applications
            </h2>
            <p className="mt-1 text-xs text-slate-500 max-w-2xl">
              Track your registered tokens, screening updates from recruiters, interview slot schedules, and official venue passes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/candidate/drives">
              <Button variant="primary" size="sm" icon={CalendarIcon}>
                Browse More Drives
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <SearchIcon className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by job, drive, or token..."
              className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st === "All" ? "All Application Statuses" : `Status: ${st}`}
                </option>
              ))}
            </select>
          </div>

          {/* Sorting */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="date-desc">Newest Application First</option>
              <option value="date-asc">Oldest Application First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 font-mono text-xs font-extrabold text-blue-700">
                      Token: {app.tokenNumber}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-semibold text-slate-600">
                      TechSprint Innovations
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    <Link
                      to={`/candidate/applications/${app.id}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {app.driveTitle}
                    </Link>
                  </h3>
                  <p className="text-xs text-blue-700 font-semibold">
                    Target Role: {app.jobTitle}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <Badge variant={STATUS_VARIANT[app.status] || "neutral"} size="md">
                    {app.status}
                  </Badge>
                </div>
              </div>

              {/* Middle Info */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-3xs uppercase font-bold text-slate-400 block">Applied On</span>
                    <span className="font-semibold text-slate-800">{app.registrationDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-3xs uppercase font-bold text-slate-400 block">Interview Slot</span>
                    <span className="font-semibold text-slate-800">{app.registrationSlot}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <FileTextIcon className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-3xs uppercase font-bold text-slate-400 block">Resume File</span>
                    <span className="font-semibold text-slate-800 truncate block">
                      {app.resumeFileName || "Candidate_Resume.pdf"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Note Preview if present */}
              {app.reviewerNotes && (
                <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-2xs text-slate-600">
                  <strong className="text-slate-800">Recruiter Feedback: </strong>
                  {app.reviewerNotes}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-3xs font-mono">
                  App Ref: #{app.id}
                </span>

                <div className="flex items-center gap-2">
                  <Link to={`/candidate/applications/${app.id}`}>
                    <Button variant="primary" size="sm" icon={ArrowRightIcon} iconPosition="right">
                      View Entry Pass & Timeline
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3">
          <ClipboardListIcon className="h-10 w-10 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-800">No Applications Found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {search || statusFilter !== "All"
              ? "No applications matched your filter criteria."
              : "You haven't registered for any Pune walk-in drives yet."}
          </p>

          <div className="pt-2 flex items-center justify-center gap-2">
            {search || statusFilter !== "All" ? (
              <Button
                variant="outline"
                size="sm"
                icon={RefreshIcon}
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            ) : (
              <Link to="/candidate/drives">
                <Button variant="primary" size="sm" icon={CalendarIcon}>
                  Explore Walk-In Drives
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
