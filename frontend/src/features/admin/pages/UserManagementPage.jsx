import { useMemo, useState } from "react";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { SearchIcon, UserCheckIcon, XCircleIcon } from "../../../components/common/Icons";
import { getAdminUsers, saveAdminUsers } from "../utils/adminData";

const statusOptions = ["All", "ACTIVE", "VERIFIED", "PENDING_VERIFICATION", "SUSPENDED"];

export function UserManagementPage() {
  const [users, setUsers] = useState(() => getAdminUsers());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        !search.trim() ||
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.companyName?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [users, search, statusFilter]);

  const handleStatusToggle = (userId, nextStatus) => {
    const updated = users.map((user) => (user.id === userId ? { ...user, status: nextStatus } : user));
    setUsers(updated);
    saveAdminUsers(updated);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Total accounts</p><p className="mt-2 text-2xl font-bold text-slate-900">{users.length}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Active</p><p className="mt-2 text-2xl font-bold text-emerald-600">{users.filter((user) => user.status === "ACTIVE").length}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Verified employers</p><p className="mt-2 text-2xl font-bold text-blue-600">{users.filter((user) => user.status === "VERIFIED").length}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Suspended</p><p className="mt-2 text-2xl font-bold text-rose-600">{users.filter((user) => user.status === "SUSPENDED").length}</p></div>
      </div>

      <Card title="User Directory" subtitle="Manage candidate and employer account visibility" padding="p-0">
        <div className="border-b border-slate-200 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, email, or company"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium border ${
                    statusFilter === status ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{user.name}</div>
                    <div className="text-[11px] text-slate-500">{user.email}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{user.role}</td>
                  <td className="px-4 py-3">
                    <Badge variant={user.status === "SUSPENDED" ? "danger" : user.status === "VERIFIED" || user.status === "ACTIVE" ? "success" : "warning"} size="sm">
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{user.companyName || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {user.status === "SUSPENDED" ? (
                        <Button variant="success" size="sm" onClick={() => handleStatusToggle(user.id, "ACTIVE")} icon={UserCheckIcon}>Reactivate</Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => handleStatusToggle(user.id, "SUSPENDED")} icon={XCircleIcon}>Suspend</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
