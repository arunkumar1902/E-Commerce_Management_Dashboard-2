
import { useCallback, useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { Toast } from "./components/UI";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Inventory from "./pages/Inventory";

import {
  loadProducts,
  loadOrders,
  loadCustomers,
  saveData,
} from "./utils/storage";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState(loadProducts);
  const [orders, setOrders] = useState(loadOrders);
  const [customers, setCustomers] = useState(loadCustomers);
  const [toast, setToast] = useState(null);
  const [loadError, setLoadError] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const pageRoutes = {
    overview: "/",
    products: "/products",
    orders: "/orders",
    customers: "/customers",
    inventory: "/inventory",
  };

  const routePages = {
    "/": "overview",
    "/products": "products",
    "/orders": "orders",
    "/customers": "customers",
    "/inventory": "inventory",
  };

  const page = routePages[location.pathname] || "overview";

  const setPage = useCallback(
    (nextPage) => {
      navigate(pageRoutes[nextPage] || "/");
      setSidebarOpen(false);
    },
    [navigate]
  );

  const notify = useCallback(
    (message, type = "success") => {
      setToast({ message, type, id: Date.now() });
    },
    []
  );

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  useEffect(() => {
    const ok =
      saveData("commerce_products", products) &&
      saveData("commerce_orders", orders) &&
      saveData("commerce_customers", customers);

    if (!ok) {
      setLoadError(true);
    }
  }, [products, orders, customers]);

  return (
    <div className="app-shell">
      <Sidebar
        page={page}
        setPage={setPage}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="main-shell">
        <Topbar
          page={page}
          onMenu={() => setSidebarOpen(true)}
        />

        {loadError && (
          <div className="storage-warning">
            Your browser storage may be full. Changes might not persist
            after refresh.
          </div>
        )}

        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                products={products}
                orders={orders}
                customers={customers}
                setPage={setPage}
              />
            }
          />

          <Route
            path="/products"
            element={
              <Products
                products={products}
                setProducts={setProducts}
                notify={notify}
              />
            }
          />

          <Route
            path="/orders"
            element={
              <Orders
                orders={orders}
                setOrders={setOrders}
                notify={notify}
              />
            }
          />

          <Route
            path="/customers"
            element={
              <Customers
                customers={customers}
                setCustomers={setCustomers}
                notify={notify}
              />
            }
          />

          <Route
            path="/inventory"
            element={
              <Inventory
                products={products}
                setProducts={setProducts}
                notify={notify}
              />
            }
          />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>

        <footer className="app-footer">
          <span>© 2026 CommerceHQ</span>
          <span>
            Built for better commerce <b>✦</b>
          </span>
        </footer>
      </main>

      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}
