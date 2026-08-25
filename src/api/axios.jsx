import axios from "axios";

const instance = axios.create({
  baseURL: " https://sih-kiosk-backend.onrender.com/api/",
  /* "http://localhost:8080/api/" /* || import.meta.env.VITE_API_URL */ withCredentials: true,
});

export default instance;
