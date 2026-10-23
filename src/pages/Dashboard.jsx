
import { Badge } from "../components/UI";

const money = (n) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const bars = [42, 58, 47, 72, 54, 68, 49, 78, 62, 86, 71, 96];

const days = [
  "May 1", "May 3", "May 5", "May 7", "May 9", "May 11",
  "May 13", "May 15", "May 17", "May 19", "May 21", "May 23",
];

export default function Dashboard({ products, orders, customers, setPage }) {
  const revenue = orders.filter((o) => o.payment === "Paid").reduce((s, o) => s + o.total, 0) + 18420;
  const pending = orders.filter((o) => ["Pending", "Processing"].includes(o.status)).length;
  const lowStock = products.filter((p) => p.stock <= 12 && p.status !== "Archived").length;


  const stats = [
    {
      label: "Total revenue",
      value: money(revenue),
      change: "+12.8%",
      note: "vs. previous month",
      icon: "$",
      tone: "violet",
    },
    {
      label: "Total orders",
      value: (orders.length + 1248).toLocaleString(),
      change: "+8.2%",
      note: "vs. previous month",
      icon: "▤",
      tone: "blue",
    },
    {
      label: "Total customers",
      value: (customers.length + 846).toLocaleString(),
      change: "+18.4%",
      note: "vs. previous month",
      icon: "♙",
      tone: "orange",
    },
    {
      label: "Avg. order value",
      value: "$86.40",
      change: "+4.6%",
      note: "vs. previous month",
      icon: "↗",
      tone: "green",
    },
  ];

  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "2-digit",
    year: "numeric",
  }).toUpperCase();

  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <p className="eyebrow">{todayDate}</p>
          <h1>Good afternoon, Jordan <span className="wave">✦</span></h1>
          <p className="page-subtitle">Here's what's happening with your store today.</p>
        </div>
        <button className="btn btn-secondary" onClick={() => window.print()}>↓ Export report</button>
      </div>

      <div className="stats-grid">
        {stats.map((s, i) => (
          <article className="stat-card" key={s.label}>
            <div className="stat-top">
              <span>{s.label}</span>
              <span className={`stat-icon ${s.tone}`}>{s.icon}</span>
            </div>

            <div className="stat-value">{s.value}</div>

            <div className="stat-foot">
              <span className="change-pill">↗ {s.change}</span>
              <span>{s.note}</span>
            </div>

            <div className={`sparkline spark-${i}`}>
              <svg viewBox="0 0 100 26" preserveAspectRatio="none">
                <polyline points="0,20 12,15 24,18 36,9 48,13 60,7 72,11 84,4 100,2" />
              </svg>
            </div>
          </article>
        ))}
      </div>

      <div className="dashboard-grid">
        <section className="panel revenue-panel">
          <div className="panel-header">
            <div>
              <h2>Revenue overview</h2>
              <p>Track your store's performance over time.</p>
            </div>

            <select className="filter-select" defaultValue="30">
              <option value="30">Last 30 days</option>
              <option value="7">Last 7 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>

          <div className="chart-legend">
            <span><i className="legend-dot purple-dot" /> Revenue</span>
            <span><i className="legend-dot pale-dot" /> Orders</span>
            <span className="chart-total">$24,580.00 <small>↑ 12.8%</small></span>
          </div>

          <div className="chart-area">
            <div className="y-labels">
              <span>$8k</span>
              <span>$6k</span>
              <span>$4k</span>
              <span>$2k</span>
              <span>$0</span>
            </div>

            <div className="bar-chart">
              {bars.map((b, i) => (
                <div className="bar-column" key={i}>
                  <div className="bar-pair">
                    <div className="bar pale-bar" style={{ height: `${b * 0.62}%` }} />
                    <div className="bar purple-bar" style={{ height: `${b}%` }} />
                  </div>
                  <span>{days[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="panel inventory-panel">
          <div className="panel-header">
            <div>
              <h2>Inventory alerts</h2>
              <p>Products that need your attention.</p>
            </div>
            <button className="text-button" onClick={() => setPage("inventory")}>View all ↗</button>
          </div>

          <div className="alert-summary">
            <div className="alert-number">{lowStock}</div>
            <div>
              <strong>Products running low</strong>
              <p>Review stock to avoid missed sales.</p>
            </div>
          </div>

          <div className="alert-list">
            {products.filter((p) => p.stock <= 12 && p.status !== "Archived").slice(0, 3).map((p) => (
              <div className="alert-row" key={p.id}>
                <div className="product-emoji small-emoji">{p.image}</div>
                <div className="alert-product">
                  <strong>{p.name}</strong>
                  <span>{p.sku}</span>
                </div>
                <div className="stock-remaining">
                  <strong>{p.stock}</strong>
                  <span>left</span>
                </div>
              </div>
            ))}

            {!lowStock && <p className="muted-text">All products are well stocked.</p>}
          </div>

          <button className="btn btn-secondary full-width" onClick={() => setPage("inventory")}>Manage inventory</button>
        </section>
      </div>

      <section className="panel orders-panel">
        <div className="panel-header">
          <div>
            <h2>Recent orders</h2>
            <p>You have {pending} orders that need attention.</p>
          </div>
          <button className="text-button" onClick={() => setPage("orders")}>View all orders ↗</button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ORDER</th>
                <th>CUSTOMER</th>
                <th>DATE</th>
                <th>STATUS</th>
                <th>AMOUNT</th>
                <th>PAYMENT</th>
              </tr>
            </thead>

            <tbody>
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id}>
                  <td><strong className="id-text">{o.id}</strong></td>
                  <td>
                    <div className="customer-cell">
                      <div className="avatar avatar-soft">{o.customer.split(" ").map((x) => x[0]).join("")}</div>
                      <div>
                        <strong>{o.customer}</strong>
                        <span>{o.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>{new Date(o.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                  <td><Badge>{o.status}</Badge></td>
                  <td className="amount-cell">{money(o.total)}</td>
                  <td><Badge>{o.payment}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
