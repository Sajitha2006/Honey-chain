// LoadingSpinner — reusable centered spinner
const LoadingSpinner = ({ size = "md", text = "Loading..." }) => {
  const sizes = { sm: "w-5 h-5", md: "w-10 h-10", lg: "w-16 h-16" };
  return (
    <div className="loading-spinner-wrapper">
      <div className={`loading-spinner ${sizes[size]}`} />
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
