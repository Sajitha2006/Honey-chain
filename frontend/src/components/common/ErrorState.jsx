// ErrorState — shown when API call fails
const ErrorState = ({
  title = "Something went wrong",
  description = "Please try again later.",
  onRetry,
}) => (
  <div className="error-state">
    <div className="error-state-icon">⚠️</div>
    <h3 className="error-state-title">{title}</h3>
    <p className="error-state-desc">{description}</p>
    {onRetry && (
      <button className="error-retry-btn" onClick={onRetry}>
        Try Again
      </button>
    )}
  </div>
);

export default ErrorState;
