import api from "./axios";

// Get latest health analysis for a hive
export const getHiveHealthById = (hiveId) =>
  api.get(`/health/${hiveId}/latest`);

// Alias used by HiveHealth.jsx
export const getHiveHealth = (hiveId) =>
  api.get(`/health/${hiveId}/latest`);

// Get health history for a hive
export const getHealthHistory = (hiveId) =>
  api.get(`/health/${hiveId}/history`);

// Analyze hive health
export const analyzeHealth = (hiveId) =>
  api.post(`/health/${hiveId}/analyze`);

export const analyzeHiveHealth = analyzeHealth;