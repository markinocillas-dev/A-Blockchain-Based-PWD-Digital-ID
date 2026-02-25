import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import AdminDashboard from "./pages/AdminDashboard";
import UserLogin from "./user/UserLogin";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Login */}
        <Route path="/" element={<Login />} />

        {/* Beneficiary Login */}
        <Route path="/user-login" element={<UserLogin />} />

        {/* Admin Dashboard */}
        <Route path="/dashboard/*" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

/* =========================
   ADMIN LOGIN COMPONENT
   ========================= */
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8081/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("admin", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setMessage("Invalid username or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Server error, please try again later.");
    }
  };

  return (
    <div className="login-container">
      <h1>PWD System Login</h1>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Admin Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      {/* Redirect to Beneficiary Login */}
      <button
        type="button"
        className="user-login-btn"
        onClick={() => navigate("/user-login")}
      >
        I’m a user
      </button>

      {message && <p className="error-message">{message}</p>}
    </div>
  );
};

export default App;
