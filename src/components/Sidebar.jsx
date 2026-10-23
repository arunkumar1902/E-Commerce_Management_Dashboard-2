
const nav = [
  { id: "overview", icon: "▦", label: "Overview" },
  { id: "products", icon: "▣", label: "Products" },
  { id: "orders", icon: "▤", label: "Orders", count: "8" },
  { id: "customers", icon: "♙", label: "Customers" },
  { id: "inventory", icon: "▥", label: "Inventory" },
];

export default function Sidebar({ page, setPage, open, onClose }) {
  return (
    <>
      {open && <button className="mobile-scrim" aria-label="Close menu" onClick={onClose} />}

      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">E</div>
          <span>commerce</span>
          <button className="sidebar-close" onClick={onClose} aria-label="Close navigation">×</button>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav>
          {nav.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${page === item.id ? "active" : ""}`}
              onClick={() => {
                setPage(item.id);
                onClose();
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.count && <span className="nav-count">{item.count}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          

          <button className="nav-item settings-item" onClick={() => window.alert("Settings are coming soon.")}>
            <span className="nav-icon">⚙</span>
            <span>Settings</span>
          </button>

          <div className="profile">
            <div className="avatar avatar-purple">AK</div>
            <div className="profile-copy">
              <strong>Arun</strong>
              <span>Store admin</span>
            </div>
            <button className="profile-more" aria-label="Profile options" onClick={() => window.alert("Signed in as Arun")}>
              •••
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
