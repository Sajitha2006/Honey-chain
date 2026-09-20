import api from "./axios";

export const login = (credentials) => api.post("/auth/login", credentials);
export const register = (data) => api.post("/auth/register", data);
export const getProfile = () => api.get("/auth/profile");
export const updateProfile = (data) => api.put("/auth/profile", data);
