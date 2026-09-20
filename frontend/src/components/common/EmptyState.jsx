// EmptyState — shown when there is no data
const EmptyState = ({
  icon = "📭",
  title = "No data available yet",
  description = "Nothing to display here.",
  action,
}) => (
  <div className="empty-state">
    <div className="empty-state-icon">{icon}</div>
    <h3 className="empty-state-title">{title}</h3>
    <p className="empty-state-desc">{description}</p>
    {action && <div className="empty-state-action">{action}</div>}
  </div>
);

export default EmptyState;
