import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api/",
  /* "https://sih-kiosk-backend.onrender.com/api/" /* || import.meta.env.VITE_API_URL */ withCredentials: true,
});

export default instance;
