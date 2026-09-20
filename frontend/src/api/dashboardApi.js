import api from "./axios";

export const getDashboardStats = () => api.get("/dashboard");
export const getRecentAlerts = () => api.get("/alerts");
export const getRecentDetections = () => api.get("/disease");
export const getRecentBatches = () => api.get("/traceability/my-batches");
