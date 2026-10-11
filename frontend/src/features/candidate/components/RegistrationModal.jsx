import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  FileTextIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ShieldCheckIcon,
} from "../../../components/common/Icons";
import { candidateService } from "../../../services/candidateService";
import { useToast } from "../../../context/ToastContext";

const TIME_SLOTS = [
  "09:30 AM - Slot A (Morning Batch)",
  "11:00 AM - Slot B (Mid-Day Batch)",
  "02:00 PM - Slot C (Afternoon Batch)",
  "03:30 PM - Slot D (Late Afternoon Batch)",
];

export function RegistrationModal({
  isOpen,
  onClose,
  drive,
  user,
  onRegistered,
}) {
  const { showToast } = useToast();
  const [slot, setSlot] = useState(TIME_SLOTS[0]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedDocuments, setAcceptedDocuments] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [successApp, setSuccessApp] = useState(null);

  useEffect(() => {
    if (isOpen && user) {
      candidateService.getProfile(user).then(setProfile).catch(console.error);
      setSuccessApp(null);
      setAcceptedTerms(false);
      setAcceptedDocuments(false);
    }
  }, [isOpen, user]);

  if (!drive) return null;

  const handleRegister = async () => {
    if (!acceptedTerms || !acceptedDocuments) {
      showToast("Please acknowledge both checklist declarations before applying.", "error");
      return;
    }

    setLoading(true);
    try {
      const createdApp = await candidateService.applyForDrive(user, drive.id, slot);
      setSuccessApp(createdApp);
      showToast("Walk-in registration confirmed! Token generated.", "success");
      if (onRegistered) onRegistered(createdApp);
    } catch (err) {
      showToast(err.message || "Failed to register for drive.", "error");
    } finally {
      setLoading(false);
    }
  };

  const hasResume = Boolean(profile?.resume?.fileName);
  const isProfileComplete = (profile?.completionPercentage || 0) >= 75;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={successApp ? "Registration Successful!" : "Register for Walk-In Drive"}
      subtitle={
        successApp
          ? "Your token pass has been issued. Report directly to the venue."
          : "Reserve your walk-in interview slot in Pune"
      }
      maxWidth="max-w-xl"
    >
      {successApp ? (
        <div className="space-y-6 text-center py-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto">
            <CheckCircleIcon className="h-8 w-8" />
          </div>

          <div>
            <Badge variant="success" size="lg">
              Token Confirmed
            </Badge>
            <h3 className="mt-2 text-2xl font-black text-slate-900 tracking-tight">
              {successApp.tokenNumber}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Allocated Slot: <strong className="text-slate-800">{successApp.registrationSlot}</strong>
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Drive:</span>
              <span className="font-semibold text-slate-800 text-right">{drive.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Role:</span>
              <span className="font-semibold text-blue-700">{drive.jobTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Interview Date:</span>
              <span className="font-semibold text-slate-800">{drive.interviewDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Venue:</span>
              <span className="font-semibold text-slate-800 text-right">{drive.venueName}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to={`/candidate/applications/${successApp.id}`}
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              <Button variant="primary" className="w-full">
                View My Entry Pass
              </Button>
            </Link>
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Close
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Drive Summary Header */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                {drive.jobTitle}
              </span>
              <Badge variant="success" size="sm">
                Verified Walk-In
              </Badge>
            </div>
            <h4 className="text-sm font-bold text-slate-900 leading-snug">
              {drive.title}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="h-4 w-4 text-slate-400 shrink-0" />
                <span>Date: <strong>{drive.interviewDate}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPinIcon className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="truncate">{drive.venueName}, Pune</span>
              </div>
            </div>
          </div>

          {/* Profile & Resume Status Notice */}
          <div className="space-y-2">
            {!hasResume && (
              <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                <AlertCircleIcon className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">No Resume Attached to Profile</p>
                  <p className="text-amber-700 mt-0.5">
                    Recruiters require an active resume. You can still apply, but please upload your resume in Profile settings.
                  </p>
                  <Link
                    to="/candidate/resume"
                    className="inline-block mt-1 font-bold text-blue-700 underline"
                  >
                    Upload Resume Now
                  </Link>
                </div>
              </div>
            )}

            {!isProfileComplete && (
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-xs">
                <div>
                  <span className="text-slate-500">Profile Completeness:</span>
                  <span className="ml-1.5 font-bold text-slate-800">
                    {profile?.completionPercentage || 0}%
                  </span>
                </div>
                <Link
                  to="/candidate/profile/edit"
                  className="font-bold text-blue-600 hover:text-blue-700 underline"
                >
                  Complete Profile
                </Link>
              </div>
            )}
          </div>

          {/* Slot Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Preferred Reporting Slot <span className="text-rose-500">*</span>
            </label>
            <select
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              {TIME_SLOTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <p className="text-2xs text-slate-500">
              Slots are allocated on a first-come, first-evaluated basis.
            </p>
          </div>

          {/* Mandatory Checkboxes */}
          <div className="rounded-xl border border-slate-200 p-3.5 bg-white space-y-3 text-xs">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-slate-700">
                I verify that I fulfill the educational batch criteria and technical skills specified for this vacancy.
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedDocuments}
                onChange={(e) => setAcceptedDocuments(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-slate-700">
                I agree to carry <strong>2 printed copies of my resume</strong>, graduation marks sheets, and a valid Government Photo ID (Aadhaar/PAN/Passport).
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <Button variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleRegister}
              loading={loading}
              disabled={!acceptedTerms || !acceptedDocuments}
            >
              Confirm Registration
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
