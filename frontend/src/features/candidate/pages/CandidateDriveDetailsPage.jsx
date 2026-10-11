import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  BuildingIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  FileTextIcon,
  UsersIcon,
  ShieldCheckIcon,
} from "../../../components/common/Icons";
import { RegistrationModal } from "../components/RegistrationModal";

export function CandidateDriveDetailsPage() {
  const { driveId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRegModal, setShowRegModal] = useState(false);

  const loadDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await candidateService.getDriveDetails(driveId, user);
      setDrive(data);
    } catch (err) {
      setError(err.message || "Drive details not found.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [driveId, user]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto animate-pulse">
        <div className="h-10 w-40 rounded-lg bg-slate-200" />
        <div className="h-56 rounded-2xl bg-slate-200" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 rounded-xl bg-slate-200" />
          <div className="h-96 rounded-xl bg-slate-200" />
        </div>
      </div>
    );
  }

  if (error || !drive) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-4 max-w-xl mx-auto">
        <AlertCircleIcon className="h-10 w-10 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900">Walk-In Drive Not Found</h3>
        <p className="text-xs text-slate-500">{error || "The requested walk-in drive does not exist."}</p>
        <Link to="/candidate/drives">
          <Button variant="primary" icon={ArrowLeftIcon}>
            Back to Browse Drives
          </Button>
        </Link>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];
  const isDeadlinePassed = drive.registrationDeadline && drive.registrationDeadline < today;
  const isExpired = drive.interviewDate < today;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back Navigation Bar */}
      <div>
        <Link
          to="/candidate/drives"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Browse Walk-In Drives
        </Link>
      </div>

      {/* Main Drive Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-blue-600">
                {drive.company?.name || "TechSprint Innovations Pvt. Ltd."}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-2xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded-sm">
                {drive.jobTitle}
              </span>
              <span className="text-slate-300">•</span>
              <Badge variant="success" size="sm">
                Approved Walk-In
              </Badge>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
              {drive.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              {drive.description}
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-start md:items-end gap-2">
            {drive.isApplied ? (
              <div className="space-y-1 text-left md:text-right">
                <Badge variant="primary" size="lg">
                  Registered (Token: {drive.application?.tokenNumber})
                </Badge>
                <Link
                  to={`/candidate/applications/${drive.application?.id}`}
                  className="block text-xs font-semibold text-blue-600 hover:underline"
                >
                  View Official Pass →
                </Link>
              </div>
            ) : isDeadlinePassed ? (
              <Badge variant="neutral" size="lg">
                Registration Closed
              </Badge>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={() => setShowRegModal(true)}
              >
                Register for Walk-In
              </Button>
            )}
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-3xs uppercase font-bold text-slate-400 block">Interview Date</span>
            <span className="font-bold text-slate-900 mt-0.5 block">{drive.interviewDate}</span>
          </div>
          <div>
            <span className="text-3xs uppercase font-bold text-slate-400 block">Time Window</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">
              {drive.startTime} - {drive.endTime}
            </span>
          </div>
          <div>
            <span className="text-3xs uppercase font-bold text-slate-400 block">Total Vacancies</span>
            <span className="font-bold text-emerald-700 mt-0.5 block">
              {drive.vacancies} Positions
            </span>
          </div>
          <div>
            <span className="text-3xs uppercase font-bold text-slate-400 block">Cutoff Deadline</span>
            <span className="font-bold text-slate-900 mt-0.5 block">
              {drive.registrationDeadline}
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Detailed Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Job Criteria & Rounds */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Overview */}
          {drive.job && (
            <Card title="Role Overview & Eligibility" padding="p-6">
              <div className="space-y-4 text-xs text-slate-700">
                <div>
                  <h4 className="font-bold text-slate-900 uppercase text-2xs mb-1">
                    Job Description
                  </h4>
                  <p className="leading-relaxed text-slate-600">{drive.job.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                    <span className="text-3xs uppercase font-bold text-slate-400">
                      Required Qualification
                    </span>
                    <p className="font-semibold text-slate-900">{drive.job.qualification}</p>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                    <span className="text-3xs uppercase font-bold text-slate-400">
                      Experience Band
                    </span>
                    <p className="font-semibold text-slate-900">
                      {drive.job.minExperience === 0 ? "Fresher Friendly (" : ""}
                      {drive.job.minExperience} - {drive.job.maxExperience} Years
                      {drive.job.minExperience === 0 ? ")" : ""}
                    </p>
                  </div>
                </div>

                {drive.job.salaryRange && (
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                    <span className="text-3xs uppercase font-bold text-slate-400 block">
                      CTC Compensation Range
                    </span>
                    <p className="font-bold text-emerald-700 text-sm mt-0.5">
                      {drive.job.salaryRange}
                    </p>
                  </div>
                )}

                {/* Technical Skills Required */}
                {drive.job.requiredSkills && (
                  <div className="pt-2">
                    <h4 className="font-bold text-slate-900 uppercase text-2xs mb-2">
                      Targeted Technical Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {drive.job.requiredSkills.map((sk) => (
                        <span
                          key={sk}
                          className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-800"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Selection Rounds */}
          <Card title="Selection Rounds & Evaluation Stages" padding="p-6">
            {drive.selectionRounds && drive.selectionRounds.length > 0 ? (
              <div className="space-y-3">
                {drive.selectionRounds.map((round, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/70 text-xs"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-2xs shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-900">{round}</p>
                      <p className="text-slate-500 text-2xs">
                        Evaluation conducted on-the-spot by technical panel.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Rounds details will be briefed at venue.</p>
            )}
          </Card>

          {/* Mandatory Documents Checklist */}
          <Card title="Mandatory Documents Required at Venue" padding="p-6">
            {drive.requiredDocuments && drive.requiredDocuments.length > 0 ? (
              <ul className="space-y-2.5 text-xs text-slate-700">
                {drive.requiredDocuments.map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircleIcon className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500">
                Carry 2 printed copies of your resume, Government ID, and academic certificates.
              </p>
            )}
          </Card>
        </div>

        {/* Right 1 Col: Venue, Recruiter & Registration Card */}
        <div className="space-y-6">
          {/* Venue & Reporting Details */}
          <Card title="Reporting Venue (Pune)" padding="p-6">
            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-start gap-2.5">
                <MapPinIcon className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{drive.venueName}</h4>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">{drive.venueAddress}</p>
                  <p className="text-slate-500 mt-1">
                    {drive.city}, {drive.state} - {drive.pincode}
                  </p>
                </div>
              </div>

              {drive.candidateInstructions && (
                <div className="mt-4 p-3 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 text-2xs space-y-1">
                  <span className="font-bold uppercase tracking-wider block">
                    Campus Gate Instructions:
                  </span>
                  <p>{drive.candidateInstructions}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Host Recruiter Info */}
          <Card title="Host Recruiter & HR Contact" padding="p-6">
            <div className="space-y-2 text-xs text-slate-600">
              <p className="font-bold text-slate-900">{drive.recruiterName || "Ritik Sawarkar"}</p>
              <p className="text-slate-500">{drive.company?.name || "TechSprint Innovations"}</p>
              <p className="text-slate-600">{drive.recruiterEmail || "careers@techsprint.io"}</p>
              <p className="text-slate-600">{drive.recruiterPhone || "+91 98230 45678"}</p>
            </div>
          </Card>

          {/* Registration Status Widget */}
          <Card title="Drive Registration" padding="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Registered Candidates:</span>
                <span className="font-bold text-slate-800">
                  {drive.registeredCount} / {drive.maxRegistrations}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round((drive.registeredCount / drive.maxRegistrations) * 100)
                    )}%`,
                  }}
                />
              </div>

              <div className="pt-2">
                {drive.isApplied ? (
                  <Link to={`/candidate/applications/${drive.application?.id}`}>
                    <Button variant="primary" className="w-full justify-center">
                      View My Registration Pass
                    </Button>
                  </Link>
                ) : isDeadlinePassed ? (
                  <Button variant="outline" disabled className="w-full justify-center">
                    Registration Deadline Passed
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    className="w-full justify-center"
                    onClick={() => setShowRegModal(true)}
                  >
                    Register for This Drive
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegModal && (
        <RegistrationModal
          isOpen={showRegModal}
          onClose={() => setShowRegModal(false)}
          drive={drive}
          user={user}
          onRegistered={() => {
            loadDetails();
            setShowRegModal(false);
          }}
        />
      )}
    </div>
  );
}
