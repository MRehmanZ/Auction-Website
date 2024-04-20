import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register"; // Assuming you have this component
import VerifyEmail from "./components/VerifyEmail"; // Assuming you have this component
import NavBar from "./components/NavBar"; // Assuming you have this component
import Home from "./components/Home";
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div>
        <NavBar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />}></Route>
          <Route path="/verify-email" element={<VerifyEmail />}></Route>
          {/* Add other routes for your application */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
