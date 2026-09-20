import api from "./axios";

export const getHives = (params) => api.get("/hives", { params });
export const getHive = (id) => api.get(`/hives/${id}`);
export const createHive = (data) => api.post("/hives", data);
export const updateHive = (id, data) => api.put(`/hives/${id}`, data);
export const deleteHive = (id) => api.delete(`/hives/${id}`);
