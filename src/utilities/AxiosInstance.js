// src/utilities/AxiosInstance.js
import axios from "axios";

const AxiosInstance = axios.create({
  //   baseURL: "https://expensive-bend.onrender.com/api", // common base URL

  baseURL: "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json",
  },
});

export default AxiosInstance;
