import api from "./axios";

export const getApiaries = () => api.get("/apiaries");
export const getApiary = (id) => api.get(`/apiaries/${id}`);
export const createApiary = (data) => api.post("/apiaries", data);
export const updateApiary = (id, data) => api.put(`/apiaries/${id}`, data);
export const deleteApiary = (id) => api.delete(`/apiaries/${id}`);
