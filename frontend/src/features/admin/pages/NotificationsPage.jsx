import { useState } from "react";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { getAdminNotifications, saveAdminNotifications } from "../utils/adminData";

export function NotificationsPage() {
  const [notifications, setNotifications] = useState(() => getAdminNotifications());

  const markAsRead = (id) => {
    const updated = notifications.map((item) => (item.id === id ? { ...item, unread: false } : item));
    setNotifications(updated);
    saveAdminNotifications(updated);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-xs text-slate-500">Unread notifications</p>
        <p className="mt-2 text-2xl font-bold text-slate-900">{notifications.filter((item) => item.unread).length}</p>
      </div>

      <Card title="Notification Center" subtitle="Operational and platform alerts" padding="p-0">
        <div className="divide-y divide-slate-200">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
                  {notification.unread && <Badge variant="warning" size="sm">New</Badge>}
                </div>
                <p className="mt-1 text-[11px] text-slate-600">{notification.detail}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400">{notification.timestamp}</span>
                {!notification.unread && <Badge variant="success" size="sm">Read</Badge>}
                {notification.unread && <Button variant="outline" size="sm" onClick={() => markAsRead(notification.id)}>Mark read</Button>}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
