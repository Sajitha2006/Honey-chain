import api from "./axios";

export const getLatestSensorData = (hiveId) =>
  api.get(`/sensors/${hiveId}/latest`);

export const getSensorHistory = (hiveId) =>
  api.get(`/sensors/${hiveId}/history`);

export const postSensorData = (data) => api.post("/sensors/data", data);
