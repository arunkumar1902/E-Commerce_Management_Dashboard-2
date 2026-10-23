
import { useMemo, useState } from "react";
import {
    Badge,
    Button,
    EmptyState,
    Modal,
    Pagination,
    SearchBox,
    Select,
} from "../components/UI";

const blank = {
    name: "",
    category: "Electronics",
    price: "",
    stock: "",
    status: "Active",
    sku: "",
    image: "📦",
};

const money = (n) =>
    Number(n).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });

export default function Products({ products, setProducts, notify }) {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("All categories");
    const [status, setStatus] = useState("All status");
    const [sort, setSort] = useState("name");
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(blank);
    const [errors, setErrors] = useState({});

    const pageSize = 6;

    const filtered = useMemo(
        () =>
            products
                .filter(
                    (p) =>
                        (p.name + " " + p.sku + " " + p.id)
                            .toLowerCase()
                            .includes(query.toLowerCase()) &&
                        (category === "All categories" || p.category === category) &&
                        (status === "All status" || p.status === status)
                )
                .sort((a, b) =>
                    sort === "price"
                        ? a.price - b.price
                        : sort === "stock"
                            ? a.stock - b.stock
                            : a.name.localeCompare(b.name)
                ),
        [products, query, category, status, sort]
    );

    const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

    const edit = (p) => {
        setForm(
            p
                ? { ...p, price: String(p.price), stock: String(p.stock) }
                : { ...blank }
        );
        setErrors({});
        setModal({ type: p ? "edit" : "add", product: p });
    };

    const validate = () => {
        const e = {};

        if (!form.name.trim()) {
            e.name = "Product name is required.";
        }

        if (!form.sku.trim()) {
            e.sku = "SKU is required.";
        }

        if (
            form.price === "" ||
            !Number.isFinite(Number(form.price)) ||
            Number(form.price) < 0
        ) {
            e.price = "Enter a valid non-negative price.";
        }

        if (
            form.stock === "" ||
            !Number.isInteger(Number(form.stock)) ||
            Number(form.stock) < 0
        ) {
            e.stock = "Stock must be a whole number, 0 or more.";
        }

        setErrors(e);
        return !Object.keys(e).length;
    };

    const save = (e) => {
        e.preventDefault();

        if (!validate()) return;

        if (modal.type === "add") {
            setProducts([
                {
                    ...form,
                    id: `PRD-${Date.now().toString().slice(-6)}`,
                    price: Number(form.price),
                    stock: Number(form.stock),
                    sales: 0,
                },
                ...products,
            ]);

            notify("Product created successfully.");
        } else {
            setProducts(
                products.map((p) =>
                    p.id === modal.product.id
                        ? {
                              ...form,
                              id: p.id,
                              price: Number(form.price),
                              stock: Number(form.stock),
                              sales: p.sales,
                          }
                        : p
                )
            );

            notify("Product updated successfully.");
        }

        setModal(null);
    };

    const remove = (p) => {
        if (window.confirm(`Delete "${p.name}"? This cannot be undone.`)) {
            setProducts(products.filter((x) => x.id !== p.id));
            notify("Product deleted.");
        }
    };

    return (
        <div className="page-content">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">CATALOG</p>
                    <h1>Products</h1>
                    <p className="page-subtitle">
                        Manage your product catalog, pricing, and availability.
                    </p>
                </div>

                <Button onClick={() => edit(null)}>+ Add product</Button>
            </div>

            <div className="stats-grid compact-stats">
                <div className="mini-stat">
                    <span>Total products</span>
                    <strong>{products.length}</strong>
                    <small>Across all categories</small>
                </div>

                <div className="mini-stat">
                    <span>Active products</span>
                    <strong>{products.filter((p) => p.status === "Active").length}</strong>
                    <small className="positive-text">● Available in store</small>
                </div>

                <div className="mini-stat">
                    <span>Low stock</span>
                    <strong>
                        {products.filter((p) => p.stock > 0 && p.stock <= 12).length}
                    </strong>
                    <small className="warning-text">Needs restocking</small>
                </div>

                <div className="mini-stat">
                    <span>Out of stock</span>
                    <strong>{products.filter((p) => p.stock === 0).length}</strong>
                    <small>Currently unavailable</small>
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
                        placeholder="Search products or SKU..."
                    />

                    <div className="toolbar-filters">
                        <Select
                            label="Filter by category"
                            value={category}
                            onChange={(v) => {
                                setCategory(v);
                                setPage(1);
                            }}
                        >
                            <option>All categories</option>
                            {[...new Set(products.map((p) => p.category))]
                                .sort()
                                .map((c) => (
                                    <option key={c}>{c}</option>
                                ))}
                        </Select>

                        <Select
                            label="Filter by status"
                            value={status}
                            onChange={(v) => {
                                setStatus(v);
                                setPage(1);
                            }}
                        >
                            <option>All status</option>
                            <option>Active</option>
                            <option>Draft</option>
                            <option>Archived</option>
                        </Select>

                        <Select
                            label="Sort products"
                            value={sort}
                            onChange={setSort}
                        >
                            <option value="name">Name A–Z</option>
                            <option value="price">Price: low first</option>
                            <option value="stock">Stock: low first</option>
                        </Select>
                    </div>
                </div>

                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        aria-label="Select all products"
                                        onChange={(e) =>
                                            notify(
                                                e.target.checked
                                                    ? "Bulk selection is a UI preview."
                                                    : "Selection cleared."
                                            )
                                        }
                                    />
                                </th>
                                <th>PRODUCT</th>
                                <th>SKU</th>
                                <th>CATEGORY</th>
                                <th>PRICE</th>
                                <th>STOCK</th>
                                <th>STATUS</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>

                        <tbody>
                            {visible.map((p) => (
                                <tr key={p.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            aria-label={`Select ${p.name}`}
                                        />
                                    </td>

                                    <td>
                                        <div className="product-cell">
                                            <div className="product-emoji">
                                                {p.image || "📦"}
                                            </div>
                                            <div>
                                                <strong>{p.name}</strong>
                                                <span>{p.id}</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="muted-cell">{p.sku}</td>
                                    <td>{p.category}</td>
                                    <td className="amount-cell">{money(p.price)}</td>

                                    <td>
                                        <span className={p.stock <= 12 ? "stock-low" : ""}>
                                            {p.stock}
                                        </span>
                                    </td>

                                    <td><Badge>{p.status}</Badge></td>

                                    <td>
                                        <div className="row-actions">
                                            <button
                                                title="View product"
                                                onClick={() =>
                                                    setModal({ type: "view", product: p })
                                                }
                                            >
                                                <span className="fa fa-eye"></span>
                                            </button>

                                            <button
                                                title="Edit product"
                                                onClick={() => edit(p)}
                                            >
                                                <span className="fa fa-edit"></span>
                                            </button>

                                            <button
                                                title="Delete product"
                                                className="danger-action"
                                                onClick={() => remove(p)}
                                            >
                                                <span className="fa fa-close"></span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {!visible.length && (
                        <EmptyState
                            title="No products found"
                            description="Try a different search or add a new product."
                        />
                    )}
                </div>

                <Pagination
                    page={page}
                    setPage={setPage}
                    total={filtered.length}
                    pageSize={pageSize}
                />
            </section>

            {modal?.type === "view" && (
                <Modal
                    title="Product details"
                    onClose={() => setModal(null)}
                >
                    <div className="product-detail-hero">
                        <div className="product-emoji detail-emoji">
                            {modal.product.image}
                        </div>

                        <div>
                            <h3>{modal.product.name}</h3>
                            <p>{modal.product.id}</p>
                            <Badge>{modal.product.status}</Badge>
                        </div>
                    </div>

                    <div className="detail-grid">
                        <div>
                            <span>SKU</span>
                            <strong>{modal.product.sku}</strong>
                        </div>

                        <div>
                            <span>Category</span>
                            <strong>{modal.product.category}</strong>
                        </div>

                        <div>
                            <span>Price</span>
                            <strong>{money(modal.product.price)}</strong>
                        </div>

                        <div>
                            <span>Stock quantity</span>
                            <strong>{modal.product.stock}</strong>
                        </div>

                        <div>
                            <span>Units sold</span>
                            <strong>{modal.product.sales || 0}</strong>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <Button variant="secondary" onClick={() => setModal(null)}>
                            Close
                        </Button>
                        <Button onClick={() => edit(modal.product)}>
                            Edit product
                        </Button>
                    </div>
                </Modal>
            )}

            {(modal?.type === "add" || modal?.type === "edit") && (
                <Modal
                    title={modal.type === "add" ? "Add new product" : "Edit product"}
                    onClose={() => setModal(null)}
                    wide
                >
                    <form onSubmit={save} noValidate>
                        <div className="form-grid">
                            <label className="form-field span-2">
                                Product name
                                <input
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({ ...form, name: e.target.value })
                                    }
                                    placeholder="e.g. Wireless headphones"
                                />
                                {errors.name && (
                                    <small className="field-error">{errors.name}</small>
                                )}
                            </label>

                            <label className="form-field">
                                SKU
                                <input
                                    value={form.sku}
                                    onChange={(e) =>
                                        setForm({ ...form, sku: e.target.value })
                                    }
                                    placeholder="e.g. AUD-001"
                                />
                                {errors.sku && (
                                    <small className="field-error">{errors.sku}</small>
                                )}
                            </label>

                            <label className="form-field">
                                Category
                                <select
                                    value={form.category}
                                    onChange={(e) =>
                                        setForm({ ...form, category: e.target.value })
                                    }
                                >
                                    {["Electronics", "Accessories", "Home", "Fashion", "Beauty", "Sports"].map(
                                        (c) => <option key={c}>{c}</option>
                                    )}
                                </select>
                            </label>

                            <label className="form-field">
                                Price (USD)
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.price}
                                    onChange={(e) =>
                                        setForm({ ...form, price: e.target.value })
                                    }
                                    placeholder="0.00"
                                />
                                {errors.price && (
                                    <small className="field-error">{errors.price}</small>
                                )}
                            </label>

                            <label className="form-field">
                                Stock quantity
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={form.stock}
                                    onChange={(e) =>
                                        setForm({ ...form, stock: e.target.value })
                                    }
                                    placeholder="0"
                                />
                                {errors.stock && (
                                    <small className="field-error">{errors.stock}</small>
                                )}
                            </label>

                            <label className="form-field">
                                Status
                                <select
                                    value={form.status}
                                    onChange={(e) =>
                                        setForm({ ...form, status: e.target.value })
                                    }
                                >
                                    <option>Active</option>
                                    <option>Draft</option>
                                    <option>Archived</option>
                                </select>
                            </label>

                            <label className="form-field">
                                Product icon
                                <select
                                    value={form.image}
                                    onChange={(e) =>
                                        setForm({ ...form, image: e.target.value })
                                    }
                                >
                                    {["📦", "🎧", "🎒", "☕", "⌚", "👟", "💡", "🧴", "👕", "🛍️"].map(
                                        (i) => <option key={i}>{i}</option>
                                    )}
                                </select>
                            </label>
                        </div>

                        <div className="modal-actions">
                            <Button variant="secondary" onClick={() => setModal(null)}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                {modal.type === "add" ? "Create product" : "Save changes"}
                            </Button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}
