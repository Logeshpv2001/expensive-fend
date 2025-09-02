// // src/utilities/AxiosInstance.js
// import axios from "axios";

// const AxiosInstance = axios.create({

//   baseURL: "http://localhost:5000/api",

//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default AxiosInstance;

// src/utilities/AxiosInstance.js

import axios from "axios";

const AxiosInstance = axios.create({
  // baseURL: "https://expensive-bend.onrender.com/api", // common base URL

  baseURL: "https://expensive-bend-production.up.railway.app/api",

  // baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to attach token to every request
AxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // assuming token is saved in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default AxiosInstance;
