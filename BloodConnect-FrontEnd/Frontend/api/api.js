import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.43.223:5000/api", // Set your base URL here
});

export default api;
