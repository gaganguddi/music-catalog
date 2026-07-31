import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  // Simple pagination window: show up to 5 pages
  let start = Math.max(1, currentPage - 2);
  let end = Math.min(totalPages, start + 4);
  
  if (end - start < 4) {
    start = Math.max(1, end - 4);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "32px", marginBottom: "16px" }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn btn-ghost"
        style={{ padding: "8px", borderRadius: "50%" }}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>

      {start > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="btn btn-ghost" style={{ width: 36, height: 36, padding: 0, borderRadius: "50%" }}>1</button>
          {start > 2 && <span style={{ color: "var(--text-muted)" }}>...</span>}
        </>
      )}

      {pages.map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`btn ${currentPage === p ? "btn-primary" : "btn-ghost"}`}
          style={{ width: 36, height: 36, padding: 0, borderRadius: "50%" }}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span style={{ color: "var(--text-muted)" }}>...</span>}
          <button onClick={() => onPageChange(totalPages)} className="btn btn-ghost" style={{ width: 36, height: 36, padding: 0, borderRadius: "50%" }}>{totalPages}</button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn btn-ghost"
        style={{ padding: "8px", borderRadius: "50%" }}
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

export default Pagination;
