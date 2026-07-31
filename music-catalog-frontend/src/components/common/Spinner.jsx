function Spinner({ size = "default", className = "" }) {
  const cls = size === "lg" ? "spinner spinner-lg" : "spinner";
  return (
    <span
      className={`${cls} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function SpinnerCenter({ size = "lg" }) {
  return (
    <div className="spinner-center">
      <Spinner size={size} />
    </div>
  );
}

export default Spinner;
