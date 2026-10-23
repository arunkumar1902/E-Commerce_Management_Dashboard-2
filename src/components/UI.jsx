
import { useEffect } from "react";

export function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) {
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`btn btn-${variant} ${className}`}>
      {children}
    </button>
  );
}

export function Badge({ children }) {
  const value = String(children).toLowerCase();

  const tone =
    value.includes("active") || value === "paid" || value === "delivered" || value === "shipped"
      ? "green"
      : value.includes("process") || value === "pending" || value === "low stock"
      ? "amber"
      : value.includes("cancel") || value === "refunded" || value === "out of stock" || value === "archived"
      ? "red"
      : value === "draft" || value === "inactive"
      ? "gray"
      : "blue";

  return <span className={`badge badge-${tone}`}><i />{children}</span>;
}

export function Modal({ title, children, onClose, wide = false }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className={`modal ${wide ? "modal-wide" : ""}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-heading">
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose} aria-label="Close dialog">×</button>
        </div>
        {children}
      </section>
    </div>
  );
}

export function EmptyState({
  title = "Nothing here yet",
  description = "Try changing your search or filters.",
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">⌕</div>
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );
}

export function Pagination({ page, setPage, total, pageSize }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="pagination">
      <span>
        Showing <b>{total ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, total)}</b> of <b>{total}</b>
      </span>

      <div className="page-buttons">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>← Previous</button>
        <span>Page {page} of {pages}</span>
        <button disabled={page >= pages} onClick={() => setPage(page + 1)}>Next →</button>
      </div>
    </div>
  );
}

export function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(onClose, 3200);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className={`toast toast-${toast.type || "success"}`} role="status">
      <span>{toast.type === "error" ? "!" : "✓"}</span>
      {toast.message}
      <button onClick={onClose} aria-label="Dismiss notification">×</button>
    </div>
  );
}

export function SearchBox({ value, onChange, placeholder = "Search..." }) {
  return (
    <label className="search-box">
      <span>⌕</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} />
      {value && <button onClick={() => onChange("")} aria-label="Clear search">×</button>}
    </label>
  );
}

export function Select({ value, onChange, children, label }) {
  return (
    <select aria-label={label} className="filter-select" value={value} onChange={(e) => onChange(e.target.value)}>
      {children}
    </select>
  );
}
