import { useMemo, useState } from "react";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { storageService } from "../../../services/storageService";
import { CheckCircleIcon, XCircleIcon, ClockIcon } from "../../../components/common/Icons";

const statusOptions = ["All", "Pending Approval", "Changes Requested", "Approved", "Rejected"];

export function DriveApprovalsPage() {
  const [filter, setFilter] = useState("All");
  const [selectedId, setSelectedId] = useState(null);

  const drives = storageService.getDrives();

  const filteredDrives = useMemo(() => {
    if (filter === "All") return drives;
    return drives.filter((drive) => drive.approvalStatus === filter);
  }, [drives, filter]);

  const selectedDrive = filteredDrives.find((drive) => drive.id === selectedId) || filteredDrives[0] || null;

  const approveDrive = (id) => {
    const updated = drives.map((drive) =>
      drive.id === id
        ? { ...drive, approvalStatus: "Approved", driveStatus: "Published", approvedAt: new Date().toISOString().split("T")[0] }
        : drive
    );
    storageService.setDrives(updated);
    storageService.addActivity({
      type: "drive_approved",
      title: "Walk-In Drive approved",
      description: `Approved and published ${updated.find((drive) => drive.id === id)?.title}.`,
      entityId: id,
    });
    setSelectedId(id);
  };

  const rejectDrive = (id) => {
    const updated = drives.map((drive) =>
      drive.id === id ? { ...drive, approvalStatus: "Rejected" } : drive
    );
    storageService.setDrives(updated);
    storageService.addActivity({
      type: "drive_rejected",
      title: "Walk-In Drive rejected",
      description: `Rejected ${updated.find((drive) => drive.id === id)?.title} for admin review.`,
      entityId: id,
    });
    setSelectedId(id);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Pending review</p>
          <p className="mt-2 text-2xl font-bold text-amber-600">{drives.filter((drive) => drive.approvalStatus === "Pending Approval").length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Changes requested</p>
          <p className="mt-2 text-2xl font-bold text-blue-600">{drives.filter((drive) => drive.approvalStatus === "Changes Requested").length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Approved</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">{drives.filter((drive) => drive.approvalStatus === "Approved").length}</p>
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
                    filter === status ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-600"
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
                <div key={drive.id} className={`p-4 ${selectedDrive?.id === drive.id ? "bg-blue-50/40" : "bg-white"}`}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{drive.title}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                        <span>{drive.city}</span>
                        <span className="text-slate-300">•</span>
                        <span>{drive.interviewDate}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={drive.approvalStatus === "Approved" ? "success" : drive.approvalStatus === "Rejected" ? "danger" : "warning"} size="sm">
                        {drive.approvalStatus}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => setSelectedId(drive.id)}>Review</Button>
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
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Drive summary</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <span><strong>Date:</strong> {selectedDrive.interviewDate}</span>
                  <span><strong>Vacancies:</strong> {selectedDrive.vacancies}</span>
                  <span><strong>Location:</strong> {selectedDrive.city}</span>
                  <span><strong>Status:</strong> {selectedDrive.approvalStatus}</span>
                </div>
              </div>

              <div>
                <p className="font-semibold text-slate-900">Admin notes</p>
                <p className="mt-2 text-sm text-slate-600">
                  {selectedDrive.adminFeedback || "No explicit admin feedback submitted for this drive yet."}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Employer details</p>
                <p className="mt-2 font-medium text-slate-800">{selectedDrive.recruiterName}</p>
                <p className="text-slate-600">{selectedDrive.recruiterEmail}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="success" onClick={() => approveDrive(selectedDrive.id)} icon={CheckCircleIcon}>
                  Approve
                </Button>
                <Button variant="danger" onClick={() => rejectDrive(selectedDrive.id)} icon={XCircleIcon}>
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
