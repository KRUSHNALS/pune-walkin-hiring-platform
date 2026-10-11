import { Card } from "../../../components/ui/Card";
import { storageService } from "../../../services/storageService";

export function ActivityLogsPage() {
  const activities = storageService.getActivities();

  return (
    <div className="space-y-6">
      <Card title="Platform Activity Log" subtitle="Audit trail for administrator and platform events" padding="p-0">
        <div className="divide-y divide-slate-200">
          {activities.map((activity) => (
            <div key={activity.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                <p className="mt-1 text-[11px] text-slate-600">{activity.description}</p>
              </div>
              <div className="text-[10px] text-slate-400 whitespace-nowrap">{activity.timestamp || "Just now"}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
