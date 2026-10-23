
import { useMemo, useState } from "react";
import { Badge, EmptyState, Pagination, SearchBox, Select } from "../components/UI";

export default function Inventory({ products, setProducts, notify }) {
    const [query, setQuery] = useState("");
    const [stock, setStock] = useState("All stock");
    const [page, setPage] = useState(1);

    const size = 6;

    const filtered = useMemo(
        () =>
            products.filter(
                (p) =>
                    (p.name + " " + p.sku + " " + p.id)
                        .toLowerCase()
                        .includes(query.toLowerCase()) &&
                    (
                        stock === "All stock" ||
                        (stock === "In stock" && p.stock > 12) ||
                        (stock === "Low stock" && p.stock > 0 && p.stock <= 12) ||
                        (stock === "Out of stock" && p.stock === 0)
                    )
            ),
        [products, query, stock]
    );

    const change = (p, delta) => {
        const amount = Number(
            window.prompt(
                `Adjust stock for ${p.name}. Enter a positive number to add or negative to remove:`,
                String(delta)
            )
        );

        if (!Number.isInteger(amount) || amount === 0) return;

        if (p.stock + amount < 0) {
            notify("Stock cannot be less than zero.", "error");
            return;
        }

        setProducts(
            products.map((x) =>
                x.id === p.id
                    ? { ...x, stock: x.stock + amount }
                    : x
            )
        );

        notify(`Stock updated for ${p.name}.`);
    };

    return (
        <div className="page-content">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">OPERATIONS</p>
                    <h1>Inventory</h1>
                    <p className="page-subtitle">
                        Monitor stock levels and make adjustments before items run out.
                    </p>
                </div>

                <button
                    className="btn btn-secondary"
                    onClick={() => {
                        const rows = [
                            "Product,SKU,Category,Stock,Status",
                            ...products.map(
                                (p) =>
                                    `${p.name},${p.sku},${p.category},${p.stock},${p.stock === 0
                                        ? "Out of stock"
                                        : p.stock <= 12
                                            ? "Low stock"
                                            : "In stock"
                                    }`
                            ),
                        ].join("\n");

                        const a = document.createElement("a");
                        a.href = URL.createObjectURL(
                            new Blob([rows], { type: "text/csv" })
                        );
                        a.download = "inventory.csv";
                        a.click();

                        URL.revokeObjectURL(a.href);
                        notify("Inventory exported.");
                    }}
                >
                    ↓ Export inventory
                </button>
            </div>

            <div className="stats-grid compact-stats">
                <div className="mini-stat">
                    <span>Total SKUs</span>
                    <strong>{products.length}</strong>
                    <small>Unique products</small>
                </div>

                <div className="mini-stat">
                    <span>Healthy stock</span>
                    <strong>{products.filter((p) => p.stock > 12).length}</strong>
                    <small className="positive-text">● Stock available</small>
                </div>

                <div className="mini-stat">
                    <span>Low stock</span>
                    <strong>
                        {products.filter((p) => p.stock > 0 && p.stock <= 12).length}
                    </strong>
                    <small className="warning-text">Restock soon</small>
                </div>

                <div className="mini-stat">
                    <span>Out of stock</span>
                    <strong>{products.filter((p) => p.stock === 0).length}</strong>
                    <small className="danger-text">Restock immediately</small>
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
                        placeholder="Search inventory..."
                    />

                    <Select
                        label="Filter inventory"
                        value={stock}
                        onChange={(v) => {
                            setStock(v);
                            setPage(1);
                        }}
                    >
                        <option>All stock</option>
                        <option>In stock</option>
                        <option>Low stock</option>
                        <option>Out of stock</option>
                    </Select>
                </div>

                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>PRODUCT</th>
                                <th>SKU</th>
                                <th>CATEGORY</th>
                                <th>STOCK LEVEL</th>
                                <th>STOCK STATUS</th>
                                <th>QUICK ADJUST</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filtered.slice((page - 1) * size, page * size).map((p) => {
                                const state =
                                    p.stock === 0
                                        ? "Out of stock"
                                        : p.stock <= 12
                                            ? "Low stock"
                                            : "In stock";

                                return (
                                    <tr key={p.id}>
                                        <td>
                                            <div className="product-cell">
                                                <div className="product-emoji">{p.image}</div>
                                                <div>
                                                    <strong>{p.name}</strong>
                                                    <span>{p.id}</span>
                                                </div>
                                            </div>
                                        </td>

                                        <td>{p.sku}</td>
                                        <td>{p.category}</td>

                                        <td>
                                            <div className="stock-bar-wrap">
                                                <div className="stock-track">
                                                    <div
                                                        className={`stock-fill ${state === "Low stock"
                                                                ? "fill-amber"
                                                                : state === "Out of stock"
                                                                    ? "fill-red"
                                                                    : ""
                                                            }`}
                                                        style={{
                                                            width: `${Math.min(100, p.stock / 1.2)}%`,
                                                        }}
                                                    />
                                                </div>
                                                <strong>{p.stock}</strong>
                                            </div>
                                        </td>

                                        <td>
                                            <Badge>{state}</Badge>
                                        </td>

                                        <td>
                                            <div className="adjust-actions">
                                                <button
                                                    disabled={p.stock === 0}
                                                    onClick={() => change(p, -1)}
                                                    aria-label={`Remove one ${p.name}`}
                                                >
                                                    −
                                                </button>

                                                <button
                                                    onClick={() => change(p, 1)}
                                                    aria-label={`Add stock for ${p.name}`}
                                                >
                                                    ＋
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {!filtered.length && (
                        <EmptyState
                            title="No inventory found"
                            description="Try another search or stock filter."
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

            <div className="inventory-note">
                <span>ⓘ</span>
                <div>
                    <strong>Stock level guide</strong>
                    <p>
                        <b className="positive-text">In stock:</b> more than 12 units
                        &nbsp;
                        <b className="warning-text">Low stock:</b> 1–12 units
                        &nbsp;
                        <b className="danger-text">Out of stock:</b> 0 units
                    </p>
                </div>
            </div>
        </div>
    );
}
