
import { seedProducts, seedOrders, seedCustomers } from "../data/seed";

const read = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export const loadProducts = () => read("commerce_products", seedProducts);

export const loadOrders = () => read("commerce_orders", seedOrders);

export const loadCustomers = () => read("commerce_customers", seedCustomers);

export const saveData = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};
