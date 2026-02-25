import React, { useEffect, useState } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaIdBadge,
  FaCertificate,
  FaUsersCog,
  FaSignOutAlt,
} from "react-icons/fa";
import axios from "axios";

import DashboardHome from "./DashboardHome";
import Beneficiaries from "./Beneficiaries";
import Certificates from "./Certificates";
import StaffManagement from "./StaffManagement";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Load logged-in admin data
  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    } else {
      navigate("/");
    }
  }, [navigate]);

  // ✅ Fetch admins + beneficiaries once admin is loaded
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resAdmins = await axios.get("http://localhost:8081/api/admins");
        setAdmins(Array.isArray(resAdmins.data) ? resAdmins.data : []);

        const resBeneficiaries = await axios.get(
          "http://localhost:8081/api/beneficiaries"
        );
        setBeneficiaries(resBeneficiaries.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (admin) fetchData();
  }, [admin]);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/");
  };

  if (!admin) return null;
  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="dashboard-container">
      {/* ===== SIDEBAR ===== */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <h2 className="sidebar-title">PWD ID System</h2>

        <ul className="nav-menu">
          <li>
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              onClick={() => setSidebarOpen(false)}
            >
              <FaHome /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/beneficiaries"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              onClick={() => setSidebarOpen(false)}
            >
              <FaIdBadge /> Beneficiaries
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/certificates"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              onClick={() => setSidebarOpen(false)}
            >
              <FaCertificate /> Certificates
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/staffmanagement"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
              onClick={() => setSidebarOpen(false)}
            >
              <FaUsersCog /> Staff Management
            </NavLink>
          </li>
        </ul>

        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* ===== SIDEBAR TOGGLE ===== */}
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen((prev) => !prev)}
      >
        ☰
      </button>

      {/* ===== MAIN CONTENT ===== */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>
            Welcome, {admin.firstname} {admin.lastname}
          </h1>
          <p>Account Type: {admin.accounttype}</p>
        </header>

        <div className="dashboard-content">
          {/* ===== Only show the appropriate component based on route ===== */}
          <Routes>
            <Route 
              index 
              element={
                <DashboardHome 
                  admins={admins} 
                  beneficiaries={beneficiaries} 
                />
              } 
            />
            <Route
              path="beneficiaries"
              element={<Beneficiaries beneficiaries={beneficiaries} />}
            />
            <Route
              path="certificates"
              element={<Certificates beneficiaries={beneficiaries} />}
            />
            <Route path="staffmanagement" element={<StaffManagement />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;