import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/",
  // This is the critical addition for httpOnly cookies:
  withCredentials: true,
});

export default instance;
