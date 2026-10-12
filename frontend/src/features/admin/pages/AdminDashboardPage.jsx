import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { storageService } from "../../../services/storageService";
import { getAdminCompanies, getAdminUsers } from "../utils/adminData";
import { normalizeCompanyStatus, normalizeApprovalStatus } from "../../../utils/statusUtils";
import { CalendarIcon, BuildingIcon, UsersIcon, ClockIcon, BriefcaseIcon, ClipboardListIcon, ArrowRightIcon } from "../../../components/common/Icons";

const statConfig = [
  { label: "Total Candidates", key: "totalCandidates", icon: UsersIcon },
  { label: "Total Employers", key: "totalEmployers", icon: BuildingIcon },
  { label: "Verified Companies", key: "verifiedCompanies", icon: BuildingIcon },
  { label: "Pending Company Verifications", key: "pendingCompanyVerifications", icon: ClockIcon },
  { label: "Total Jobs", key: "totalJobs", icon: BriefcaseIcon },
  { label: "Total Walk-In Drives", key: "totalWalkInDrives", icon: CalendarIcon },
  { label: "Pending Drive Approvals", key: "pendingDriveApprovals", icon: ClipboardListIcon },
  { label: "Total Applications", key: "totalApplications", icon: ClipboardListIcon },
];

export function AdminDashboardPage() {
  const drives = storageService.getDrives();
  const jobs = storageService.getJobs();
  const applications = storageService.getApplications();
  const activities = storageService.getActivities();
  const companies = getAdminCompanies();
  const users = getAdminUsers();

  const stats = useMemo(() => {
    const totalCandidates = users.filter((u) => u.role === "CANDIDATE").length;
    const totalEmployers = companies.length;
    const verifiedCompanies = companies.filter(
      (company) => normalizeCompanyStatus(company.verificationStatus) === "VERIFIED"
    ).length;
    const pendingCompanyVerifications = companies.filter(
      (company) => normalizeCompanyStatus(company.verificationStatus) === "PENDING"
    ).length;
    const totalJobs = jobs.length;
    const totalWalkInDrives = drives.length;
    const pendingDriveApprovals = drives.filter((drive) =>
      ["PENDING", "CHANGES_REQUESTED"].includes(normalizeApprovalStatus(drive.approvalStatus))
    ).length;
    const totalApplications = applications.length;

    return {
      totalCandidates,
      totalEmployers,
      verifiedCompanies,
      pendingCompanyVerifications,
      totalJobs,
      totalWalkInDrives,
      pendingDriveApprovals,
      totalApplications,
    };
  }, [applications.length, companies, drives, jobs, users]);

  const pendingApprovals = [
    ...companies
      .filter((company) => company.verificationStatus === "PENDING")
      .slice(0, 2)
      .map((company) => ({
        id: company.id,
        name: company.name,
        submittedOn: company.registrationDate,
        status: "Company Verification",
        entityType: "company",
      })),
    ...drives
      .filter((drive) => ["Pending Approval", "Changes Requested"].includes(drive.approvalStatus))
      .slice(0, 3)
      .map((drive) => ({
        id: drive.id,
        name: drive.title,
        submittedOn: drive.submittedAt || drive.createdAt,
        status: drive.approvalStatus,
        entityType: "drive",
      })),
  ];

  const upcomingDrives = drives
    .filter((drive) => drive.approvalStatus === "Approved" && new Date(drive.interviewDate) >= new Date())
    .sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate))
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statConfig.map(({ label, key, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between gap-3 mb-3">
              <span className="text-xs font-medium text-slate-500">{label}</span>
              <div className="rounded-lg bg-slate-100 p-2 text-slate-700">
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats[key]}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr,.9fr] gap-6">
        <Card title="Pending Approvals" subtitle="Items awaiting admin action" padding="p-0">
          <div className="divide-y divide-slate-200">
            {pendingApprovals.length > 0 ? (
              pendingApprovals.map((item) => (
                <div key={`${item.entityType}-${item.id}`} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                      <span>{item.submittedOn}</span>
                      <span className="text-slate-300">•</span>
                      <span>{item.status}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={item.status === "Company Verification" ? "warning" : "primary"} size="sm">
                      {item.status}
                    </Badge>
                    <Link to={item.entityType === "company" ? "/admin/companies" : "/admin/drive-approvals"}>
                      <Button variant="outline" size="sm">View details</Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-sm text-slate-500">No pending items at this time.</div>
            )}
          </div>
        </Card>

        <Card title="Quick Actions" subtitle="Jump to common admin tasks" padding="p-4">
          <div className="grid grid-cols-2 gap-3">
            <Link to="/admin/companies" className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-left hover:border-blue-200 hover:bg-blue-50 transition-colors">
              <p className="text-xs font-semibold text-slate-700">Review Companies</p>
            </Link>
            <Link to="/admin/drive-approvals" className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-left hover:border-blue-200 hover:bg-blue-50 transition-colors">
              <p className="text-xs font-semibold text-slate-700">Review Drive Approvals</p>
            </Link>
            <Link to="/admin/users" className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-left hover:border-blue-200 hover:bg-blue-50 transition-colors">
              <p className="text-xs font-semibold text-slate-700">Manage Users</p>
            </Link>
            <Link to="/admin/applications" className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-left hover:border-blue-200 hover:bg-blue-50 transition-colors">
              <p className="text-xs font-semibold text-slate-700">View Applications</p>
            </Link>
            <Link to="/admin/reports" className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-left hover:border-blue-200 hover:bg-blue-50 transition-colors">
              <p className="text-xs font-semibold text-slate-700">Open Reports</p>
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card title="Upcoming Walk-In Drives" subtitle="Approved and scheduled hiring events" padding="p-0">
          <div className="divide-y divide-slate-200">
            {upcomingDrives.length > 0 ? (
              upcomingDrives.map((drive) => (
                <div key={drive.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{drive.title}</p>
                      <p className="mt-1 text-[11px] text-slate-500">{drive.companyId || "TechSprint Innovations"}</p>
                    </div>
                    <Badge variant="success" size="sm">Published</Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                    <span><strong>Date:</strong> {drive.interviewDate}</span>
                    <span><strong>Location:</strong> {drive.city}</span>
                    <span><strong>Positions:</strong> {drive.vacancies}</span>
                    <span><strong>Venue:</strong> {drive.venueName}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-sm text-slate-500">No approved practical drives scheduled.</div>
            )}
          </div>
        </Card>

        <Card title="Recent Activity" subtitle="Latest administrative and platform events" padding="p-0">
          <div className="divide-y divide-slate-200">
            {activities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-start justify-between gap-3 p-4">
                <div>
                  <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{activity.description}</p>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">{activity.timestamp || "Just now"}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="flex justify-end">
        <Link to="/admin/reports">
          <Button variant="primary" size="sm" icon={ArrowRightIcon} iconPosition="right">
            View performance reports
          </Button>
        </Link>
      </div>
    </div>
  );
}
