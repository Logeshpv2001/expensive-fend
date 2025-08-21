import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Expensive from "./Expensive";
import InstallPWA from "./InstallPWA";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute"; // 👈 add this
import { isTokenValid } from "./utilities/authHelpers";

const App = () => {
  return (
    <BrowserRouter>
      <InstallPWA />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route
  path="*"
  element={isTokenValid() ? <Expensive /> : <Login />} // 👈 fixed fallback
/>

        {/* Protected Route */}
        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <Expensive />
            </ProtectedRoute>
          }
        />

        {/* fallback route */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
