import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../utilities/AxiosInstance";
import { message } from "antd";
import { motion } from "framer-motion"; // for smooth animations
import { User, Mail, Lock } from "lucide-react"; // icons
import { isTokenValid } from "../utilities/authHelpers";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AxiosInstance.post("/auth/register", form);
      message.success("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      message.error(err.response?.data?.error || "Registration failed");
    }
  };

  useEffect(() => {
    if (isTokenValid()) {
      navigate("/expenses"); // already logged in, go to expenses
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-400 to-purple-500 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Create Account
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Username */}
          <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-400">
            <User className="text-gray-400 mr-2" size={20} />
            <input
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full outline-none text-gray-700"
              required
            />
          </div>

          {/* Email */}
          <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-400">
            <Mail className="text-gray-400 mr-2" size={20} />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full outline-none text-gray-700"
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-400">
            <Lock className="text-gray-400 mr-2" size={20} />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full outline-none text-gray-700"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition duration-200"
          >
            Register
          </button>

          {/* Link to Login */}
          <p className="text-center text-sm text-gray-600 mt-3">
            Already have an account?{" "}
            <span
              className="text-indigo-600 font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
