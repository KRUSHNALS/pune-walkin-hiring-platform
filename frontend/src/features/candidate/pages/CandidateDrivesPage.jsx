import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { candidateService } from "../../../services/candidateService";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  BriefcaseIcon,
  SearchIcon,
  FilterIcon,
  AwardIcon,
  UsersIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  RefreshIcon,
} from "../../../components/common/Icons";
import { RegistrationModal } from "../components/RegistrationModal";

const PUNE_LOCATIONS = [
  "All",
  "Magarpatta",
  "Hinjawadi",
  "Kharadi",
  "Baner",
  "Viman Nagar",
];

export function CandidateDrivesPage() {
  const { user } = useAuth();
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");
  const [dateFilter, setDateFilter] = useState("All"); // All | Upcoming | Past
  const [sortBy, setSortBy] = useState("date-asc");

  // Registration modal
  const [selectedDriveForReg, setSelectedDriveForReg] = useState(null);

  const loadDrives = async () => {
    try {
      setLoading(true);
      const data = await candidateService.getDrives(user, {
        search,
        location,
        dateFilter,
        sortBy,
      });
      setDrives(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrives();
  }, [user, search, location, dateFilter, sortBy]);

  const handleClearFilters = () => {
    setSearch("");
    setLocation("All");
    setDateFilter("All");
    setSortBy("date-asc");
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                Pune IT Corridors
              </span>
              <span className="text-2xs text-slate-400 font-medium">
                Verified On-Site Recruitment
              </span>
            </div>
            <h2 className="mt-1 text-2xl font-black text-slate-900 tracking-tight">
              Browse Walk-In Drives
            </h2>
            <p className="mt-1 text-xs text-slate-500 max-w-2xl">
              Explore open, verified walk-in opportunities hosted by companies in Pune. Reserve your slot, secure an entry pass, and report directly to the campus venue.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
              Available Drives: <strong>{drives.length}</strong>
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <SearchIcon className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, role, skills, or venue..."
              className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Location Filter */}
          <div>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              {PUNE_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc === "All" ? "All Pune Locations" : `Cluster: ${loc}`}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="All">All Schedule Dates</option>
              <option value="Upcoming">Upcoming Drives Only</option>
              <option value="Past">Past Concluded Drives</option>
            </select>
          </div>

          {/* Sorting */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="date-asc">Sort: Nearest Date First</option>
              <option value="date-desc">Sort: Latest Date First</option>
              <option value="deadline-asc">Sort: Registration Deadline</option>
              <option value="vacancies-desc">Sort: Most Vacancies</option>
            </select>
          </div>
        </div>
      </div>

      {/* Drives Results List */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : drives.length > 0 ? (
        <div className="space-y-4">
          {drives.map((drive) => (
            <div
              key={drive.id}
              className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs hover:border-blue-400 hover:shadow-sm transition-all space-y-4"
            >
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-blue-600">
                      TechSprint Innovations Pvt. Ltd.
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-2xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded-sm">
                      {drive.jobTitle}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-2xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-sm">
                      {drive.vacancies} Openings
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors">
                    <Link to={`/candidate/drives/${drive.id}`}>{drive.title}</Link>
                  </h3>
                </div>

                <div className="shrink-0">
                  {drive.isApplied ? (
                    <Badge variant="primary" size="md">
                      Registered (Token: {drive.tokenNumber})
                    </Badge>
                  ) : (
                    <Badge variant="success" size="md">
                      Registration Open
                    </Badge>
                  )}
                </div>
              </div>

              {/* Description Snippet */}
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {drive.description}
              </p>

              {/* Selection Rounds Chips */}
              {drive.selectionRounds && drive.selectionRounds.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-3xs font-bold uppercase text-slate-400 mr-1">Rounds:</span>
                  {drive.selectionRounds.map((round, idx) => (
                    <span
                      key={idx}
                      className="rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-3xs font-medium text-slate-700"
                    >
                      {round.split(":")[0]}
                    </span>
                  ))}
                </div>
              )}

              {/* Core Details Grid */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-3xs text-slate-400 uppercase block font-bold">Interview Date</span>
                    <span className="font-bold text-slate-900">{drive.interviewDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-3xs text-slate-400 uppercase block font-bold">Reporting Window</span>
                    <span className="font-semibold text-slate-800">{drive.startTime} - {drive.endTime}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4 text-rose-500 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-3xs text-slate-400 uppercase block font-bold">Venue Cluster</span>
                    <span className="font-semibold text-slate-800 truncate block">
                      {drive.venueName}, {drive.city}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <UsersIcon className="h-4 w-4 text-indigo-500 shrink-0" />
                  <div>
                    <span className="text-3xs text-slate-400 uppercase block font-bold">Registrations</span>
                    <span className="font-semibold text-slate-800">
                      {drive.registeredCount} / {drive.maxRegistrations} slots
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer CTA & Deadline */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <span className="text-slate-500">
                  Registration Cutoff:{" "}
                  <strong className="text-slate-900">{drive.registrationDeadline}</strong>
                </span>

                <div className="flex items-center gap-2.5">
                  <Link to={`/candidate/drives/${drive.id}`}>
                    <Button variant="outline" size="sm">
                      View Drive Details
                    </Button>
                  </Link>

                  {!drive.isApplied ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setSelectedDriveForReg(drive)}
                    >
                      Register for Drive
                    </Button>
                  ) : (
                    <Link to={`/candidate/applications/${drive.applicationId}`}>
                      <Button variant="ghost" size="sm" className="text-blue-600 font-semibold">
                        View Entry Pass →
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3">
          <CalendarIcon className="h-10 w-10 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-800">No Walk-In Drives Found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No approved walk-in drives matched your selected filters or search query. Try broadening your criteria.
          </p>
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              icon={RefreshIcon}
              onClick={handleClearFilters}
            >
              Clear All Filters
            </Button>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {selectedDriveForReg && (
        <RegistrationModal
          isOpen={Boolean(selectedDriveForReg)}
          onClose={() => setSelectedDriveForReg(null)}
          drive={selectedDriveForReg}
          user={user}
          onRegistered={() => {
            loadDrives();
            setSelectedDriveForReg(null);
          }}
        />
      )}
    </div>
  );
}
