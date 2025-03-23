import axios from "axios";

const API = axios.create({
  baseURL: "https://saas-subscription-manager.onrender.com/api",
});

API.interceptors.request.use((config:any) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getSubscriptions = () => API.get("/subscriptions");
export const addSubscription = (data:any) => API.post("/subscriptions", data);
export const updateSubscription = (id:any, data:any) =>
  API.put(`/subscriptions/${id}`, data);
export const deleteSubscription = (id:any) => API.delete(`/subscriptions/${id}`);