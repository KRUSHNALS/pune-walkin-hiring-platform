import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { candidateService } from "../../../services/candidateService";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import {
  CalendarIcon,
  BriefcaseIcon,
  ClipboardListIcon,
  ClockIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  MapPinIcon,
  ArrowRightIcon,
  UsersIcon,
  ShieldCheckIcon,
} from "../../../components/common/Icons";
import { RegistrationModal } from "../components/RegistrationModal";

export function CandidateDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDriveForReg, setSelectedDriveForReg] = useState(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const metrics = await candidateService.getDashboardMetrics(user);
      setData(metrics);
    } catch (err) {
      console.error("Dashboard load failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-40 rounded-2xl bg-slate-200" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-slate-200" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 rounded-xl bg-slate-200" />
          <div className="h-72 rounded-xl bg-slate-200" />
        </div>
      </div>
    );
  }

  const { profile, stats, recommendedDrives, upcomingInterviews, recentActivities } = data || {};
  const completion = profile?.completionPercentage || 0;

  return (
    <div className="space-y-6">
      {/* 1. Welcome Card & Profile Completeness */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-900 via-slate-900 to-slate-950 p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-2xs font-bold uppercase tracking-wider text-blue-300 border border-blue-400/30">
                Pune Walk-In Candidate
              </span>
              <span className="flex items-center gap-1 text-2xs text-emerald-400 font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Hiring Active
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || "Candidate"}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Discover walk-in interviews across Pune's IT corridors in Hinjawadi, Magarpatta, Kharadi, and Baner. Track your token passes and status updates in real-time.
            </p>

            {/* Profile Completion Bar */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5 font-medium">
                <span>Profile Completeness</span>
                <span className="font-bold text-blue-400">{completion}% Complete</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Actions in Hero */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            {completion < 100 && (
              <Link to="/candidate/profile/edit">
                <Button variant="primary" size="md" className="w-full justify-center">
                  Complete Profile ({completion}%)
                </Button>
              </Link>
            )}
            <Link to="/candidate/drives">
              <Button
                variant={completion === 100 ? "primary" : "outline"}
                size="md"
                icon={CalendarIcon}
                className="w-full justify-center bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                Browse Walk-In Drives
              </Button>
            </Link>
          </div>
        </div>

        {/* Ambient Decorative background orb */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />
      </div>

      {/* 2. Standardized Application Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <Card padding="p-4" className="hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">
              Total Applied
            </span>
            <ClipboardListIcon className="h-4 w-4 text-slate-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">{stats?.totalApplications || 0}</p>
          <span className="text-3xs text-slate-500">All registered drives</span>
        </Card>

        <Card padding="p-4" className="hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-bold uppercase tracking-wider text-blue-600">
              Registered
            </span>
            <CalendarIcon className="h-4 w-4 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-blue-700">{stats?.registered || 0}</p>
          <span className="text-3xs text-blue-600/80">Slot token reserved</span>
        </Card>

        <Card padding="p-4" className="hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-bold uppercase tracking-wider text-amber-600">
              Under Review
            </span>
            <ClockIcon className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-amber-700">{stats?.underReview || 0}</p>
          <span className="text-3xs text-amber-600/80">Screening in progress</span>
        </Card>

        <Card padding="p-4" className="hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-bold uppercase tracking-wider text-emerald-600">
              Shortlisted
            </span>
            <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-700">{stats?.shortlisted || 0}</p>
          <span className="text-3xs text-emerald-600/80">Walk-in approved</span>
        </Card>

        <Card padding="p-4" className="hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-bold uppercase tracking-wider text-indigo-600">
              Interviews
            </span>
            <ClockIcon className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-indigo-700">
            {stats?.interviewScheduled || 0}
          </p>
          <span className="text-3xs text-indigo-600/80">Scheduled rounds</span>
        </Card>

        <Card padding="p-4" className="hover:border-green-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-bold uppercase tracking-wider text-green-600">
              Selected
            </span>
            <ShieldCheckIcon className="h-4 w-4 text-green-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-green-700">{stats?.selected || 0}</p>
          <span className="text-3xs text-green-600/80">Offer rollout stage</span>
        </Card>
      </div>

      {/* 3. Main Split View: Recommended Drives + Interviews/Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recommended Walk-In Drives */}
        <div className="lg:col-span-2 space-y-6">
          <Card
            title="Recommended Walk-In Drives"
            subtitle="Verified, approved hiring opportunities matching Pune candidates"
            actions={
              <Link to="/candidate/drives">
                <Button variant="ghost" size="sm" icon={ArrowRightIcon} iconPosition="right">
                  View All
                </Button>
              </Link>
            }
          >
            {recommendedDrives && recommendedDrives.length > 0 ? (
              <div className="space-y-4">
                {recommendedDrives.map((drive) => (
                  <div
                    key={drive.id}
                    className="rounded-xl border border-slate-200/90 bg-white p-5 hover:border-blue-400 hover:shadow-xs transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-blue-600">
                            TechSprint Innovations
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-2xs font-bold uppercase tracking-wide text-slate-500 bg-slate-100 px-2 py-0.5 rounded-sm">
                            {drive.jobTitle}
                          </span>
                        </div>
                        <h4 className="mt-1 text-base font-bold text-slate-900 hover:text-blue-600 transition-colors">
                          <Link to={`/candidate/drives/${drive.id}`}>{drive.title}</Link>
                        </h4>
                      </div>

                      <div>
                        {drive.isApplied ? (
                          <Badge variant="primary" size="md">
                            Registered ({drive.tokenNumber})
                          </Badge>
                        ) : (
                          <Badge variant="success" size="md">
                            Walk-In Live
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Metadata chips */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>Date: <strong>{drive.interviewDate}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ClockIcon className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>Time: {drive.startTime} - {drive.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="h-4 w-4 text-rose-500 shrink-0" />
                        <span className="truncate">{drive.city} ({drive.venueName})</span>
                      </div>
                    </div>

                    {/* Bottom CTA and deadline */}
                    <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <span className="text-slate-500">
                        Registration Deadline:{" "}
                        <strong className="text-slate-800">{drive.registrationDeadline}</strong>
                      </span>

                      <div className="flex items-center gap-2">
                        <Link to={`/candidate/drives/${drive.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                        {!drive.isApplied ? (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setSelectedDriveForReg(drive)}
                          >
                            Register Now
                          </Button>
                        ) : (
                          <Link to={`/candidate/applications/${drive.applicationId}`}>
                            <Button variant="ghost" size="sm" className="text-blue-600 font-semibold">
                              View Pass
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 space-y-3">
                <CalendarIcon className="h-10 w-10 text-slate-300 mx-auto" />
                <p className="text-sm">No upcoming walk-in drives currently open for registration.</p>
                <Link to="/candidate/drives">
                  <Button variant="outline" size="sm">
                    Browse All Drives
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        </div>

        {/* Right 1 Col: Upcoming Interviews & Recent Activity */}
        <div className="space-y-6">
          {/* Upcoming Confirmed Interviews */}
          <Card
            title="Upcoming Interviews"
            subtitle="Walk-in evaluation slots booked for you"
            actions={
              <Link to="/candidate/interviews">
                <span className="text-xs text-blue-600 font-semibold hover:underline">
                  View All
                </span>
              </Link>
            }
          >
            {upcomingInterviews && upcomingInterviews.length > 0 ? (
              <div className="space-y-3">
                {upcomingInterviews.map((intv) => (
                  <div
                    key={intv.id}
                    className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-2xs font-bold text-blue-700 uppercase">
                          {intv.jobTitle}
                        </span>
                        <p className="text-sm font-bold text-slate-900 mt-0.5">
                          {intv.companyName}
                        </p>
                      </div>
                      <span className="rounded-md bg-white border border-blue-200 px-2 py-0.5 font-mono text-xs font-extrabold text-blue-700">
                        {intv.tokenNumber}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
                        <span><strong>{intv.interviewDate}</strong> ({intv.slot})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPinIcon className="h-3.5 w-3.5 text-rose-500" />
                        <span className="truncate">{intv.venueName}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-blue-100/80 flex items-center justify-between">
                      <Badge variant="indigo" size="sm">
                        {intv.status}
                      </Badge>
                      <Link
                        to={`/candidate/applications/${intv.applicationId}`}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                      >
                        Entry Pass →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-500 space-y-2">
                <ClockIcon className="h-8 w-8 text-slate-300 mx-auto" />
                <p>No active interview slots confirmed yet.</p>
                <p className="text-3xs text-slate-400">
                  Register for a drive to receive an entry token.
                </p>
              </div>
            )}
          </Card>

          {/* Recent Activity Timeline */}
          <Card
            title="Recent Activity"
            subtitle="Application updates & recruiter actions"
          >
            {recentActivities && recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((act) => (
                  <div key={act.id} className="flex items-start gap-3 text-xs">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-blue-600 border border-slate-200 shrink-0 mt-0.5">
                      <CheckCircleIcon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <p className="font-semibold text-slate-900 truncate">{act.title}</p>
                      <p className="text-slate-500 line-clamp-2 text-2xs">{act.description}</p>
                      <span className="text-3xs text-slate-400 block">{act.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-400">
                No recent activity logged.
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Registration Modal */}
      {selectedDriveForReg && (
        <RegistrationModal
          isOpen={Boolean(selectedDriveForReg)}
          onClose={() => setSelectedDriveForReg(null)}
          drive={selectedDriveForReg}
          user={user}
          onRegistered={() => {
            loadDashboard();
            setSelectedDriveForReg(null);
          }}
        />
      )}
    </div>
  );
}
