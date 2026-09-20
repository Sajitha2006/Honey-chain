import api from "./axios";

export const getAlerts = () => api.get("/alerts");
export const getMyAlerts = getAlerts;
export const getUnreadAlerts = () => api.get("/alerts/unread");
export const markAlertRead = (id) => api.put(`/alerts/${id}/read`);
export const markAlertAsRead = markAlertRead;
export const resolveAlert = (id) => api.put(`/alerts/${id}/resolve`);
