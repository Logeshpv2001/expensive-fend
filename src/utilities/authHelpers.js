import { jwtDecode } from "jwt-decode";

export const isTokenValid = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    console.log("Decoded Token:", decoded); // 👈 check exp value
    const now = Date.now() / 1000;
    return decoded.exp > now;
  } catch (err) {
    console.error("Token error:", err);
    return false;
  }
};
