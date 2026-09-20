import api from "./axios";

export const getMyOrders = () => api.get("/orders/my-orders");
export const getBeekeeperOrders = () => api.get("/orders/beekeeper");
export const getOrder = (id) => api.get(`/orders/my-orders/${id}`);
export const createOrder = (data) => api.post("/orders", data);
export const cancelOrder = (id) => api.put(`/orders/my-orders/${id}/cancel`);
export const updateOrderStatus = (id, status) =>
  api.put(`/orders/beekeeper/${id}/status`, { status });

