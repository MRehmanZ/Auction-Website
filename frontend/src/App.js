import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register"; // Assuming you have this component
import VerifyEmail from "./components/VerifyEmail"; // Assuming you have this component
import NavBar from "./components/NavBar"; // Assuming you have this component
import Home from "./components/Home";
import axios from "axios";
import { toast } from "sonner";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

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
