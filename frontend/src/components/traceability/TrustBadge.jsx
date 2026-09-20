// TrustBadge — verified trust badges for products
const badges = [
  { key: "verified", icon: "✓", label: "Verified Honey", color: "trust-green" },
  { key: "traceable", icon: "🔗", label: "Traceable Batch", color: "trust-blue" },
  { key: "monitored", icon: "📡", label: "Hive Monitored", color: "trust-purple" },
  { key: "aiChecked", icon: "🤖", label: "AI Health Checked", color: "trust-orange" },
];

const TrustBadge = ({ show = {} }) => (
  <div className="trust-badges">
    {badges
      .filter((b) => show[b.key])
      .map((b) => (
        <span key={b.key} className={`trust-badge ${b.color}`}>
          <span>{b.icon}</span> {b.label}
        </span>
      ))}
  </div>
);

export default TrustBadge;
