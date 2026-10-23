
export default function Topbar({ page, onMenu }) {
  const labels = {
    overview: "Overview",
    products: "Products",
    orders: "Orders",
    customers: "Customers",
    inventory: "Inventory",
  };

  return (
    <header className="topbar">
      <button className="mobile-menu" onClick={onMenu} aria-label="Open navigation">☰</button>

      <div className="breadcrumbs">
        <strong>{labels[page] || "Overview"}</strong>
      </div>

      <div className="topbar-actions">

        <button className="icon-button notification-button fa fa-bell" aria-label="Notifications" onClick={() => window.alert("You're all caught up!")}>
          <i />
        </button>

        <div className="avatar avatar-purple top-avatar">AK</div>
      </div>
    </header>
  );
}
