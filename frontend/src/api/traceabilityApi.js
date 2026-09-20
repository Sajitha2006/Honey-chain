import api from "./axios";

export const createBatch = (data) => api.post("/traceability/batch", data);
export const getMyBatches = () => api.get("/traceability/my-batches");
export const getBatch = (batchId) =>
  api.get(`/traceability/verify/${batchId}`);
export const getJourney = (batchId) =>
  api.get(`/traceability/journey/${batchId}`);
export const linkProduct = (batchId, productId) =>
  api.put(`/traceability/batch/${batchId}/link-product`, { productId });
