import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Expensive from "./Expensive";
import InstallPWA from "./InstallPWA";
import Register from "./pages/Register";
import Login from "./pages/Login";

const App = () => {
  return (
    <BrowserRouter>
      <InstallPWA />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/expenses" element={<Expensive />} />
        {/* fallback route */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
