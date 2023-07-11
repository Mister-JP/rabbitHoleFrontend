// /app/api/LocalApi.jsx
import axios from "axios";

const api = axios.create({
  baseURL: "https://jignasu.pythonanywhere.com",
});

export default api;
