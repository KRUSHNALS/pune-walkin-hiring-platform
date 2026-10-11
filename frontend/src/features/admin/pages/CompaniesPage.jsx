import { useMemo, useState } from "react";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { SearchIcon, CheckCircleIcon, XCircleIcon, ExternalLinkIcon, MailIcon, PhoneIcon } from "../../../components/common/Icons";
import { getAdminCompanies, saveAdminCompanies } from "../utils/adminData";
import { storageService } from "../../../services/storageService";

const statusOptions = ["All", "PENDING", "VERIFIED", "REJECTED"];

export function CompaniesPage() {
  const [companyRows, setCompanyRows] = useState(() => getAdminCompanies());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedId, setSelectedId] = useState(() => getAdminCompanies()[0]?.id || null);

  const filteredCompanies = useMemo(() => {
    return companyRows.filter((company) => {
      const matchesStatus = statusFilter === "All" || company.verificationStatus === statusFilter;
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        company.name.toLowerCase().includes(query) ||
        company.employerName.toLowerCase().includes(query) ||
        company.email.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [companyRows, search, statusFilter]);

  const selectedCompany = filteredCompanies.find((company) => company.id === selectedId) || filteredCompanies[0] || null;

  const updateStatus = (companyId, nextStatus) => {
    const next = companyRows.map((company) =>
      company.id === companyId
        ? {
            ...company,
            verificationStatus: nextStatus,
            reviewReason: nextStatus === "REJECTED" ? "Application did not meet required verification standards." : "",
          }
        : company
    );
    setCompanyRows(next);
    saveAdminCompanies(next);
    storageService.addActivity({
      type: nextStatus === "VERIFIED" ? "company_verified" : "company_rejected",
      title: nextStatus === "VERIFIED" ? "Company verified" : "Company registration rejected",
      description: nextStatus === "VERIFIED" ? `Verified ${next.find((company) => company.id === companyId)?.name}.` : `Rejected verification for ${next.find((company) => company.id === companyId)?.name}.`,
      entityId: companyId,
    });
    const updated = next.find((company) => company.id === companyId);
    setSelectedId(updated?.id || companyId);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Total Records</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{companyRows.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Pending</p>
          <p className="mt-2 text-2xl font-bold text-amber-600">{companyRows.filter((company) => company.verificationStatus === "PENDING").length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Verified</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">{companyRows.filter((company) => company.verificationStatus === "VERIFIED").length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr,.9fr] gap-6">
        <Card title="Company Registry" subtitle="Search by company, employer, or email" padding="p-0">
          <div className="border-b border-slate-200 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search company, employer, or email"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {statusOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setStatusFilter(option)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium border ${
                      statusFilter === option
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Employer</th>
                  <th className="px-4 py-3 font-medium">Industry</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredCompanies.length > 0 ? (
                  filteredCompanies.map((company) => (
                    <tr key={company.id} className={selectedCompany?.id === company.id ? "bg-blue-50/40" : "bg-white"}>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{company.name}</div>
                        <div className="text-[11px] text-slate-500">{company.email}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{company.employerName}</td>
                      <td className="px-4 py-3 text-slate-700">{company.industry}</td>
                      <td className="px-4 py-3 text-slate-700">{company.registrationDate}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            company.verificationStatus === "VERIFIED"
                              ? "success"
                              : company.verificationStatus === "REJECTED"
                                ? "danger"
                                : "warning"
                          }
                          size="sm"
                        >
                          {company.verificationStatus}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => setSelectedId(company.id)}>
                            Review
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                      No company records match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {selectedCompany && (
          <Card title="Verification Details" subtitle={selectedCompany.name} padding="p-5">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-base font-bold text-slate-700">
                  {selectedCompany.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{selectedCompany.name}</p>
                  <p className="text-xs text-slate-500">{selectedCompany.industry}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-700">
                <div className="flex items-center gap-2"><MailIcon className="h-4 w-4 text-slate-400" /> {selectedCompany.email}</div>
                <div className="flex items-center gap-2"><PhoneIcon className="h-4 w-4 text-slate-400" /> {selectedCompany.contactNumber}</div>
                {selectedCompany.website && (
                  <div className="flex items-center gap-2"><ExternalLinkIcon className="h-4 w-4 text-slate-400" /> {selectedCompany.website}</div>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">Company details</p>
                <p className="mt-2">{selectedCompany.description}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                  <span><strong>Employer:</strong> {selectedCompany.employerName}</span>
                  <span><strong>Location:</strong> {selectedCompany.location}</span>
                  <span><strong>Submitted:</strong> {selectedCompany.registrationDate}</span>
                  <span><strong>Status:</strong> {selectedCompany.verificationStatus}</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Review notes</p>
                <p className="mt-2 text-sm text-slate-700">{selectedCompany.reviewReason || "No prior review notes recorded."}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="success" onClick={() => updateStatus(selectedCompany.id, "VERIFIED")} icon={CheckCircleIcon}>
                  Approve & verify
                </Button>
                <Button variant="danger" onClick={() => updateStatus(selectedCompany.id, "REJECTED")} icon={XCircleIcon}>
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
