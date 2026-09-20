// Timeline — honey journey timeline component
const Timeline = ({ steps = [] }) => (
  <div className="timeline">
    {steps.map((step, index) => (
      <div
        key={index}
        className={`timeline-item ${step.completed ? "timeline-done" : step.current ? "timeline-current" : "timeline-pending"}`}
      >
        <div className="timeline-left">
          <div className="timeline-dot">
            {step.completed ? "✓" : step.current ? "●" : index + 1}
          </div>
          {index < steps.length - 1 && <div className="timeline-line" />}
        </div>
        <div className="timeline-content">
          <div className="timeline-icon">{step.icon}</div>
          <div>
            <h4 className="timeline-title">{step.title}</h4>
            {step.subtitle && (
              <p className="timeline-subtitle">{step.subtitle}</p>
            )}
            {step.date && (
              <p className="timeline-date">{step.date}</p>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default Timeline;
