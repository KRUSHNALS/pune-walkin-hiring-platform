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
  MapPinIcon,
  CheckCircleIcon,
  FileTextIcon,
  ArrowRightIcon,
  AlertCircleIcon,
  ShieldCheckIcon,
} from "../../../components/common/Icons";

const STATUS_VARIANT = {
  Registered: "primary",
  "Under Review": "warning",
  Shortlisted: "success",
  "Interview Scheduled": "indigo",
  Selected: "success",
  "On Hold": "purple",
  Rejected: "danger",
};

export function CandidateInterviewsPage() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("upcoming"); // upcoming | past

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await candidateService.getMyInterviews(user);
        setInterviews(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const upcomingList = interviews.filter((i) => !i.isPast);
  const pastList = interviews.filter((i) => i.isPast);
  const displayList = tab === "upcoming" ? upcomingList : pastList;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                Interview Operations
              </span>
              <span className="text-2xs text-slate-400 font-medium">
                Confirmed Walk-In Slots
              </span>
            </div>
            <h2 className="mt-1 text-2xl font-black text-slate-900 tracking-tight">
              My Interview Schedules
            </h2>
            <p className="mt-1 text-xs text-slate-500 max-w-2xl">
              Inspect your verified walk-in reporting windows, campus addresses in Pune, and selection rounds instructions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/candidate/drives">
              <Button variant="outline" size="sm" icon={CalendarIcon}>
                Find More Drives
              </Button>
            </Link>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold">
          <button
            onClick={() => setTab("upcoming")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              tab === "upcoming"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Upcoming Interviews ({upcomingList.length})
          </button>
          <button
            onClick={() => setTab("past")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              tab === "past"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Completed / Past ({pastList.length})
          </button>
        </div>
      </div>

      {/* Interviews List */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-44 rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : displayList.length > 0 ? (
        <div className="space-y-4">
          {displayList.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-blue-400 hover:shadow-sm transition-all space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-600">
                      {item.companyName}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-2xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded-sm">
                      {item.jobTitle}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {item.driveTitle}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="rounded-md bg-blue-50 border border-blue-200 px-2.5 py-1 font-mono text-xs font-black text-blue-700">
                    Token: {item.tokenNumber}
                  </span>
                  <Badge variant={STATUS_VARIANT[item.status] || "neutral"} size="md">
                    {item.status}
                  </Badge>
                </div>
              </div>

              {/* Schedule and Venue Grid */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-3xs uppercase font-bold text-slate-400 block">Interview Date</span>
                    <span className="font-bold text-slate-900">{item.interviewDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-3xs uppercase font-bold text-slate-400 block">Reporting Slot</span>
                    <span className="font-semibold text-slate-800">{item.slot}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4 text-rose-500 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-3xs uppercase font-bold text-slate-400 block">Venue</span>
                    <span className="font-semibold text-slate-800 truncate block">{item.venueName}</span>
                  </div>
                </div>
              </div>

              {/* Rounds Breakdown */}
              {item.selectionRounds && item.selectionRounds.length > 0 && (
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs space-y-1.5">
                  <span className="font-bold uppercase text-3xs text-slate-500 block">
                    Selection Rounds Planned:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {item.selectionRounds.map((r, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-3xs font-medium text-slate-700"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Reporting Instructions */}
              <p className="text-2xs text-amber-800 bg-amber-50 border border-amber-200 p-2.5 rounded-lg">
                <strong>Reporting Notice: </strong> {item.instructions}
              </p>

              {/* Footer CTA */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-2xs">
                  Address: {item.venueAddress}
                </span>

                <Link to={`/candidate/applications/${item.applicationId}`}>
                  <Button variant="outline" size="sm" icon={ArrowRightIcon} iconPosition="right">
                    View Walk-In Entry Pass
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3">
          <ClockIcon className="h-10 w-10 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-800">
            {tab === "upcoming" ? "No Upcoming Interviews" : "No Past Interviews"}
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {tab === "upcoming"
              ? "When you register for an approved walk-in drive, your scheduled interview and reporting slot appear here."
              : "Completed interview rounds will be archived in this section."}
          </p>
          <div className="pt-2 flex items-center justify-center gap-2">
            <Link to="/candidate/drives">
              <Button variant="primary" size="sm" icon={CalendarIcon}>
                Browse Walk-In Drives
              </Button>
            </Link>
            <Link to="/candidate/applications">
              <Button variant="outline" size="sm">
                View My Applications
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
