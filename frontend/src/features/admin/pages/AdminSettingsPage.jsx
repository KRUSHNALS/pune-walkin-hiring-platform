import { useState } from "react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { getAdminSettings, saveAdminSettings } from "../utils/adminData";

export function AdminSettingsPage() {
  const [settings, setSettings] = useState(() => getAdminSettings());

  const toggle = (key) => {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    saveAdminSettings(next);
  };

  return (
    <div className="space-y-6">
      <Card title="Admin Preferences" subtitle="Review and tune platform controls" padding="p-5">
        <div className="space-y-4">
          {[
            { label: "Email alerts", key: "emailAlerts" },
            { label: "Automatic approvals for low-risk applications", key: "autoApproval" },
            { label: "Require two-step review on high-risk actions", key: "requireTwoStepReview" },
            { label: "Candidate report generation", key: "candidateReports" },
            { label: "Daily digest summary", key: "dailyDigest" },
            { label: "Weekly audit export", key: "weeklyAudit" },
          ].map((option) => (
            <div key={option.key} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
              <span className="text-sm text-slate-700">{option.label}</span>
              <button
                type="button"
                onClick={() => toggle(option.key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings[option.key] ? "bg-emerald-500" : "bg-slate-300"}`}
                aria-label={option.label}
              >
                <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${settings[option.key] ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="primary">Save preferences</Button>
        </div>
      </Card>
    </div>
  );
}
