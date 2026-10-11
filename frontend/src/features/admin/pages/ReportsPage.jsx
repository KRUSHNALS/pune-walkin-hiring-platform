import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { storageService } from "../../../services/storageService";

export function ReportsPage() {
  const jobs = storageService.getJobs();
  const drives = storageService.getDrives();
  const applications = storageService.getApplications();

  const totalCandidates = applications.length;
  const shortlisted = applications.filter((app) => app.status === "Shortlisted").length;
  const selected = applications.filter((app) => app.status === "Selected").length;
  const conversionRate = totalCandidates ? Math.round((selected / totalCandidates) * 100) : 0;

  const distribution = [
    { label: "Registered", value: applications.filter((app) => app.status === "Registered").length },
    { label: "Shortlisted", value: shortlisted },
    { label: "Interview", value: applications.filter((app) => app.status === "Interview Scheduled").length },
    { label: "Selected", value: selected },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Jobs published</p><p className="mt-2 text-2xl font-bold text-slate-900">{jobs.length}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Drive approvals</p><p className="mt-2 text-2xl font-bold text-blue-600">{drives.filter((drive) => drive.approvalStatus === "Approved").length}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Shortlisted</p><p className="mt-2 text-2xl font-bold text-amber-600">{shortlisted}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Conversion</p><p className="mt-2 text-2xl font-bold text-emerald-600">{conversionRate}%</p></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card title="Application Funnel" subtitle="Current hiring pipeline from registration to selection" padding="p-5">
          <div className="space-y-4">
            {distribution.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{ width: `${Math.max((item.value / Math.max(totalCandidates, 1)) * 100, 8)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Operational Summary" subtitle="High-level performance snapshot" padding="p-5">
          <div className="space-y-3 text-sm text-slate-700">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
              <span>Candidate pool size</span>
              <Badge variant="primary" size="sm">{totalCandidates}</Badge>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
              <span>Approved drives</span>
              <Badge variant="success" size="sm">{drives.filter((drive) => drive.approvalStatus === "Approved").length}</Badge>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
              <span>Selected candidates</span>
              <Badge variant="success" size="sm">{selected}</Badge>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
              <span>Avg. completion</span>
              <Badge variant="warning" size="sm">{conversionRate}%</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
