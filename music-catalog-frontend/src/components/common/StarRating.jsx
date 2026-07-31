function StarRating({ value = 0, onChange, readOnly = false, size = "1rem" }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="stars" style={{ "--star-size": size }}>
      {stars.map((star) => (
        <span
          key={star}
          className={`star ${star <= value ? "filled" : ""} ${readOnly ? "star-display" : ""}`}
          style={{ fontSize: size }}
          onClick={() => !readOnly && onChange && onChange(star)}
          role={readOnly ? undefined : "button"}
          aria-label={readOnly ? `${value} stars` : `Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default StarRating;
