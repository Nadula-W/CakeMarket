import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const googleLogin = (data) => API.post("/auth/google", data);

// Cakes
export const createCake = (data) =>
  API.post("/cakes", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const getMyCakes = () => API.get("/cakes/mine");
export const updateCake = (id, data) =>
  API.put(`/cakes/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteCake = (id) => API.delete(`/cakes/${id}`);
export const browseCakes = (params) => API.get("/cakes/browse", { params });

// Orders
export const placeOrder = (data) => API.post("/orders", data);
export const getMyOrders = () => API.get("/orders/mine");
export const getBakerOrders = () => API.get("/orders/baker");
export const updateOrderStatus = (id, data) => API.put(`/orders/${id}/status`, data);

export default API;
