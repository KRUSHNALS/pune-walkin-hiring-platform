import { useMemo, useState } from "react";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { storageService } from "../../../services/storageService";

const statusOptions = ["All", "Registered", "Under Review", "Shortlisted", "Interview Scheduled", "Selected", "On Hold", "Rejected"];

export function ApplicationsPage() {
  const applications = storageService.getApplications();
  const [filter, setFilter] = useState("All");

  const filteredApplications = useMemo(() => {
    if (filter === "All") return applications;
    return applications.filter((app) => app.status === filter);
  }, [applications, filter]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Total applicants</p><p className="mt-2 text-2xl font-bold text-slate-900">{applications.length}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Shortlisted</p><p className="mt-2 text-2xl font-bold text-blue-600">{applications.filter((app) => app.status === "Shortlisted").length}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Interview scheduled</p><p className="mt-2 text-2xl font-bold text-amber-600">{applications.filter((app) => app.status === "Interview Scheduled").length}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Selected</p><p className="mt-2 text-2xl font-bold text-emerald-600">{applications.filter((app) => app.status === "Selected").length}</p></div>
      </div>

      <Card title="Candidate Pipeline" subtitle="Application lifecycle from registration to final selection" padding="p-0">
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

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Candidate</th>
                <th className="px-4 py-3 font-medium">Drive</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Token</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredApplications.map((application) => (
                <tr key={application.id}>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{application.candidateName}</div>
                    <div className="text-[11px] text-slate-500">{application.email}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{application.driveTitle}</td>
                  <td className="px-4 py-3">
                    <Badge variant={application.status === "Selected" ? "success" : application.status === "Rejected" ? "danger" : application.status === "Interview Scheduled" ? "warning" : "primary"} size="sm">
                      {application.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{application.tokenNumber || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
