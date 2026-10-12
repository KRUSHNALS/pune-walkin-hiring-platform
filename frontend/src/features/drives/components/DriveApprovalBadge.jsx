import { Badge } from "../../../components/ui/Badge";
import { normalizeApprovalStatus, formatApprovalStatus } from "../../../utils/statusUtils";

export function DriveApprovalBadge({ status }) {
  const norm = normalizeApprovalStatus(status);

  const map = {
    APPROVED: { variant: "success", dot: true, label: "Approved" },
    PENDING: { variant: "warning", dot: true, label: "Pending Approval" },
    CHANGES_REQUESTED: { variant: "warning", dot: true, label: "Changes Requested" },
    DRAFT: { variant: "neutral", dot: false, label: "Draft" },
    REJECTED: { variant: "danger", dot: false, label: "Rejected" },
  };

  const item = map[norm] || { variant: "neutral", dot: false, label: formatApprovalStatus(status) };

  return (
    <Badge variant={item.variant} dot={item.dot}>
      {item.label}
    </Badge>
  );
}
