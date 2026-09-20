// Skeleton — loading placeholder
const Skeleton = ({ className = "", count = 1 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className={`skeleton ${className}`} />
    ))}
  </>
);

export const SkeletonCard = () => (
  <div className="skeleton-card">
    <Skeleton className="skeleton-title" />
    <Skeleton className="skeleton-line" />
    <Skeleton className="skeleton-line skeleton-short" />
  </div>
);

export default Skeleton;
