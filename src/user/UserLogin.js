import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserLogin.css";

const UserLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8081/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/user-dashboard"); // add later
      } else {
        setMessage("Invalid username or password");
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server");
    }
  };

  return (
    <div className="user-login-wrapper">
      <div className="user-login-card">
        <h1>Welcome Back</h1>
        <p className="subtitle">
          Please log in to access your PWD account
        </p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="login-btn" type="submit">
            Login
          </button>
        </form>

        {message && <p className="error-message">{message}</p>}

        <button
          className="back-btn"
          onClick={() => navigate("/")}
        >
          ← Back to Admin Login
        </button>
      </div>
    </div>
  );
};

export default UserLogin;
