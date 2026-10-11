import { useMemo, useState } from "react";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { storageService } from "../../../services/storageService";

const statusOptions = ["All", "Active", "Draft", "Archived", "Published", "Completed"];

export function JobsAndDrivesPage() {
  const jobs = storageService.getJobs();
  const drives = storageService.getDrives();
  const [filter, setFilter] = useState("All");

  const combined = useMemo(() => {
    const filteredJobs = filter === "All" ? jobs : jobs.filter((job) => job.status === filter || job.status === filter.toLowerCase());
    const filteredDrives = filter === "All" ? drives : drives.filter((drive) => drive.approvalStatus === filter || drive.driveStatus === filter);
    return {
      filteredJobs,
      filteredDrives,
    };
  }, [drives, filter, jobs]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card title="Jobs" subtitle="Current job listings and status" padding="p-0">
          <div className="divide-y divide-slate-200">
            {combined.filteredJobs.length > 0 ? (
              combined.filteredJobs.map((job) => (
                <div key={job.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{job.title}</p>
                      <p className="mt-1 text-[11px] text-slate-500">{job.department} • {job.location}</p>
                    </div>
                    <Badge variant={job.status === "Active" ? "success" : job.status === "Draft" ? "warning" : "neutral"} size="sm">
                      {job.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-sm text-slate-500">No jobs match the selected filter.</div>
            )}
          </div>
        </Card>

        <Card title="Walk-In Drives" subtitle="Drive health and readiness" padding="p-0">
          <div className="divide-y divide-slate-200">
            {combined.filteredDrives.length > 0 ? (
              combined.filteredDrives.map((drive) => (
                <div key={drive.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{drive.title}</p>
                      <p className="mt-1 text-[11px] text-slate-500">{drive.city} • {drive.interviewDate}</p>
                    </div>
                    <Badge variant={drive.approvalStatus === "Approved" ? "success" : drive.approvalStatus === "Pending Approval" ? "warning" : "neutral"} size="sm">
                      {drive.approvalStatus || drive.driveStatus}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-sm text-slate-500">No drives match the selected filter.</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
