import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { candidateService } from "../../../services/candidateService";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import {
  BellIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ClockIcon,
  CalendarIcon,
  CheckIcon,
  ArrowRightIcon,
} from "../../../components/common/Icons";
import { useToast } from "../../../context/ToastContext";

export function CandidateNotificationsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | unread

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await candidateService.getNotifications(user);
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const handleMarkAsRead = async (id) => {
    try {
      const updated = await candidateService.markNotificationAsRead(user, id);
      setNotifications(updated);
    } catch (err) {
      showToast("Failed to update notification.", "error");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const updated = await candidateService.markAllNotificationsAsRead(user);
      setNotifications(updated);
      showToast("All notifications marked as read.", "success");
    } catch (err) {
      showToast("Failed to mark all as read.", "error");
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredList =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
              In-App Center
            </span>
            {unreadCount > 0 && (
              <Badge variant="warning" size="sm">
                {unreadCount} Unread
              </Badge>
            )}
          </div>
          <h2 className="mt-1 text-2xl font-black text-slate-900 tracking-tight">
            Notifications
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Real-time updates regarding your drive registrations, shortlisting, and walk-in passes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              icon={CheckIcon}
              onClick={handleMarkAllAsRead}
            >
              Mark All as Read
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs font-semibold">
        <button
          onClick={() => setFilter("all")}
          className={`px-3.5 py-1.5 rounded-lg transition-colors ${
            filter === "all"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-3.5 py-1.5 rounded-lg transition-colors ${
            filter === "unread"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          Unread Only ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : filteredList.length > 0 ? (
        <div className="space-y-3">
          {filteredList.map((notif) => (
            <div
              key={notif.id}
              className={`rounded-xl border p-4.5 transition-all flex items-start justify-between gap-4 ${
                !notif.read
                  ? "border-blue-300 bg-blue-50/40 shadow-xs"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl shrink-0 mt-0.5 ${
                    notif.type === "shortlist"
                      ? "bg-emerald-100 text-emerald-700"
                      : notif.type === "drive"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  <BellIcon className="h-4.5 w-4.5" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{notif.title}</h4>
                    {!notif.read && (
                      <span className="h-2 w-2 rounded-full bg-blue-600" title="Unread" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                    {notif.message}
                  </p>
                  <span className="text-3xs text-slate-400 font-medium block">
                    {notif.timestamp} • {notif.date}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                {notif.link && (
                  <Link to={notif.link}>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={ArrowRightIcon}
                      iconPosition="right"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View
                    </Button>
                  </Link>
                )}
                {!notif.read && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMarkAsRead(notif.id)}
                  >
                    Mark Read
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3">
          <BellIcon className="h-10 w-10 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-800">No Notifications</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {filter === "unread"
              ? "All caught up! You have zero unread notifications."
              : "No notifications have been received yet."}
          </p>
        </div>
      )}
    </div>
  );
}
