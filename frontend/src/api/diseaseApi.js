import api from "./axios";

export const analyzeDisease = (formData) =>
  api.post("/disease/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const uploadDiseaseImage = analyzeDisease;
export const getDiseaseHistory = () => api.get("/disease");
export const getDiseaseDetection = (hiveId) => api.get(`/disease/hive/${hiveId}`);
