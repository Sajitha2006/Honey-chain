// StatusBadge — colour-coded badge for status/severity
const STATUS_STYLES = {
  active: "badge-green",
  healthy: "badge-green",
  HEALTHY: "badge-green",
  inactive: "badge-gray",
  maintenance: "badge-blue",
  "needs attention": "badge-orange",
  "NEEDS ATTENTION": "badge-orange",
  "high risk": "badge-red",
  "HIGH RISK": "badge-red",
  low: "badge-green",
  medium: "badge-orange",
  high: "badge-red",
  placed: "badge-blue",
  confirmed: "badge-blue",
  processing: "badge-orange",
  shipped: "badge-purple",
  delivered: "badge-green",
  cancelled: "badge-red",
  paid: "badge-green",
  pending: "badge-orange",
  unpaid: "badge-red",
  verified: "badge-green",
  unverified: "badge-gray",
};

const StatusBadge = ({ status, className = "" }) => {
  if (!status) return null;
  const key = status.toLowerCase();
  const style = STATUS_STYLES[key] || STATUS_STYLES[status] || "badge-gray";
  return (
    <span className={`status-badge ${style} ${className}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
