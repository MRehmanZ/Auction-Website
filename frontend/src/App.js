import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/NavBar";
import Register from "./components/Register";
import Login from "./components/Login";
import VerifyEmail from "./components/VerifyEmail";
import Home from "./components/Home";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
