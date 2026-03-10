import axios from "axios";

export const axiosInstance = axios.create({
  // backend listens on 5000 by default; adjust if you changed PORT in the .env
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api",
  withCredentials: true,
});
