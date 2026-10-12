import { useMemo, useState } from "react";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { storageService } from "../../../services/storageService";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  BuildingIcon,
  EditIcon,
} from "../../../components/common/Icons";
import {
  normalizeCompanyStatus,
  formatCompanyStatus,
  normalizeApprovalStatus,
  formatApprovalStatus,
} from "../../../utils/statusUtils";

const statusOptions = ["All", "Pending Approval", "Changes Requested", "Approved", "Rejected"];

export function DriveApprovalsPage() {
  const [filter, setFilter] = useState("All");
  const [drives, setDrives] = useState(() => storageService.getDrives());
  const [selectedId, setSelectedId] = useState(() => storageService.getDrives()[0]?.id || null);

  const companies = storageService.getCompanies();

  const filteredDrives = useMemo(() => {
    if (filter === "All") return drives;
    return drives.filter((drive) => {
      const norm = normalizeApprovalStatus(drive.approvalStatus);
      const filterNorm = normalizeApprovalStatus(filter);
      return norm === filterNorm;
    });
  }, [drives, filter]);

  const selectedDrive =
    filteredDrives.find((drive) => drive.id === selectedId) ||
    filteredDrives[0] ||
    drives.find((d) => d.id === selectedId) ||
    drives[0] ||
    null;

  const driveCompany = selectedDrive
    ? companies.find((c) => c.id === selectedDrive.companyId) || storageService.getCompany()
    : null;

  const isCompanyVerified =
    driveCompany && normalizeCompanyStatus(driveCompany.verificationStatus) === "VERIFIED";

  const approveDrive = (id) => {
    if (!isCompanyVerified) {
      alert("A drive belonging to an unverified company must not be approved. Please verify the company first.");
      return;
    }

    const updated = drives.map((drive) =>
      drive.id === id
        ? {
            ...drive,
            approvalStatus: "Approved",
            driveStatus: "Published",
            approvedAt: new Date().toISOString().split("T")[0],
            adminFeedback: null,
          }
        : drive
    );
    setDrives(updated);
    storageService.setDrives(updated);
    storageService.addActivity({
      type: "drive_approved",
      title: "Walk-In Drive approved",
      description: `Approved and published ${updated.find((drive) => drive.id === id)?.title}.`,
      entityId: id,
    });
    setSelectedId(id);
  };

  const requestChanges = (id) => {
    const feedback = window.prompt(
      "Please enter revision feedback / change request instructions for the employer:",
      "Please clarify candidate reporting instructions, security pass prerequisites, and interview rounds duration."
    );
    if (feedback === null) return; // User cancelled

    const updated = drives.map((drive) =>
      drive.id === id
        ? {
            ...drive,
            approvalStatus: "Changes Requested",
            driveStatus: "Draft",
            adminFeedback: feedback.trim() || "Administrative feedback: Changes requested before drive can be approved.",
          }
        : drive
    );
    setDrives(updated);
    storageService.setDrives(updated);
    storageService.addActivity({
      type: "drive_changes_requested",
      title: "Changes Requested for Drive",
      description: `Requested revisions for ${updated.find((drive) => drive.id === id)?.title}.`,
      entityId: id,
    });
    setSelectedId(id);
  };

  const rejectDrive = (id) => {
    const reason = window.prompt(
      "Please enter rejection reason for this walk-in drive submission:",
      "Walk-in drive does not meet venue capacity and hiring compliance regulations."
    );
    if (reason === null) return; // User cancelled

    const updated = drives.map((drive) =>
      drive.id === id
        ? {
            ...drive,
            approvalStatus: "Rejected",
            driveStatus: "Draft",
            adminFeedback: reason.trim() || "Rejected after administrative compliance review.",
          }
        : drive
    );
    setDrives(updated);
    storageService.setDrives(updated);
    storageService.addActivity({
      type: "drive_rejected",
      title: "Walk-In Drive rejected",
      description: `Rejected ${updated.find((drive) => drive.id === id)?.title} during admin review.`,
      entityId: id,
    });
    setSelectedId(id);
  };

  const getApprovalBadgeVariant = (status) => {
    const norm = normalizeApprovalStatus(status);
    if (norm === "APPROVED") return "success";
    if (norm === "REJECTED") return "danger";
    if (norm === "CHANGES_REQUESTED") return "warning";
    return "warning";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Pending review</p>
          <p className="mt-2 text-2xl font-bold text-amber-600">
            {drives.filter((drive) => normalizeApprovalStatus(drive.approvalStatus) === "PENDING").length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Changes requested</p>
          <p className="mt-2 text-2xl font-bold text-blue-600">
            {drives.filter((drive) => normalizeApprovalStatus(drive.approvalStatus) === "CHANGES_REQUESTED").length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Approved</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {drives.filter((drive) => normalizeApprovalStatus(drive.approvalStatus) === "APPROVED").length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.3fr,.9fr] gap-6">
        <Card title="Walk-In Drive Queue" subtitle="Admin review of employer submissions" padding="p-0">
          <div className="border-b border-slate-200 p-4">
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFilter(status)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium border ${
                    filter === status
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-200">
            {filteredDrives.length > 0 ? (
              filteredDrives.map((drive) => (
                <div
                  key={drive.id}
                  className={`p-4 transition-colors ${selectedDrive?.id === drive.id ? "bg-blue-50/40" : "bg-white hover:bg-slate-50/60"}`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{drive.title}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                        <span>{drive.city}</span>
                        <span className="text-slate-300">•</span>
                        <span>{drive.interviewDate}</span>
                        <span className="text-slate-300">•</span>
                        <span>{drive.vacancies} vacancies</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getApprovalBadgeVariant(drive.approvalStatus)} size="sm">
                        {formatApprovalStatus(drive.approvalStatus)}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => setSelectedId(drive.id)}>
                        Review
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-sm text-slate-500">No drives match this status.</div>
            )}
          </div>
        </Card>

        {selectedDrive && (
          <Card title="Submission Review" subtitle={selectedDrive.title} padding="p-5">
            <div className="space-y-4 text-sm text-slate-700">
              {/* Company Verification Status Check Alert */}
              <div
                className={`rounded-xl border p-3.5 ${
                  isCompanyVerified
                    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                    : "border-rose-200 bg-rose-50 text-rose-900"
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-xs">
                  {isCompanyVerified ? (
                    <CheckCircleIcon className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircleIcon className="h-4 w-4 text-rose-600 shrink-0" />
                  )}
                  <span>
                    Company Verification: {formatCompanyStatus(driveCompany?.verificationStatus)}
                  </span>
                </div>
                <p className="mt-1 text-xs opacity-90">
                  {isCompanyVerified
                    ? `Host organization "${driveCompany?.name || "Company"}" is verified. Drive is eligible for approval.`
                    : `Host organization "${driveCompany?.name || "Company"}" is ${formatCompanyStatus(
                        driveCompany?.verificationStatus
                      )}. A drive belonging to an unverified company must not be approved.`}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 font-bold">Drive summary</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <span><strong>Date:</strong> {selectedDrive.interviewDate}</span>
                  <span><strong>Vacancies:</strong> {selectedDrive.vacancies}</span>
                  <span><strong>Venue:</strong> {selectedDrive.venueName || selectedDrive.city}</span>
                  <span><strong>Current Status:</strong> {formatApprovalStatus(selectedDrive.approvalStatus)}</span>
                </div>
              </div>

              <div>
                <p className="font-semibold text-slate-900">Admin Review Feedback / Reason</p>
                <p className="mt-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {selectedDrive.adminFeedback || "No explicit administrative review comments recorded yet."}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 font-bold">Employer details</p>
                <p className="mt-2 font-semibold text-slate-800">{selectedDrive.recruiterName || driveCompany?.employerName}</p>
                <p className="text-slate-600">{selectedDrive.recruiterEmail || driveCompany?.email}</p>
                <p className="text-slate-500 mt-0.5">{driveCompany?.name}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                <Button
                  variant="success"
                  onClick={() => approveDrive(selectedDrive.id)}
                  icon={CheckCircleIcon}
                  disabled={!isCompanyVerified}
                  title={!isCompanyVerified ? "Company must be verified before approving drive." : "Approve and publish walk-in drive"}
                >
                  Approve & Publish
                </Button>
                <Button
                  variant="outline"
                  onClick={() => requestChanges(selectedDrive.id)}
                  icon={EditIcon}
                >
                  Request Changes
                </Button>
                <Button
                  variant="danger"
                  onClick={() => rejectDrive(selectedDrive.id)}
                  icon={XCircleIcon}
                >
                  Reject
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
