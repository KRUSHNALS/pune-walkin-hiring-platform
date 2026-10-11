import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { candidateService } from "../../../services/candidateService";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import {
  SettingsIcon,
  ShieldCheckIcon,
  MailIcon,
  PhoneIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  LockIcon,
} from "../../../components/common/Icons";
import { useToast } from "../../../context/ToastContext";

export function CandidateSettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const [settings, setSettings] = useState({
    emailAlerts: true,
    smsAlerts: true,
    interviewReminders: true,
    driveRecommendations: true,
    profileVisibility: "Public to Pune Recruiter Network",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const s = await candidateService.getSettings(user);
        setSettings(s);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [user]);

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      await candidateService.updateSettings(user, settings);
      showToast("Candidate preferences updated successfully!", "success");
    } catch (err) {
      showToast("Failed to save settings.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out of your Candidate account?")) {
      logout();
      showToast("Signed out safely.", "info");
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
              Candidate Account
            </span>
            <Badge variant="success" size="sm">
              Role: CANDIDATE
            </Badge>
          </div>
          <h2 className="mt-1 text-2xl font-black text-slate-900 tracking-tight">
            Account Preferences & Settings
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Manage your recruitment alerts, notifications, and profile visibility.
          </p>
        </div>
      </div>

      {/* 1. Account Summary Card */}
      <Card title="Candidate Account Information" padding="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
            <span className="text-3xs uppercase font-bold text-slate-400">Candidate Name</span>
            <p className="text-sm font-bold text-slate-900">{user?.name || "Amit Deshmukh"}</p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
            <span className="text-3xs uppercase font-bold text-slate-400">Registered Email</span>
            <p className="text-sm font-bold text-slate-900 truncate">
              {user?.email || "candidate@example.com"}
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
            <span className="text-3xs uppercase font-bold text-slate-400">Platform Status</span>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <p className="font-bold text-emerald-700">ACTIVE & VERIFIED</p>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. Notification Preferences */}
      <Card
        title="Recruitment Notification Preferences"
        subtitle="Control how and when you receive walk-in updates"
        padding="p-6"
      >
        <div className="divide-y divide-slate-100 space-y-4">
          <div className="flex items-center justify-between pt-3 first:pt-0">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Email Alerts</h4>
              <p className="text-xs text-slate-500">
                Receive email notifications when walk-in applications change status.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailAlerts}
              onChange={() => handleToggle("emailAlerts")}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900">SMS Verification Alerts</h4>
              <p className="text-xs text-slate-500">
                Receive SMS updates on your registered mobile number for confirmed interview slots.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.smsAlerts}
              onChange={() => handleToggle("smsAlerts")}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Interview Slot Reminders</h4>
              <p className="text-xs text-slate-500">
                Get reminders 24 hours prior to scheduled Pune walk-in reporting windows.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.interviewReminders}
              onChange={() => handleToggle("interviewReminders")}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Drive Recommendations</h4>
              <p className="text-xs text-slate-500">
                Receive recommended drive alerts matching your skills and qualification.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.driveRecommendations}
              onChange={() => handleToggle("driveRecommendations")}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end">
          <Button variant="primary" size="sm" onClick={handleSavePreferences} loading={saving}>
            Save Notification Preferences
          </Button>
        </div>
      </Card>

      {/* 3. Profile Visibility */}
      <Card
        title="Profile Visibility in Pune Recruiter Network"
        subtitle="Manage who can discover your candidate profile"
        padding="p-6"
      >
        <div className="space-y-3 text-xs">
          <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
            <input
              type="radio"
              name="visibility"
              value="Public to Pune Recruiter Network"
              checked={settings.profileVisibility === "Public to Pune Recruiter Network"}
              onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })}
              className="text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-bold text-slate-900 block">
                Public to Verified Pune Recruiter Network (Recommended)
              </span>
              <span className="text-slate-500">
                Allows verified corporate recruiters (e.g. TechSprint Innovations) to match you with walk-in events.
              </span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white cursor-pointer">
            <input
              type="radio"
              name="visibility"
              value="Only to Applied Drives"
              checked={settings.profileVisibility === "Only to Applied Drives"}
              onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })}
              className="text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-bold text-slate-900 block">
                Restricted: Visible Only to Drives I Explicitly Register For
              </span>
              <span className="text-slate-500">
                Your profile and resume are shielded until you submit an application.
              </span>
            </div>
          </label>
        </div>

        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm" onClick={handleSavePreferences} loading={saving}>
            Save Visibility
          </Button>
        </div>
      </Card>

      {/* 4. Security & System Integration Notice */}
      <Card title="Security & Authentication Contract" padding="p-6">
        <div className="flex items-start gap-3.5 text-xs text-slate-600">
          <ShieldCheckIcon className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900">
              Spring Boot Security (JWT) Architecture Ready
            </h4>
            <p className="leading-relaxed">
              Authentication and credential authorization are centrally governed by the Auth Module. In production, password changes and multi-factor authentication are verified directly through Spring Security endpoints (`/api/v1/auth/*`).
            </p>
          </div>
        </div>
      </Card>

      {/* 5. Safe Logout Action */}
      <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-rose-950">End Candidate Session</h4>
          <p className="text-xs text-rose-800">
            Securely sign out of the Pune Walk-In Career Portal on this device.
          </p>
        </div>

        <Button variant="danger" size="md" onClick={handleLogout}>
          Sign Out of Account
        </Button>
      </div>
    </div>
  );
}
