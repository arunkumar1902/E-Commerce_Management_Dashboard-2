
import { useMemo, useState } from "react";
import { Badge, EmptyState, Pagination, SearchBox, Select } from "../components/UI";

const money = (n) =>
    n.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });

export default function Orders({ orders, setOrders, notify }) {
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("All status");
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState(null);

    const size = 6;

    const filtered = useMemo(
        () =>
            orders.filter(
                (o) =>
                    (o.id + " " + o.customer + " " + o.email)
                        .toLowerCase()
                        .includes(query.toLowerCase()) &&
                    (status === "All status" || o.status === status)
            ),
        [orders, query, status]
    );

    const update = (id, next) => {
        setOrders(
            orders.map((o) =>
                o.id === id
                    ? {
                          ...o,
                          status: next,
                          payment: next === "Cancelled" ? "Refunded" : o.payment,
                      }
                    : o
            )
        );

        notify(`Order ${id} updated.`);
        setSelected(null);
    };

    return (
        <div className="page-content">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">SALES</p>
                    <h1>Orders</h1>
                    <p className="page-subtitle">
                        Track, process, and fulfill customer orders.
                    </p>
                </div>

                <button
                    className="btn btn-secondary"
                    onClick={() => {
                        const csv = [
                            "Order,Customer,Date,Status,Total,Payment",
                            ...orders.map((o) =>
                                [o.id, o.customer, o.date, o.status, o.total, o.payment].join(",")
                            ),
                        ].join("\n");

                        const a = document.createElement("a");
                        a.href = URL.createObjectURL(
                            new Blob([csv], { type: "text/csv" })
                        );
                        a.download = "orders.csv";
                        a.click();

                        URL.revokeObjectURL(a.href);
                        notify("Orders exported to CSV.");
                    }}
                >
                    ↓ Export orders
                </button>
            </div>

            <div className="stats-grid compact-stats">
                <div className="mini-stat">
                    <span>All orders</span>
                    <strong>{orders.length}</strong>
                    <small>Total order records</small>
                </div>

                <div className="mini-stat">
                    <span>Processing</span>
                    <strong>{orders.filter((o) => o.status === "Processing").length}</strong>
                    <small className="warning-text">Ready to be fulfilled</small>
                </div>

                <div className="mini-stat">
                    <span>Shipped</span>
                    <strong>{orders.filter((o) => o.status === "Shipped").length}</strong>
                    <small>On their way</small>
                </div>

                <div className="mini-stat">
                    <span>Delivered</span>
                    <strong>{orders.filter((o) => o.status === "Delivered").length}</strong>
                    <small className="positive-text">Successfully completed</small>
                </div>
            </div>

            <section className="panel">
                <div className="table-toolbar">
                    <SearchBox
                        value={query}
                        onChange={(v) => {
                            setQuery(v);
                            setPage(1);
                        }}
                        placeholder="Search order or customer..."
                    />

                    <Select
                        label="Filter orders by status"
                        value={status}
                        onChange={(v) => {
                            setStatus(v);
                            setPage(1);
                        }}
                    >
                        <option>All status</option>
                        {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map(
                            (s) => (
                                <option key={s}>{s}</option>
                            )
                        )}
                    </Select>
                </div>

                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>ORDER</th>
                                <th>CUSTOMER</th>
                                <th>DATE</th>
                                <th>ITEMS</th>
                                <th>STATUS</th>
                                <th>TOTAL</th>
                                <th>PAYMENT</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filtered.slice((page - 1) * size, page * size).map((o) => (
                                <tr key={o.id}>
                                    <td>
                                        <strong className="id-text">{o.id}</strong>
                                    </td>

                                    <td>
                                        <div className="customer-cell">
                                            <div className="avatar avatar-soft">
                                                {o.customer.split(" ").map((x) => x[0]).join("")}
                                            </div>
                                            <div>
                                                <strong>{o.customer}</strong>
                                                <span>{o.email}</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td>{o.date}</td>
                                    <td>{o.items}</td>
                                    <td><Badge>{o.status}</Badge></td>
                                    <td className="amount-cell">{money(o.total)}</td>
                                    <td><Badge>{o.payment}</Badge></td>

                                    <td>
                                        <button
                                            className="btn btn-small btn-secondary"
                                            onClick={() => setSelected(o)}
                                        >
                                            Manage
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {!filtered.length && (
                        <EmptyState
                            title="No matching orders"
                            description="Try adjusting the search or status filter."
                        />
                    )}
                </div>

                <Pagination
                    page={page}
                    setPage={setPage}
                    total={filtered.length}
                    pageSize={size}
                />
            </section>

            {selected && (
                <div
                    className="modal-backdrop"
                    onMouseDown={(e) =>
                        e.target === e.currentTarget && setSelected(null)
                    }
                >
                    <section className="modal" role="dialog" aria-modal="true">
                        <div className="modal-heading">
                            <h2>Manage {selected.id}</h2>
                            <button
                                className="close-button"
                                onClick={() => setSelected(null)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="order-detail">
                            <p>
                                <span>Customer</span>
                                <strong>{selected.customer}</strong>
                            </p>

                            <p>
                                <span>Order total</span>
                                <strong>{money(selected.total)}</strong>
                            </p>

                            <p>
                                <span>Payment</span>
                                <Badge>{selected.payment}</Badge>
                            </p>

                            <p>
                                <span>Current status</span>
                                <Badge>{selected.status}</Badge>
                            </p>
                        </div>

                        <label className="form-field">
                            Update order status
                            <select id="order-status" defaultValue={selected.status}>
                                <option>Pending</option>
                                <option>Processing</option>
                                <option>Shipped</option>
                                <option>Delivered</option>
                                <option>Cancelled</option>
                            </select>
                        </label>

                        <div className="modal-actions">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setSelected(null)}
                            >
                                Close
                            </button>

                            <button
                                className="btn btn-primary"
                                onClick={() =>
                                    update(
                                        selected.id,
                                        document.getElementById("order-status").value
                                    )
                                }
                            >
                                Save status
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}
