
import { useMemo, useState } from "react";
import { Badge, Button, EmptyState, Modal, Pagination, SearchBox, Select } from "../components/UI";

const money = (n) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function Customers({ customers, setCustomers, notify }) {
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("All status");
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState({ name: "", email: "", status: "Active" });
    const [error, setError] = useState("");
    const size = 6;

    const filtered = useMemo(
        () =>
            customers.filter(
                (c) =>
                    (c.name + " " + c.email + " " + c.id).toLowerCase().includes(query.toLowerCase()) &&
                    (status === "All status" || c.status === status)
            ),
        [customers, query, status]
    );

    const save = (e) => {
        e.preventDefault();

        if (!form.name.trim()) {
            setError("Customer name is required.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            setError("Enter a valid email address.");
            return;
        }

        if (customers.some((c) => c.email.toLowerCase() === form.email.toLowerCase() && c.id !== modal?.customer?.id)) {
            setError("A customer with this email already exists.");
            return;
        }

        if (modal?.type === "edit") {
            setCustomers(customers.map((c) => c.id === modal.customer.id ? { ...c, ...form } : c));
            notify("Customer updated.");
        } else {
            setCustomers([
                {
                    id: `CUS-${Date.now().toString().slice(-5)}`,
                    ...form,
                    orders: 0,
                    spent: 0,
                    joined: new Date().toISOString().slice(0, 10),
                },
                ...customers,
            ]);
            notify("Customer added.");
        }

        setModal(null);
    };

    const open = (type, c) => {
        setForm(c ? { name: c.name, email: c.email, status: c.status } : { name: "", email: "", status: "Active" });
        setError("");
        setModal({ type, customer: c });
    };

    return (
        <div className="page-content">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">RELATIONSHIPS</p>
                    <h1>Customers</h1>
                    <p className="page-subtitle">Get to know your customers and build lasting relationships.</p>
                </div>
                <Button onClick={() => open("add")}>＋ Add customer</Button>
            </div>

            <div className="stats-grid compact-stats">
                <div className="mini-stat">
                    <span>Total customers</span>
                    <strong>{customers.length}</strong>
                    <small>All registered customers</small>
                </div>

                <div className="mini-stat">
                    <span>Active customers</span>
                    <strong>{customers.filter((c) => c.status === "Active").length}</strong>
                    <small className="positive-text">● Engaged customers</small>
                </div>

                <div className="mini-stat">
                    <span>Repeat customers</span>
                    <strong>{customers.filter((c) => c.orders > 1).length}</strong>
                    <small>More than one order</small>
                </div>

                <div className="mini-stat">
                    <span>Lifetime sales</span>
                    <strong>{money(customers.reduce((s, c) => s + c.spent, 0))}</strong>
                    <small>Across customer accounts</small>
                </div>
            </div>

            <section className="panel">
                <div className="table-toolbar">
                    <SearchBox value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder="Search customers..." />

                    <Select
                        label="Filter customers by status"
                        value={status}
                        onChange={(v) => { setStatus(v); setPage(1); }}
                    >
                        <option>All status</option>
                        <option>Active</option>
                        <option>Inactive</option>
                    </Select>
                </div>

                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>CUSTOMER</th>
                                <th>CUSTOMER ID</th>
                                <th>JOINED</th>
                                <th>ORDERS</th>
                                <th>TOTAL SPENT</th>
                                <th>STATUS</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filtered.slice((page - 1) * size, page * size).map((c) => (
                                <tr key={c.id}>
                                    <td>
                                        <div className="customer-cell">
                                            <div className="avatar avatar-soft">{c.name.split(" ").map((x) => x[0]).join("")}</div>
                                            <div>
                                                <strong>{c.name}</strong>
                                                <span>{c.email}</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="id-text">{c.id}</td>
                                    <td>{c.joined}</td>
                                    <td>{c.orders}</td>
                                    <td className="amount-cell">{money(c.spent)}</td>
                                    <td><Badge>{c.status}</Badge></td>

                                    <td>
                                        <div className="row-actions">
                                            <button title="Edit customer" onClick={() => open("edit", c)}>
                                                <span className="fa fa-edit"></span>
                                            </button>
                                            <button
                                                title="Delete customer"
                                                className="danger-action"
                                                onClick={() => {
                                                    if (window.confirm(`Delete ${c.name}?`)) {
                                                        setCustomers(customers.filter((x) => x.id !== c.id));
                                                        notify("Customer deleted.");
                                                    }
                                                }}
                                            >
                                                <span className="fa fa-close"></span>

                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {!filtered.length && <EmptyState title="No customers found" description="Try another search or add a customer." />}
                </div>

                <Pagination page={page} setPage={setPage} total={filtered.length} pageSize={size} />
            </section>

            {modal && (
                <Modal title={modal.type === "add" ? "Add customer" : "Edit customer"} onClose={() => setModal(null)}>
                    <form onSubmit={save} noValidate>
                        <div className="form-grid">
                            <label className="form-field span-2">
                                Full name
                                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Customer full name" />
                                {error && error.includes("name") && <small className="field-error">{error}</small>}
                            </label>

                            <label className="form-field span-2">
                                Email address
                                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@example.com" />
                                {error && error.includes("email") && <small className="field-error">{error}</small>}
                            </label>

                            <label className="form-field span-2">
                                Account status
                                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                                    <option>Active</option>
                                    <option>Inactive</option>
                                </select>
                            </label>

                            {error && error.includes("already exists") && <p className="field-error span-2">{error}</p>}
                        </div>

                        <div className="modal-actions">
                            <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
                            <Button type="submit">Save customer</Button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}
