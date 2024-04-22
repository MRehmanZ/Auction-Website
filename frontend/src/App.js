import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import axios from "axios";
import { toast } from "sonner";
import { Toaster } from "sonner";

import CreateAuction from "./components/CreateAuction";
import Auction from "./components/Auction";
import AboutUs from "./components/AboutUs";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    const response = await axios.post(
      `${process.env.REACT_APP_AUCTION_BACKEND_API_URL}/account/logout`
    );
    if (response.status === 200) {
      toast.success("Successfully signed out");
    }
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div>
        <NavBar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <Toaster position="top-center" richColors />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/register"
            element={<Register onLogin={handleLogin} />}
          />
          <Route path="/create-auction" element={<CreateAuction />} />
          <Route path="/auction/:auction_id" element={<Auction />} />
          <Route path="/aboutus" element={<AboutUs />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
